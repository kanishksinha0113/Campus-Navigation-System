#include "DijkstraPathfinder.h"
#include "graph/Graph.h"
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <limits>

PathResult DijkstraPathfinder::findPath(const Graph& g, int src, int dst) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.success = false;
    
    using P = std::pair<float, int>;
    std::priority_queue<P, std::vector<P>, std::greater<P>> pq;
    
    std::unordered_map<int, float> dist;
    std::unordered_map<int, int> parent;
    std::unordered_set<int> visited;
    
    pq.push({0.0f, src});
    dist[src] = 0.0f;
    
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        
        if (visited.count(u)) continue;
        visited.insert(u);
        res.visitOrder.push_back(u);
        res.nodesExpanded++;
        
        if (u == dst) {
            res.success = true;
            res.distance = d;
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
            if (visited.count(edge.to)) continue;
            float new_d = d + edge.weight;
            if (dist.find(edge.to) == dist.end() || new_d < dist[edge.to]) {
                dist[edge.to] = new_d;
                parent[edge.to] = u;
                pq.push({new_d, edge.to});
            }
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
