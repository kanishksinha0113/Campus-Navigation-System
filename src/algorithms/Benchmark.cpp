#include "Benchmark.h"
#include <memory>
#include "FloydWarshallPathfinder.h"

std::vector<BenchmarkResult> Benchmark::runAll(const Graph& g, int src, int dst) {
    std::vector<BenchmarkResult> results;
    AlgorithmType algos[] = {
        AlgorithmType::BFS, 
        AlgorithmType::DFS, 
        AlgorithmType::Dijkstra, 
        AlgorithmType::AStar, 
        AlgorithmType::BellmanFord,
        AlgorithmType::FloydWarshall
    };
    
    for (auto algo : algos) {
        auto pathfinder = makePathfinder(algo);
        if (pathfinder) {
            if (algo == AlgorithmType::FloydWarshall) {
                // Precompute explicitly since Floyd-Warshall needs it
                dynamic_cast<FloydWarshallPathfinder*>(pathfinder.get())->precompute(g);
            }
            auto res = pathfinder->findPath(g, src, dst);
            results.push_back({
                algo,
                algorithmName(algo),
                res.distance,
                res.nodesExpanded,
                res.runtimeMs,
                res.success
            });
        }
    }
    return results;
}
