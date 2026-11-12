#pragma once
#include "IPathfinder.h"

class BFSPathfinder : public IPathfinder {
public:
    PathResult findPath(const Graph& g, int src, int dst) override;
    AlgorithmType type() const override { return AlgorithmType::BFS; }
};
