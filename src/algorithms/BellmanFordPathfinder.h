#pragma once
#include "IPathfinder.h"

class BellmanFordPathfinder : public IPathfinder {
public:
    PathResult findPath(const Graph& g, int src, int dst) override;
    AlgorithmType type() const override { return AlgorithmType::BellmanFord; }
};
