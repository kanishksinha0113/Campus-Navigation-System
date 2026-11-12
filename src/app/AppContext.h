#pragma once
#include "algorithms/IPathfinder.h"
#include "algorithms/Benchmark.h"
#include <vector>

enum class AppState {
    Idle,    // waiting for start+end selection
    Query,   // both nodes selected, waiting for "Find Route" or auto-trigger
    Solve,   // running algorithm
    Animate, // path animating node by node
    Result   // animation done, showing stats; can change algo or pick new nodes
};

struct AppContext {
    AppState    state         = AppState::Idle;
    int         startNode     = -1;
    int         endNode       = -1;
    AlgorithmType selectedAlgo = AlgorithmType::Dijkstra;
    AlgorithmType prevAlgo     = AlgorithmType::Dijkstra;
    PathResult  lastResult;
    std::vector<BenchmarkResult> lastBenchmark;
    std::vector<int> waypoints;   // multi-stop waypoints
    float       revealTimer   = 0.0f;
    bool        benchmarkPending = false;
};
