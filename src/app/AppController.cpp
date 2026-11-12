// Include order matters: raylib before imgui backends
#include "raylib.h"
#include "raymath.h"
#include "rlImGui.h"
#include "imgui.h"

#include "graph/Graph.h"
#include "algorithms/IPathfinder.h"
#include "algorithms/FloydWarshallPathfinder.h"
#include "algorithms/Benchmark.h"
#include "algorithms/HeldKarpTSP.h"
#include "algorithms/NNTwoOptTSP.h"
#include "render/OrbitCamera.h"
#include "render/CampusRenderer.h"
#include "render/PathAnimator.h"
#include "ui/UIManager.h"
#include "app/AppContext.h"
#include <memory>
#include <iostream>
#include <filesystem>

// ─── State machine ────────────────────────────────────────────────────────────

static void UpdateApp(AppContext& ctx, float dt,
                      const Graph& graph,
                      PathAnimator& animator,
                      UIManager& ui)
{
    // Sync from UI state
    const UIState& uiState = ui.state();

    // Multi-stop TSP request
    if (uiState.solveTSPClicked && uiState.waypointList.size() >= 2) {
        PathResult tspRes;
        if (uiState.useTwoOpt) {
            NNTwoOptTSP solver;
            tspRes = solver.solveTSP(graph, uiState.waypointList);
        } else {
            HeldKarpTSP solver;
            tspRes = solver.solveTSP(graph, uiState.waypointList);
        }
        ctx.lastResult = tspRes;
        ctx.selectedAlgo = uiState.selectedAlgo;
        ctx.prevAlgo = uiState.selectedAlgo;
        animator.start(ctx.lastResult, graph);
        ctx.state = AppState::Animate;
        ui.clearSolveTSPClicked();
    }

    // Benchmark request
    if (uiState.benchmarkClicked) {
        if (ctx.startNode != -1 && ctx.endNode != -1) {
            ctx.lastBenchmark = Benchmark::runAll(graph, ctx.startNode, ctx.endNode);
        }
        ui.clearBenchmarkClicked();
    }

    // Sync node selection and algorithm from UI
    ctx.startNode    = uiState.startNode;
    ctx.endNode      = uiState.endNode;
    ctx.selectedAlgo = uiState.selectedAlgo;

    switch (ctx.state) {
        case AppState::Idle:
            if (ctx.startNode != -1 && ctx.endNode != -1)
                ctx.state = AppState::Query;
            break;

        case AppState::Query:
            // Auto-trigger solve when both nodes are set
            if (ctx.startNode != -1 && ctx.endNode != -1)
                ctx.state = AppState::Solve;
            if (uiState.resetClicked) {
                ctx.state = AppState::Idle;
                ui.clearResetClicked();
            }
            break;

        case AppState::Solve:
        {
            if (ctx.startNode != -1 && ctx.endNode != -1) {
                auto pf = makePathfinder(ctx.selectedAlgo);
                ctx.lastResult = pf->findPath(graph, ctx.startNode, ctx.endNode);
                ctx.prevAlgo   = ctx.selectedAlgo;
                animator.start(ctx.lastResult, graph);
                ctx.state = AppState::Animate;
            } else {
                ctx.state = AppState::Idle;
            }
            break;
        }

        case AppState::Animate:
            animator.update(dt);
            if (animator.isFinished())
                ctx.state = AppState::Result;
            break;

        case AppState::Result:
            // Algorithm changed → re-solve same endpoints
            if (ctx.selectedAlgo != ctx.prevAlgo)
                ctx.state = AppState::Solve;
            // Explicit find-route click
            if (uiState.findRouteClicked) {
                ctx.state = AppState::Solve;
                ui.clearFindRouteClicked();
            }
            // Reset
            if (uiState.resetClicked) {
                ctx.state = AppState::Idle;
                animator.reset();
                ui.clearResetClicked();
            }
            break;
    }
}

// ─── main ─────────────────────────────────────────────────────────────────────

int main(int argc, char** argv) {
    // ── Locate data directory ──
    std::filesystem::path exeDir = std::filesystem::path(argv[0]).parent_path();
    std::filesystem::path dataDir = exeDir / "data";
    if (!std::filesystem::exists(dataDir)) {
        // Try cwd/data as fallback
        dataDir = std::filesystem::current_path() / "data";
    }

    std::string nodesFile = (dataDir / "campus_nodes.json").string();
    std::string edgesFile = (dataDir / "campus_edges.json").string();

    // ── Load graph ──
    Graph graph;
    try {
        graph = GraphLoader::loadFromJSON(nodesFile, edgesFile);
    } catch (const std::exception& e) {
        std::cerr << "Error loading graph: " << e.what() << std::endl;
        std::cerr << "Tried: " << nodesFile << std::endl;
        // Continue with empty graph so the window still opens
    }

    // Print graph summary
    printGraph(graph);

    // ── Precompute Floyd-Warshall (all-pairs, once at startup) ──
    FloydWarshallPathfinder fwPrecomputed;
    if (graph.nodeCount() > 0)
        fwPrecomputed.precompute(graph);

    // ── Raylib + ImGui init ──
    SetConfigFlags(FLAG_WINDOW_RESIZABLE | FLAG_MSAA_4X_HINT);
    InitWindow(1280, 720, "CampusNav3D — IIT Delhi Shortest Path Navigator");
    SetTargetFPS(60);
    rlImGuiSetup(true);

    // ── Subsystem init ──
    OrbitCamera   camera;
    CampusRenderer renderer;
    PathAnimator  pathAnimator;
    UIManager     uiManager;
    AppContext    ctx;

    if (graph.nodeCount() > 0) {
        renderer.init(graph);
        uiManager.init(graph);
    }

    // ── Main loop ──
    while (!WindowShouldClose()) {
        float dt = GetFrameTime();

        // Update camera (orbit + fly-to)
        camera.update(dt);

        // Sync UI → context → state machine
        UpdateApp(ctx, dt, graph, pathAnimator, uiManager);

        // 3D node picking (only when ImGui is not consuming mouse)
        if (!ImGui::GetIO().WantCaptureMouse && IsMouseButtonPressed(MOUSE_BUTTON_LEFT)) {
            Ray ray = GetMouseRay(GetMousePosition(), camera.getCamera());
            int picked = renderer.pickNode(ray);
            if (picked != -1)
                uiManager.notifyNodeClicked(picked);
        }

        // Camera fly-to route midpoint when a result is ready
        if (ctx.state == AppState::Animate || ctx.state == AppState::Result) {
            if (!ctx.lastResult.path.empty()) {
                int midId = ctx.lastResult.path[ctx.lastResult.path.size() / 2];
                auto midNode = graph.getNode(midId);
                if (midNode) {
                    Vector3 worldMid = CampusRenderer::graphToWorld(midNode->x, midNode->y);
                    worldMid.y = 0;
                    camera.flyTo(worldMid, dt);
                }
            }
        }

        // ── Draw ──
        BeginDrawing();
        bool isLight = uiManager.state().themeLight;
        ClearBackground(isLight ? Color{215, 230, 245, 255} : Color{10, 10, 30, 255}); // day sky vs night navy

        BeginMode3D(camera.getCamera());
            renderer.draw(camera.getCamera(),
                          ctx.lastResult.path,
                          pathAnimator.revealCount(),
                          isLight);
            pathAnimator.draw();
        EndMode3D();

        // ImGui overlay
        rlImGuiBegin();
            uiManager.draw(ctx.lastResult, ctx.lastBenchmark);
        rlImGuiEnd();

        EndDrawing();
    }

    // ── Cleanup ──
    renderer.unload();
    rlImGuiShutdown();
    CloseWindow();

    return 0;
}
