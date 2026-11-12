import { BFSPathfinder } from './BFS.js';
import { DFSPathfinder } from './DFS.js';
import { DijkstraPathfinder } from './Dijkstra.js';
import { AStarPathfinder } from './AStar.js';
import { BellmanFordPathfinder } from './BellmanFord.js';
import { FloydWarshallPathfinder } from './FloydWarshall.js';

export class BenchmarkEngine {
    constructor() {
        this.algorithms = [
            new BFSPathfinder(),
            new DFSPathfinder(),
            new DijkstraPathfinder(),
            new AStarPathfinder(),
            new BellmanFordPathfinder(),
            new FloydWarshallPathfinder()
        ];
    }

    runComparison(graph, srcId, dstId) {
        const results = [];

        for (const algo of this.algorithms) {
            // Warm-up and execute
            const res = algo.findPath(graph, srcId, dstId);
            results.push({
                name: algo.name,
                complexity: algo.complexity,
                designTechnique: algo.designTechnique,
                distance: res.distance,
                distanceMeters: res.distanceMeters,
                nodesExpanded: res.nodesExpanded,
                runtimeMs: res.runtimeMs,
                success: res.success,
                pathLength: res.path.length
            });
        }

        // Compute Dijkstra vs A* efficiency delta
        const dijkstraRes = results.find(r => r.name === 'Dijkstra');
        const astarRes = results.find(r => r.name === 'A*');

        let astarExpansionReductionPct = 0;
        if (dijkstraRes && astarRes && dijkstraRes.nodesExpanded > 0) {
            astarExpansionReductionPct = Math.round(
                ((dijkstraRes.nodesExpanded - astarRes.nodesExpanded) / dijkstraRes.nodesExpanded) * 100.0
            );
        }

        return {
            results,
            dijkstraVsAStar: {
                dijkstraExpansions: dijkstraRes ? dijkstraRes.nodesExpanded : 0,
                astarExpansions: astarRes ? astarRes.nodesExpanded : 0,
                reductionPercent: Math.max(0, astarExpansionReductionPct),
                insight: `A* expands ${Math.max(0, astarExpansionReductionPct)}% fewer nodes than Dijkstra on this query by guiding frontier search along the Euclidean vector toward the destination, confirming the DAA design-vs-analysis distinction.`
            }
        };
    }
}
