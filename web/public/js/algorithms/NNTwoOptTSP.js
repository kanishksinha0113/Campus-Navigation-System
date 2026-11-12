import { PathResult } from './IPathfinder.js';
import { DijkstraPathfinder } from './Dijkstra.js';

export class NNTwoOptTSP {
    constructor() {
        this.name = 'Nearest-Neighbor + 2-Opt';
        this.complexity = 'O(n^2) per 2-opt pass';
        this.designTechnique = 'Greedy Construction + Local Search Edge Swaps';
    }

    solveTSP(graph, waypoints) {
        const start = performance.now();
        const res = new PathResult();
        res.algorithm = this.name;
        res.complexity = this.complexity;
        res.designTechnique = this.designTechnique;

        const n = waypoints.length;
        if (n < 2) {
            res.errorMsg = 'At least 2 waypoints required for TSP itinerary.';
            res.runtimeMs = performance.now() - start;
            return res;
        }

        const dijkstra = new DijkstraPathfinder();
        const dist = Array.from({ length: n }, () => new Float32Array(n));
        const subPaths = Array.from({ length: n }, () => Array(n).fill(null));

        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
                if (i === j) continue;
                const sub = dijkstra.findPath(graph, waypoints[i], waypoints[j]);
                if (!sub.success) {
                    res.errorMsg = `Disconnected waypoint: ${waypoints[i]} to ${waypoints[j]}`;
                    res.runtimeMs = performance.now() - start;
                    return res;
                }
                dist[i][j] = sub.distance;
                subPaths[i][j] = sub.path;
            }
        }

        // 1. Greedy Nearest Neighbor construction
        const visited = new Set([0]);
        let tour = [0];
        let curr = 0;

        while (tour.length < n) {
            let nextNearest = -1;
            let bestDist = Infinity;

            for (let j = 0; j < n; ++j) {
                if (!visited.has(j) && dist[curr][j] < bestDist) {
                    bestDist = dist[curr][j];
                    nextNearest = j;
                }
            }

            if (nextNearest === -1) break;
            visited.add(nextNearest);
            tour.push(nextNearest);
            curr = nextNearest;
        }

        tour.push(0); // Return to start

        // 2. 2-Opt local search improvement passes
        let improved = true;
        let passes = 0;
        const maxPasses = 50;

        const getTourDistance = (t) => {
            let d = 0;
            for (let i = 0; i < t.length - 1; ++i) {
                d += dist[t[i]][t[i + 1]];
            }
            return d;
        };

        while (improved && passes < maxPasses) {
            improved = false;
            passes++;

            for (let i = 1; i < n - 1; ++i) {
                for (let k = i + 1; k < n; ++k) {
                    // Cost change from swapping edges (i-1, i) and (k, k+1) with (i-1, k) and (i, k+1)
                    const delta = (dist[tour[i - 1]][tour[k]] + dist[tour[i]][tour[k + 1]]) -
                                  (dist[tour[i - 1]][tour[i]] + dist[tour[k]][tour[k + 1]]);

                    if (delta < -1e-4) {
                        // Reverse subsegment tour[i ... k]
                        const reversed = tour.slice(i, k + 1).reverse();
                        tour = [...tour.slice(0, i), ...reversed, ...tour.slice(k + 1)];
                        improved = true;
                    }
                }
            }
        }

        res.success = true;
        res.distance = getTourDistance(tour);
        res.distanceMeters = Math.round(res.distance * 20.0);

        // Stitch complete continuous campus road path
        res.path = [];
        for (let i = 0; i < tour.length - 1; ++i) {
            const u = tour[i];
            const v = tour[i + 1];
            const segment = subPaths[u][v];

            for (let k = 0; k < segment.length; ++k) {
                if (k > 0 || res.path.length === 0) {
                    res.path.push(segment[k]);
                }
            }
        }

        res.visitOrder = [...res.path];
        res.nodesExpanded = passes * n * n;
        res.runtimeMs = performance.now() - start;
        return res;
    }
}
