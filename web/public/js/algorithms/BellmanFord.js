import { IPathfinder, PathResult } from './IPathfinder.js';

export class BellmanFordPathfinder extends IPathfinder {
    constructor() {
        super('Bellman-Ford', 'O(V * E)', 'Dynamic Programming (Iterative Edge Relaxations)');
    }

    findPath(graph, srcId, dstId) {
        const start = performance.now();
        const res = new PathResult();
        res.algorithm = this.name;
        res.complexity = this.complexity;
        res.designTechnique = this.designTechnique;

        if (!graph.getNode(srcId) || !graph.getNode(dstId)) {
            res.errorMsg = 'Source or destination node not found.';
            res.runtimeMs = performance.now() - start;
            return res;
        }

        const nodes = graph.getAllNodes();
        const dist = new Map();
        const parent = new Map();

        for (const n of nodes) {
            dist.set(n.id, Infinity);
        }
        dist.set(srcId, 0.0);

        const V = nodes.length;
        const allEdges = [];
        for (const n of nodes) {
            for (const e of graph.getNeighbors(n.id)) {
                allEdges.push(e);
            }
        }

        for (let i = 0; i < V - 1; ++i) {
            let changed = false;
            for (const edge of allEdges) {
                const uDist = dist.get(edge.from);
                if (uDist !== Infinity && uDist + edge.weight < dist.get(edge.to)) {
                    dist.set(edge.to, uDist + edge.weight);
                    parent.set(edge.to, edge.from);
                    res.visitOrder.push(edge.to);
                    res.nodesExpanded++;
                    changed = true;
                }
            }
            if (!changed) break;
        }

        // Check for negative-weight cycle
        for (const edge of allEdges) {
            const uDist = dist.get(edge.from);
            if (uDist !== Infinity && uDist + edge.weight < dist.get(edge.to)) {
                res.errorMsg = 'Graph contains a negative-weight cycle.';
                res.runtimeMs = performance.now() - start;
                return res;
            }
        }

        if (dist.get(dstId) !== Infinity) {
            res.success = true;
            res.distance = dist.get(dstId);
            res.distanceMeters = Math.round(res.distance * 20.0);

            let curr = dstId;
            while (curr !== srcId) {
                res.path.push(curr);
                curr = parent.get(curr);
            }
            res.path.push(srcId);
            res.path.reverse();
        }

        res.runtimeMs = performance.now() - start;
        return res;
    }
}
