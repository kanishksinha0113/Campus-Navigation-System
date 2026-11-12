import { IPathfinder, PathResult, MinPriorityQueue } from './IPathfinder.js';

export class AStarPathfinder extends IPathfinder {
    constructor() {
        super('A*', 'O((V + E) log V) worst', 'Greedy + Euclidean Heuristic (Admissible & Consistent)');
    }

    heuristic(graph, uId, dstId) {
        const u = graph.getNode(uId);
        const dst = graph.getNode(dstId);
        if (!u || !dst) return 0;
        const dx = u.x - dst.x;
        const dy = u.y - dst.y;
        return Math.hypot(dx, dy);
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
        const gScore = new Map();
        const parent = new Map();
        const visited = new Set();

        gScore.set(srcId, 0.0);
        pq.push(srcId, this.heuristic(graph, srcId, dstId));

        while (!pq.isEmpty()) {
            const { item: u } = pq.pop();

            if (visited.has(u)) continue;
            visited.add(u);
            res.nodesExpanded++;
            res.visitOrder.push(u);

            if (u === dstId) {
                res.success = true;
                const d = gScore.get(u);
                res.distance = d;
                res.distanceMeters = Math.round(d * 20.0);
                break;
            }

            const currentG = gScore.get(u);

            for (const edge of graph.getNeighbors(u)) {
                if (visited.has(edge.to)) continue;

                const tentativeG = currentG + edge.weight;
                const knownG = gScore.has(edge.to) ? gScore.get(edge.to) : Infinity;

                if (tentativeG < knownG) {
                    gScore.set(edge.to, tentativeG);
                    parent.set(edge.to, u);
                    const fScore = tentativeG + this.heuristic(graph, edge.to, dstId);
                    pq.push(edge.to, fScore);
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
