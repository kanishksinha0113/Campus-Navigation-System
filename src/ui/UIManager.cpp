#include "ui/UIManager.h"
#include <imgui.h>
#include <string>
#include <algorithm>

void UIManager::init(const Graph& g) {
    _graph = &g;
    _allNodes = g.getAllNodes();
}

void UIManager::draw(const PathResult& lastResult, const std::vector<BenchmarkResult>& benchResults) {
    drawSearchPanel();
    drawAlgorithmSelector();
    drawStatsPanel(lastResult);
    drawLegend();
    drawMultiStopPanel();
    if (_showBenchmark) {
        drawBenchmarkPanel(benchResults);
    }
}

void UIManager::notifyNodeClicked(int nodeId) {
    if (_state.startNode == -1) {
        _state.startNode = nodeId;
    } else if (_state.endNode == -1) {
        _state.endNode = nodeId;
    } else {
        // Third click restarts selection with new start node
        _state.startNode = nodeId;
        _state.endNode = -1;
    }
}

void UIManager::drawSearchPanel() {
    ImGui::Begin("Route Planner", nullptr, ImGuiWindowFlags_AlwaysAutoResize);

    // Current Selection Display
    std::string startName = "None (click 3D scene or search)";
    std::string endName   = "None (click 3D scene or search)";
    if (_graph) {
        auto s = _graph->getNode(_state.startNode);
        if (s) startName = s->name + " (" + categoryToString(s->category) + ")";
        auto e = _graph->getNode(_state.endNode);
        if (e) endName = e->name + " (" + categoryToString(e->category) + ")";
    }

    ImGui::TextColored(ImVec4(0.4f, 0.8f, 1.0f, 1.0f), "Start: %s", startName.c_str());
    ImGui::SameLine();
    if (_state.startNode != -1 && ImGui::SmallButton("Clear##start")) {
        _state.startNode = -1;
    }

    ImGui::TextColored(ImVec4(1.0f, 0.6f, 0.2f, 1.0f), "End:   %s", endName.c_str());
    ImGui::SameLine();
    if (_state.endNode != -1 && ImGui::SmallButton("Clear##end")) {
        _state.endNode = -1;
    }

    if (_state.startNode != -1 && _state.endNode != -1) {
        if (ImGui::Button("Swap Endpoints")) {
            std::swap(_state.startNode, _state.endNode);
            _state.findRouteClicked = true;
        }
    }

    ImGui::Separator();
    ImGui::Text("Autocomplete Search:");

    ImGui::InputText("Start Search", _startBuf, sizeof(_startBuf));
    _startFilter = _startBuf;
    if (!_startFilter.empty()) {
        ImGui::BeginChild("start_matches", ImVec2(0, 100), true);
        for (const auto& n : _allNodes) {
            std::string label = n.name + " [" + categoryToString(n.category) + "]";
            if (n.name.find(_startFilter) != std::string::npos ||
                categoryToString(n.category).find(_startFilter) != std::string::npos) {
                if (ImGui::Selectable(label.c_str())) {
                    _state.startNode = n.id;
                    _startBuf[0] = '\0';
                    _startFilter = "";
                }
            }
        }
        ImGui::EndChild();
    }

    ImGui::InputText("End Search", _endBuf, sizeof(_endBuf));
    _endFilter = _endBuf;
    if (!_endFilter.empty()) {
        ImGui::BeginChild("end_matches", ImVec2(0, 100), true);
        for (const auto& n : _allNodes) {
            std::string label = n.name + " [" + categoryToString(n.category) + "]";
            if (n.name.find(_endFilter) != std::string::npos ||
                categoryToString(n.category).find(_endFilter) != std::string::npos) {
                if (ImGui::Selectable(label.c_str())) {
                    _state.endNode = n.id;
                    _endBuf[0] = '\0';
                    _endFilter = "";
                }
            }
        }
        ImGui::EndChild();
    }

    ImGui::Separator();
    if (ImGui::Button("Find Route", ImVec2(120, 0))) {
        _state.findRouteClicked = true;
    }
    ImGui::SameLine();
    if (ImGui::Button("Reset All", ImVec2(100, 0))) {
        _state.resetClicked = true;
        _state.startNode = -1;
        _state.endNode = -1;
    }

    ImGui::End();
}

void UIManager::drawAlgorithmSelector() {
    ImGui::Begin("Algorithms", nullptr, ImGuiWindowFlags_AlwaysAutoResize);
    const char* algos[] = { "BFS", "DFS", "Dijkstra", "AStar", "BellmanFord", "FloydWarshall" };
    int current = static_cast<int>(_state.selectedAlgo);
    if (current > 5) current = 2; // clamp if TSP was selected
    if (ImGui::Combo("Algorithm", &current, algos, IM_ARRAYSIZE(algos))) {
        _state.selectedAlgo = static_cast<AlgorithmType>(current);
    }

    ImGui::Spacing();
    if (ImGui::Button("Run Benchmark (All 6 Algos)", ImVec2(220, 0))) {
        _state.benchmarkClicked = true;
        _showBenchmark = true;
    }
    if (_showBenchmark) {
        ImGui::SameLine();
        if (ImGui::Button("Hide Results")) {
            _showBenchmark = false;
        }
    }

    ImGui::Separator();
    if (_state.themeLight) {
        if (ImGui::Button("Theme: Day (Light) -> Switch to Night")) {
            _state.themeLight = false;
        }
    } else {
        if (ImGui::Button("Theme: Night (Dark) -> Switch to Day")) {
            _state.themeLight = true;
        }
    }
    ImGui::End();
}

void UIManager::drawStatsPanel(const PathResult& result) {
    if (result.path.empty()) return;
    ImGui::Begin("Stats & Big-O", nullptr, ImGuiWindowFlags_AlwaysAutoResize);

    ImGui::TextColored(ImVec4(1.0f, 0.85f, 0.2f, 1.0f), "Shortest Path Found: %d nodes", (int)result.path.size());
    ImGui::Text("Total Distance: %.1f units (~%.0f m)", result.distance, result.distance * 20.0f);
    ImGui::Text("Walking ETA:    %.1f min (at 1.4 m/s)", (result.distance * 20.0f / 1.4f) / 60.0f);
    ImGui::Text("Nodes Expanded: %d", result.nodesExpanded);
    ImGui::Text("Execution Time: %.3f ms", result.runtimeMs);

    std::string comp = "";
    std::string tech = "";
    switch(_state.selectedAlgo) {
        case AlgorithmType::BFS:
            comp = "O(V + E)";
            tech = "Breadth-First Traversal (Unweighted)";
            break;
        case AlgorithmType::DFS:
            comp = "O(V + E)";
            tech = "Depth-First Traversal (Connectivity)";
            break;
        case AlgorithmType::Dijkstra:
            comp = "O((V + E) log V)";
            tech = "Greedy + Min-Heap (Non-negative)";
            break;
        case AlgorithmType::AStar:
            comp = "O((V + E) log V) worst-case";
            tech = "Greedy + Euclidean Heuristic (Admissible)";
            break;
        case AlgorithmType::BellmanFord:
            comp = "O(V * E)";
            tech = "Dynamic Programming (Edge Relaxations)";
            break;
        case AlgorithmType::FloydWarshall:
            comp = "O(V^3) precomputed / O(V) query";
            tech = "Dynamic Programming All-Pairs";
            break;
        case AlgorithmType::HeldKarpTSP:
            comp = "O(n^2 * 2^n)";
            tech = "DP + Bitmask (Exact TSP)";
            break;
        case AlgorithmType::NNTwoOptTSP:
            comp = "O(n^2) per 2-opt pass";
            tech = "Greedy Nearest Neighbor + 2-Opt Local Search";
            break;
        default:
            comp = "O(?)";
            tech = "";
            break;
    }
    ImGui::Separator();
    ImGui::TextColored(ImVec4(0.4f, 1.0f, 0.6f, 1.0f), "Complexity: %s", comp.c_str());
    ImGui::TextDisabled("Design: %s", tech.c_str());

    ImGui::End();
}

void UIManager::drawLegend() {
    ImGui::Begin("Campus Legend", nullptr, ImGuiWindowFlags_AlwaysAutoResize);
    struct CatItem { const char* name; ImVec4 color; };
    static const CatItem items[] = {
        {"Hostel",      ImVec4(0.0f, 0.47f, 0.95f, 1.0f)}, // BLUE
        {"Academic",    ImVec4(1.0f, 0.84f, 0.0f,  1.0f)}, // GOLD
        {"Food",        ImVec4(1.0f, 0.63f, 0.0f,  1.0f)}, // ORANGE
        {"Shopping",    ImVec4(0.78f,0.48f, 0.90f, 1.0f)}, // PURPLE
        {"ATM",         ImVec4(0.95f,0.26f, 0.21f, 1.0f)}, // RED
        {"Medical",     ImVec4(0.30f,0.69f, 0.31f, 1.0f)}, // GREEN
        {"Sports",      ImVec4(0.40f,0.75f, 0.95f, 1.0f)}, // SKYBLUE
        {"Market",      ImVec4(0.53f,0.12f, 0.47f, 1.0f)}, // VIOLET
        {"Residence",   ImVec4(0.83f,0.77f, 0.69f, 1.0f)}, // BEIGE
        {"Gate",        ImVec4(0.0f, 0.90f, 0.0f,  1.0f)}, // LIME
        {"Guesthouse",  ImVec4(1.0f, 0.43f, 0.78f, 1.0f)}  // PINK
    };

    for (const auto& item : items) {
        ImGui::ColorButton(item.name, item.color, ImGuiColorEditFlags_NoTooltip, ImVec2(14, 14));
        ImGui::SameLine();
        ImGui::Text("%s", item.name);
    }
    ImGui::End();
}

void UIManager::drawMultiStopPanel() {
    ImGui::Begin("Multi-Stop Trip Builder (TSP)", nullptr, ImGuiWindowFlags_AlwaysAutoResize);

    ImGui::Text("Waypoints (%d):", (int)_state.waypointList.size());

    // Add current start / end buttons
    if (_state.startNode != -1) {
        if (ImGui::SmallButton("+ Add Current Start")) {
            if (std::find(_state.waypointList.begin(), _state.waypointList.end(), _state.startNode) == _state.waypointList.end())
                _state.waypointList.push_back(_state.startNode);
        }
        ImGui::SameLine();
    }
    if (_state.endNode != -1) {
        if (ImGui::SmallButton("+ Add Current End")) {
            if (std::find(_state.waypointList.begin(), _state.waypointList.end(), _state.endNode) == _state.waypointList.end())
                _state.waypointList.push_back(_state.endNode);
        }
    }

    // Quick node selector dropdown
    static int addNodeIdx = 0;
    if (!_allNodes.empty()) {
        std::string currentLabel = _allNodes[addNodeIdx].name;
        if (ImGui::BeginCombo("Add POI", currentLabel.c_str())) {
            for (int i = 0; i < (int)_allNodes.size(); ++i) {
                bool isSelected = (addNodeIdx == i);
                if (ImGui::Selectable(_allNodes[i].name.c_str(), isSelected)) {
                    addNodeIdx = i;
                }
                if (isSelected) ImGui::SetItemDefaultFocus();
            }
            ImGui::EndCombo();
        }
        ImGui::SameLine();
        if (ImGui::Button("Add")) {
            int nid = _allNodes[addNodeIdx].id;
            if (std::find(_state.waypointList.begin(), _state.waypointList.end(), nid) == _state.waypointList.end())
                _state.waypointList.push_back(nid);
        }
    }

    ImGui::Separator();

    // List of waypoints
    int removeIdx = -1;
    for (int i = 0; i < (int)_state.waypointList.size(); ++i) {
        int nid = _state.waypointList[i];
        std::string name = "Node " + std::to_string(nid);
        if (_graph) {
            auto node = _graph->getNode(nid);
            if (node) name = node->name;
        }

        ImGui::PushID(i);
        ImGui::Text("%d. %s", i + 1, name.c_str());
        ImGui::SameLine();
        if (i > 0 && ImGui::SmallButton("^")) {
            std::swap(_state.waypointList[i], _state.waypointList[i - 1]);
        }
        ImGui::SameLine();
        if (i + 1 < (int)_state.waypointList.size() && ImGui::SmallButton("v")) {
            std::swap(_state.waypointList[i], _state.waypointList[i + 1]);
        }
        ImGui::SameLine();
        if (ImGui::SmallButton("X")) {
            removeIdx = i;
        }
        ImGui::PopID();
    }

    if (removeIdx != -1) {
        _state.waypointList.erase(_state.waypointList.begin() + removeIdx);
    }

    ImGui::Separator();
    if (_state.waypointList.size() >= 2) {
        if (ImGui::Button("Solve TSP (Held-Karp Exact)")) {
            _state.useTwoOpt = false;
            _state.solveTSPClicked = true;
            _state.selectedAlgo = AlgorithmType::HeldKarpTSP;
        }
        if (ImGui::Button("Solve TSP (Nearest-Neighbor + 2-Opt)")) {
            _state.useTwoOpt = true;
            _state.solveTSPClicked = true;
            _state.selectedAlgo = AlgorithmType::NNTwoOptTSP;
        }
    } else {
        ImGui::TextDisabled("Add at least 2 waypoints to plan TSP route");
    }

    if (!_state.waypointList.empty()) {
        if (ImGui::Button("Clear All Waypoints")) {
            _state.waypointList.clear();
        }
    }

    ImGui::End();
}

void UIManager::drawBenchmarkPanel(const std::vector<BenchmarkResult>& results) {
    ImGui::Begin("Benchmark Results — Design vs Analysis", &_showBenchmark, ImGuiWindowFlags_AlwaysAutoResize);
    ImGui::Text("Empirical vs Theoretical Comparison on same (Src -> Dst) query:");
    ImGui::Separator();

    if (ImGui::BeginTable("bench", 5, ImGuiTableFlags_Borders | ImGuiTableFlags_RowBg)) {
        ImGui::TableSetupColumn("Algorithm");
        ImGui::TableSetupColumn("Distance");
        ImGui::TableSetupColumn("Nodes Expanded");
        ImGui::TableSetupColumn("Runtime (ms)");
        ImGui::TableSetupColumn("Theoretical Complexity");
        ImGui::TableHeadersRow();

        const char* complexities[] = {
            "O(V + E)",
            "O(V + E)",
            "O((V + E) log V)",
            "O((V + E) log V) worst",
            "O(V * E)",
            "O(V^3) pre / O(V) query"
        };

        for (const auto& r : results) {
            ImGui::TableNextRow();
            ImGui::TableSetColumnIndex(0);
            ImGui::Text("%s", r.name.c_str());
            ImGui::TableSetColumnIndex(1);
            if (r.success) {
                ImGui::Text("%.1f", r.distance);
            } else {
                ImGui::TextDisabled("N/A");
            }
            ImGui::TableSetColumnIndex(2);
            // Highlight A* node expansion efficiency
            if (r.algo == AlgorithmType::AStar) {
                ImGui::TextColored(ImVec4(0.3f, 1.0f, 0.4f, 1.0f), "%d (heuristic)", r.nodesExpanded);
            } else {
                ImGui::Text("%d", r.nodesExpanded);
            }
            ImGui::TableSetColumnIndex(3);
            ImGui::Text("%.3f ms", r.runtimeMs);
            ImGui::TableSetColumnIndex(4);
            int algoIdx = static_cast<int>(r.algo);
            if (algoIdx >= 0 && algoIdx < 6)
                ImGui::Text("%s", complexities[algoIdx]);
            else
                ImGui::Text("-");
        }
        ImGui::EndTable();
    }

    ImGui::Spacing();
    ImGui::TextColored(ImVec4(0.9f, 0.9f, 0.5f, 1.0f),
        "Note: A* shares the worst-case O((V+E)log V) bound with Dijkstra,\n"
        "but empirically expands significantly fewer nodes via its Euclidean heuristic.");
    ImGui::End();
}
