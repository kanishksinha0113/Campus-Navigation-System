#include "AStarPathfinder.h"
#include "graph/Graph.h"
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <cmath>

static float heuristic(const Graph& g, int u, int dst) {
    auto n1 = g.getNode(u);
    auto n2 = g.getNode(dst);
    if (!n1 || !n2) return 0.0f;
    float dx = n1->x - n2->x;
    float dy = n1->y - n2->y;
    return std::sqrt(dx*dx + dy*dy);
}

PathResult AStarPathfinder::findPath(const Graph& g, int src, int dst) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.success = false;
    
    using P = std::pair<float, int>;
    std::priority_queue<P, std::vector<P>, std::greater<P>> pq;
    
    std::unordered_map<int, float> gScore;
    std::unordered_map<int, int> parent;
    std::unordered_set<int> visited;
    
    gScore[src] = 0.0f;
    pq.push({heuristic(g, src, dst), src});
    
    while (!pq.empty()) {
        auto [f, u] = pq.top();
        pq.pop();
        
        if (visited.count(u)) continue;
        visited.insert(u);
        res.visitOrder.push_back(u);
        res.nodesExpanded++;
        
        if (u == dst) {
            res.success = true;
            res.distance = gScore[u];
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
            float new_g = gScore[u] + edge.weight;
            if (gScore.find(edge.to) == gScore.end() || new_g < gScore[edge.to]) {
                gScore[edge.to] = new_g;
                parent[edge.to] = u;
                float new_f = new_g + heuristic(g, edge.to, dst);
                pq.push({new_f, edge.to});
            }
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
