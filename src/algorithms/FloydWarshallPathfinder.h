#pragma once
#include "IPathfinder.h"
#include <unordered_map>
#include <vector>

class FloydWarshallPathfinder : public IPathfinder {
public:
    void precompute(const Graph& g);
    PathResult findPath(const Graph& g, int src, int dst) override;
    AlgorithmType type() const override { return AlgorithmType::FloydWarshall; }
private:
    std::unordered_map<int, int> nodeToIndex;
    std::unordered_map<int, int> indexToNode;
    std::vector<std::vector<float>> dist;
    std::vector<std::vector<int>> next;
};
