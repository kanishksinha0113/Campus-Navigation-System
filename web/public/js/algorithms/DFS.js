import { IPathfinder, PathResult } from './IPathfinder.js';

export class DFSPathfinder extends IPathfinder {
    constructor() {
        super('DFS', 'O(V + E)', 'Depth-First Traversal (Stack Connectivity)');
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

        const stack = [srcId];
        const visited = new Set();
        const parent = new Map();

        while (stack.length > 0) {
            const u = stack.pop();

            if (visited.has(u)) continue;
            visited.add(u);
            res.nodesExpanded++;
            res.visitOrder.push(u);

            if (u === dstId) {
                res.success = true;
                break;
            }

            for (const edge of graph.getNeighbors(u)) {
                if (!visited.has(edge.to)) {
                    if (!parent.has(edge.to)) parent.set(edge.to, u);
                    stack.push(edge.to);
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

            let d = 0;
            for (let i = 0; i < res.path.length - 1; ++i) {
                const edge = graph.getNeighbors(res.path[i]).find(e => e.to === res.path[i + 1]);
                d += edge ? edge.weight : 0;
            }
            res.distance = d;
            res.distanceMeters = Math.round(d * 20.0);
        }

        res.runtimeMs = performance.now() - start;
        return res;
    }
}
