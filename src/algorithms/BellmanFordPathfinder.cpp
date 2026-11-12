#include "BellmanFordPathfinder.h"
#include "graph/Graph.h"
#include <unordered_map>
#include <algorithm>
#include <limits>

PathResult BellmanFordPathfinder::findPath(const Graph& g, int src, int dst) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.success = false;
    
    std::unordered_map<int, float> dist;
    std::unordered_map<int, int> parent;
    
    auto nodes = g.getAllNodes();
    for (const auto& node : nodes) {
        dist[node.id] = std::numeric_limits<float>::infinity();
    }
    dist[src] = 0.0f;
    
    int V = nodes.size();
    for (int i = 0; i < V - 1; ++i) {
        bool changed = false;
        for (const auto& node : nodes) {
            int u = node.id;
            if (dist[u] == std::numeric_limits<float>::infinity()) continue;
            
            for (const auto& edge : g.getNeighbors(u)) {
                if (dist[u] + edge.weight < dist[edge.to]) {
                    dist[edge.to] = dist[u] + edge.weight;
                    parent[edge.to] = u;
                    res.visitOrder.push_back(edge.to);
                    res.nodesExpanded++;
                    changed = true;
                }
            }
        }
        if (!changed) break;
    }
    
    // Check for negative weight cycles
    for (const auto& node : nodes) {
        int u = node.id;
        if (dist[u] == std::numeric_limits<float>::infinity()) continue;
        for (const auto& edge : g.getNeighbors(u)) {
            if (dist[u] + edge.weight < dist[edge.to]) {
                res.errorMsg = "Graph contains a negative-weight cycle";
                auto end = std::chrono::high_resolution_clock::now();
                res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
                return res;
            }
        }
    }
    
    if (dist[dst] != std::numeric_limits<float>::infinity()) {
        res.success = true;
        res.distance = dist[dst];
        int curr = dst;
        while (curr != src) {
            res.path.push_back(curr);
            curr = parent[curr];
        }
        res.path.push_back(src);
        std::reverse(res.path.begin(), res.path.end());
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
