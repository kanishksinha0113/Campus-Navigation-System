#include "NNTwoOptTSP.h"
#include "DijkstraPathfinder.h"
#include "graph/Graph.h"
#include <limits>
#include <algorithm>
#include <unordered_set>

PathResult NNTwoOptTSP::solveTSP(const Graph& g, const std::vector<int>& waypoints) {
    auto start = std::chrono::high_resolution_clock::now();
    PathResult res;
    res.success = false;
    
    int n = waypoints.size();
    if (n == 0) return res;
    
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
    
    std::vector<int> tour;
    tour.push_back(0);
    std::unordered_set<int> unvisited;
    for (int i = 1; i < n; ++i) unvisited.insert(i);
    
    int curr = 0;
    while (!unvisited.empty()) {
        int best_next = -1;
        float min_d = std::numeric_limits<float>::infinity();
        for (int v : unvisited) {
            if (dist[curr][v] < min_d) {
                min_d = dist[curr][v];
                best_next = v;
            }
        }
        tour.push_back(best_next);
        unvisited.erase(best_next);
        curr = best_next;
    }
    
    bool improved = true;
    while (improved) {
        improved = false;
        for (int i = 1; i < n - 1; ++i) {
            for (int j = i + 1; j < n; ++j) {
                int a = tour[i-1], b = tour[i], c = tour[j], d = (j+1 == n) ? tour[0] : tour[j+1];
                float old_dist = dist[a][b] + dist[c][d];
                float new_dist = dist[a][c] + dist[b][d];
                if (new_dist < old_dist - 1e-5) {
                    std::reverse(tour.begin() + i, tour.begin() + j + 1);
                    improved = true;
                }
            }
        }
    }
    
    tour.push_back(0);
    float total_dist = 0;
    
    res.success = true;
    for (size_t i = 0; i < tour.size() - 1; ++i) {
        int u = waypoints[tour[i]];
        int v = waypoints[tour[i+1]];
        auto sub_res = dijkstra.findPath(g, u, v);
        total_dist += sub_res.distance;
        for (size_t k = 0; k < sub_res.path.size(); ++k) {
            if (k > 0 || res.path.empty()) {
                res.path.push_back(sub_res.path[k]);
            }
        }
    }
    res.distance = total_dist;
    
    auto end = std::chrono::high_resolution_clock::now();
    res.runtimeMs = std::chrono::duration<double, std::milli>(end - start).count();
    return res;
}
