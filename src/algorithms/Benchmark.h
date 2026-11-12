#pragma once
#include "IPathfinder.h"
#include <vector>

struct BenchmarkResult {
    AlgorithmType algo;
    std::string name;
    float distance;
    int nodesExpanded;
    double runtimeMs;
    bool success;
};

class Benchmark {
public:
    static std::vector<BenchmarkResult> runAll(const Graph& g, int src, int dst);
};
