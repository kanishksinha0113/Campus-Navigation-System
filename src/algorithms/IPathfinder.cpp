#include "IPathfinder.h"
#include "BFSPathfinder.h"
#include "DFSPathfinder.h"
#include "DijkstraPathfinder.h"
#include "AStarPathfinder.h"
#include "BellmanFordPathfinder.h"
#include "FloydWarshallPathfinder.h"

std::string algorithmName(AlgorithmType t) {
    switch (t) {
        case AlgorithmType::BFS: return "BFS";
        case AlgorithmType::DFS: return "DFS";
        case AlgorithmType::Dijkstra: return "Dijkstra";
        case AlgorithmType::AStar: return "AStar";
        case AlgorithmType::BellmanFord: return "BellmanFord";
        case AlgorithmType::FloydWarshall: return "FloydWarshall";
        case AlgorithmType::HeldKarpTSP: return "HeldKarpTSP";
        case AlgorithmType::NNTwoOptTSP: return "NNTwoOptTSP";
        default: return "Unknown";
    }
}

std::unique_ptr<IPathfinder> makePathfinder(AlgorithmType t) {
    switch (t) {
        case AlgorithmType::BFS: return std::make_unique<BFSPathfinder>();
        case AlgorithmType::DFS: return std::make_unique<DFSPathfinder>();
        case AlgorithmType::Dijkstra: return std::make_unique<DijkstraPathfinder>();
        case AlgorithmType::AStar: return std::make_unique<AStarPathfinder>();
        case AlgorithmType::BellmanFord: return std::make_unique<BellmanFordPathfinder>();
        case AlgorithmType::FloydWarshall: return std::make_unique<FloydWarshallPathfinder>();
        default: return nullptr;
    }
}
