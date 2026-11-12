#pragma once
#include <vector>
#include <string>
#include <chrono>
#include <memory>

enum class AlgorithmType { BFS, DFS, Dijkstra, AStar, BellmanFord, FloydWarshall, HeldKarpTSP, NNTwoOptTSP };

std::string algorithmName(AlgorithmType t);

struct PathResult {
    std::vector<int> path;        // final optimal path node IDs
    std::vector<int> visitOrder;  // all nodes visited in algorithm order (for animation)
    float distance = 0.0f;               // total path weight
    int nodesExpanded = 0;            // count of nodes dequeued/relaxed
    double runtimeMs = 0.0;             // measured wall time
    bool success = false;                 // false if no path exists
    std::string errorMsg;
};

class Graph;

class IPathfinder {
public:
    virtual ~IPathfinder() = default;
    virtual PathResult findPath(const Graph& g, int src, int dst) = 0;
    virtual AlgorithmType type() const = 0;
};

std::unique_ptr<IPathfinder> makePathfinder(AlgorithmType t);
