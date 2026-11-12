#pragma once
#include "IPathfinder.h"
#include <vector>

class HeldKarpTSP {
public:
    PathResult solveTSP(const Graph& g, const std::vector<int>& waypoints);
};
