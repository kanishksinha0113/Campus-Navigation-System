#include "BFSPathfinder.h"
#include "graph/Graph.h"
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>

PathResult BFSPathfinder::findPath(const Graph& g, int src, int dst) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.distance = 0;
    res.success = false;
    
    std::queue<int> q;
    std::unordered_map<int, int> parent;
    std::unordered_set<int> visited;
    std::unordered_map<int, float> dist;
    
    q.push(src);
    visited.insert(src);
    dist[src] = 0;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        res.visitOrder.push_back(u);
        res.nodesExpanded++;
        
        if (u == dst) {
            res.success = true;
            res.distance = dist[u];
            int curr = dst;
            while (curr != src) {
                res.path.push_back(curr);
                curr = parent[curr];
            }
            res.path.push_back(src);
            std::reverse(res.path.begin(), res.path.end());
            break;
        }
        
        for (const auto& edge : g.getNeighbors(u)) {
            if (visited.find(edge.to) == visited.end()) {
                visited.insert(edge.to);
                parent[edge.to] = u;
                dist[edge.to] = dist[u] + 1.0f; // unweighted hop count
                q.push(edge.to);
            }
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
