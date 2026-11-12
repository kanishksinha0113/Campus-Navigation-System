import { PathResult } from './IPathfinder.js';
import { DijkstraPathfinder } from './Dijkstra.js';

export class HeldKarpTSP {
    constructor() {
        this.name = 'Held-Karp TSP';
        this.complexity = 'O(n^2 * 2^n)';
        this.designTechnique = 'Dynamic Programming + Bitmask (Exact Tour)';
    }

    solveTSP(graph, waypoints) {
        const start = performance.now();
        const res = new PathResult();
        res.algorithm = this.name;
        res.complexity = this.complexity;
        res.designTechnique = this.designTechnique;

        const n = waypoints.length;
        if (n < 2) {
            res.errorMsg = 'At least 2 waypoints required for TSP route.';
            res.runtimeMs = performance.now() - start;
            return res;
        }

        if (n > 14) {
            res.errorMsg = 'Held-Karp exact DP supports up to 14 waypoints. Use 2-Opt for larger sets.';
            res.runtimeMs = performance.now() - start;
            return res;
        }

        // Pairwise shortest paths between all waypoints using Dijkstra
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

        const numSubsets = 1 << n;
        const dp = Array.from({ length: numSubsets }, () => new Float32Array(n).fill(Infinity));
        const parent = Array.from({ length: numSubsets }, () => new Int16Array(n).fill(-1));

        dp[1][0] = 0.0; // Start at waypoint 0

        for (let mask = 1; mask < numSubsets; mask += 2) { // must include start (bit 0)
            for (let i = 0; i < n; ++i) {
                if (!(mask & (1 << i))) continue;
                const dmi = dp[mask][i];
                if (dmi === Infinity) continue;

                for (let j = 0; j < n; ++j) {
                    if (mask & (1 << j)) continue;

                    const nextMask = mask | (1 << j);
                    const newCost = dmi + dist[i][j];

                    if (newCost < dp[nextMask][j]) {
                        dp[nextMask][j] = newCost;
                        parent[nextMask][j] = i;
                    }
                }
            }
        }

        // Connect back to origin for a complete loop
        const fullMask = numSubsets - 1;
        let minTourCost = Infinity;
        let lastNode = -1;

        for (let i = 1; i < n; ++i) {
            const cost = dp[fullMask][i] + dist[i][0];
            if (cost < minTourCost) {
                minTourCost = cost;
                lastNode = i;
            }
        }

        if (lastNode === -1) {
            res.errorMsg = 'No valid Hamiltonian cycle found.';
            res.runtimeMs = performance.now() - start;
            return res;
        }

        res.success = true;
        res.distance = minTourCost;
        res.distanceMeters = Math.round(minTourCost * 20.0);

        // Reconstruct waypoint visitation order
        const tourIdx = [];
        let currMask = fullMask;
        let currNode = lastNode;

        while (currNode !== -1) {
            tourIdx.push(currNode);
            const prev = parent[currMask][currNode];
            currMask &= ~(1 << currNode);
            currNode = prev;
        }

        tourIdx.reverse();
        tourIdx.push(0); // return to start

        // Stitch complete continuous campus road path
        res.path = [];
        for (let i = 0; i < tourIdx.length - 1; ++i) {
            const u = tourIdx[i];
            const v = tourIdx[i + 1];
            const segment = subPaths[u][v];

            for (let k = 0; k < segment.length; ++k) {
                if (k > 0 || res.path.length === 0) {
                    res.path.push(segment[k]);
                }
            }
        }

        res.visitOrder = [...res.path];
        res.nodesExpanded = numSubsets * n;
        res.runtimeMs = performance.now() - start;
        return res;
    }
}
