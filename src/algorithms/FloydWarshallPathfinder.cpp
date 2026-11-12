#include "FloydWarshallPathfinder.h"
#include "graph/Graph.h"
#include <limits>
#include <algorithm>

void FloydWarshallPathfinder::precompute(const Graph& g) {
    auto nodes = g.getAllNodes();
    int V = nodes.size();
    
    nodeToIndex.clear();
    indexToNode.clear();
    
    std::vector<int> sorted_ids;
    for (const auto& n : nodes) {
        sorted_ids.push_back(n.id);
    }
    std::sort(sorted_ids.begin(), sorted_ids.end());
    
    for (int i = 0; i < V; ++i) {
        nodeToIndex[sorted_ids[i]] = i;
        indexToNode[i] = sorted_ids[i];
    }
    
    dist.assign(V, std::vector<float>(V, std::numeric_limits<float>::infinity()));
    next.assign(V, std::vector<int>(V, -1));
    
    for (int i = 0; i < V; ++i) {
        dist[i][i] = 0.0f;
        next[i][i] = i;
    }
    
    for (const auto& n : nodes) {
        int u = nodeToIndex[n.id];
        for (const auto& edge : g.getNeighbors(n.id)) {
            int v = nodeToIndex[edge.to];
            dist[u][v] = edge.weight;
            next[u][v] = v;
        }
    }
    
    for (int k = 0; k < V; ++k) {
        for (int i = 0; i < V; ++i) {
            for (int j = 0; j < V; ++j) {
                if (dist[i][k] != std::numeric_limits<float>::infinity() && 
                    dist[k][j] != std::numeric_limits<float>::infinity() && 
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }
}

PathResult FloydWarshallPathfinder::findPath(const Graph& g, int src, int dst) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.success = false;
    
    if (dist.empty()) {
        precompute(g);
    }
    
    if (nodeToIndex.find(src) == nodeToIndex.end() || nodeToIndex.find(dst) == nodeToIndex.end()) {
        res.errorMsg = "Source or destination not found";
        return res;
    }
    
    int u = nodeToIndex[src];
    int v = nodeToIndex[dst];
    
    if (next[u][v] == -1) {
        return res;
    }
    
    res.success = true;
    res.distance = dist[u][v];
    
    int curr = u;
    res.path.push_back(indexToNode[curr]);
    while (curr != v) {
        curr = next[curr][v];
        res.path.push_back(indexToNode[curr]);
        res.visitOrder.push_back(indexToNode[curr]);
        res.nodesExpanded++;
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
