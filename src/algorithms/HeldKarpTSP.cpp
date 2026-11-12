#include "HeldKarpTSP.h"
#include "DijkstraPathfinder.h"
#include "graph/Graph.h"
#include <limits>
#include <algorithm>

PathResult HeldKarpTSP::solveTSP(const Graph& g, const std::vector<int>& waypoints) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.success = false;
    
    int n = waypoints.size();
    if (n == 0) return res;
    if (n > 20) {
        res.errorMsg = "Too many waypoints for Held-Karp";
        return res;
    }
    
    std::vector<std::vector<float>> dist(n, std::vector<float>(n, 0.0f));
    DijkstraPathfinder dijkstra;
    
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < n; ++j) {
            if (i == j) continue;
            auto sub_res = dijkstra.findPath(g, waypoints[i], waypoints[j]);
            if (!sub_res.success) {
                res.errorMsg = "Disconnected waypoints";
                return res;
            }
            dist[i][j] = sub_res.distance;
        }
    }
    
    int num_subsets = 1 << n;
    std::vector<std::vector<float>> dp(num_subsets, std::vector<float>(n, std::numeric_limits<float>::infinity()));
    std::vector<std::vector<int>> parent(num_subsets, std::vector<int>(n, -1));
    
    dp[1][0] = 0.0f; // Start at waypoint 0
    
    for (int mask = 1; mask < num_subsets; mask += 2) { // mask must contain 0
        for (int i = 0; i < n; ++i) {
            if (!(mask & (1 << i))) continue;
            
            for (int j = 0; j < n; ++j) {
                if (mask & (1 << j)) continue;
                
                int next_mask = mask | (1 << j);
                if (dp[mask][i] + dist[i][j] < dp[next_mask][j]) {
                    dp[next_mask][j] = dp[mask][i] + dist[i][j];
                    parent[next_mask][j] = i;
                }
            }
        }
    }
    
    int last = -1;
    float min_cost = std::numeric_limits<float>::infinity();
    int full_mask = num_subsets - 1;
    
    for (int i = 1; i < n; ++i) {
        if (dp[full_mask][i] + dist[i][0] < min_cost) {
            min_cost = dp[full_mask][i] + dist[i][0];
            last = i;
        }
    }
    
    if (last == -1) {
        res.errorMsg = "No valid TSP tour found";
        return res;
    }
    
    res.success = true;
    res.distance = min_cost;
    
    std::vector<int> tour_idx;
    int curr_mask = full_mask;
    int curr_node = last;
    
    while (curr_node != -1) {
        tour_idx.push_back(curr_node);
        int prev = parent[curr_mask][curr_node];
        curr_mask &= ~(1 << curr_node);
        curr_node = prev;
    }
    
    std::reverse(tour_idx.begin(), tour_idx.end());
    tour_idx.push_back(0); // return to start
    
    for (size_t i = 0; i < tour_idx.size() - 1; ++i) {
        int u = waypoints[tour_idx[i]];
        int v = waypoints[tour_idx[i+1]];
        auto sub_res = dijkstra.findPath(g, u, v);
        
        for (size_t j = 0; j < sub_res.path.size(); ++j) {
            if (j > 0 || res.path.empty()) {
                res.path.push_back(sub_res.path[j]);
            }
        }
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
