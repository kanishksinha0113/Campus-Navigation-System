#include "DFSPathfinder.h"
#include "graph/Graph.h"
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>

PathResult DFSPathfinder::findPath(const Graph& g, int src, int dst) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.distance = 0;
    res.success = false;
    
    std::stack<int> s;
    std::unordered_map<int, int> parent;
    std::unordered_set<int> visited;
    
    s.push(src);
    
    while (!s.empty()) {
        int u = s.top();
        s.pop();
        
        if (visited.find(u) == visited.end()) {
            visited.insert(u);
            res.visitOrder.push_back(u);
            res.nodesExpanded++;
            
            if (u == dst) {
                res.success = true;
                int curr = dst;
                while (curr != src) {
                    res.path.push_back(curr);
                    curr = parent[curr];
                    res.distance += 1.0f; // roughly calculate length in hops
                }
                res.path.push_back(src);
                std::reverse(res.path.begin(), res.path.end());
                break;
            }
            
            auto neighbors = g.getNeighbors(u);
            std::reverse(neighbors.begin(), neighbors.end());
            for (const auto& edge : neighbors) {
                if (visited.find(edge.to) == visited.end()) {
                    if (parent.find(edge.to) == parent.end()) {
                        parent[edge.to] = u;
                    }
                    s.push(edge.to);
                }
            }
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
