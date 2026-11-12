#pragma once
#include "graph/Graph.h"
#include "algorithms/IPathfinder.h"
#include "algorithms/Benchmark.h"
#include <vector>
#include <string>
#include <functional>

struct UIState {
    int startNode = -1;
    int endNode   = -1;
    AlgorithmType selectedAlgo = AlgorithmType::Dijkstra;
    std::vector<int> waypointList; // for multi-stop
    bool findRouteClicked = false;
    bool benchmarkClicked = false;
    bool resetClicked = false;
    bool solveTSPClicked = false;
    bool useTwoOpt = false;
    bool themeLight = false;
};

class UIManager {
public:
    // Call once after rlImGui is initialized
    void init(const Graph& g);
    
    // Call every frame between rlImGuiBegin() and rlImGuiEnd()
    void draw(const PathResult& lastResult, const std::vector<BenchmarkResult>& benchResults);
    
    // Read by app controller each frame
    const UIState& state() const { return _state; }
    void clearFindRouteClicked() { _state.findRouteClicked = false; }
    void clearBenchmarkClicked() { _state.benchmarkClicked = false; }
    void clearResetClicked()     { _state.resetClicked = false; }
    void clearSolveTSPClicked()  { _state.solveTSPClicked = false; }
    
    // Called by app when a 3D node is clicked
    void notifyNodeClicked(int nodeId);
    
private:
    void drawSearchPanel();
    void drawAlgorithmSelector();
    void drawStatsPanel(const PathResult& result);
    void drawLegend();
    void drawMultiStopPanel();
    void drawBenchmarkPanel(const std::vector<BenchmarkResult>& results);
    
    UIState _state;
    const Graph* _graph = nullptr;
    std::vector<Node> _allNodes;
    char _startBuf[128] = {};
    char _endBuf[128] = {};
    std::string _startFilter;
    std::string _endFilter;
    std::vector<Node> _startMatches;
    std::vector<Node> _endMatches;
    bool _showBenchmark = false;
};
