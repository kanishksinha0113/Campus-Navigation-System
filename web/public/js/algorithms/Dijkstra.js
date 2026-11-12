import { IPathfinder, PathResult, MinPriorityQueue } from './IPathfinder.js';

export class DijkstraPathfinder extends IPathfinder {
    constructor() {
        super('Dijkstra', 'O((V + E) log V)', 'Greedy + Min-Heap (Non-Negative Weights)');
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

        const pq = new MinPriorityQueue();
        const dist = new Map();
        const parent = new Map();
        const visited = new Set();

        dist.set(srcId, 0.0);
        pq.push(srcId, 0.0);

        while (!pq.isEmpty()) {
            const { item: u, priority: d } = pq.pop();

            if (visited.has(u)) continue;
            visited.add(u);
            res.nodesExpanded++;
            res.visitOrder.push(u);

            if (u === dstId) {
                res.success = true;
                res.distance = d;
                res.distanceMeters = Math.round(d * 20.0);
                break;
            }

            for (const edge of graph.getNeighbors(u)) {
                if (visited.has(edge.to)) continue;

                const newDist = d + edge.weight;
                const currDist = dist.has(edge.to) ? dist.get(edge.to) : Infinity;

                if (newDist < currDist) {
                    dist.set(edge.to, newDist);
                    parent.set(edge.to, u);
                    pq.push(edge.to, newDist);
                }
            }
        }

        if (res.success) {
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
