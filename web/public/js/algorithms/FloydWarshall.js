import { IPathfinder, PathResult } from './IPathfinder.js';

export class FloydWarshallPathfinder extends IPathfinder {
    constructor() {
        super('Floyd-Warshall', 'O(V^3) pre / O(V) query', 'Dynamic Programming All-Pairs Matrix');
        this.dist = null;
        this.next = null;
        this.nodeToIndex = new Map();
        this.indexToNode = [];
        this.precomputed = false;
    }

    precompute(graph) {
        const nodes = graph.getAllNodes();
        const V = nodes.length;

        this.nodeToIndex.clear();
        this.indexToNode = [];

        nodes.forEach((n, idx) => {
            this.nodeToIndex.set(n.id, idx);
            this.indexToNode.push(n.id);
        });

        this.dist = Array.from({ length: V }, () => new Float32Array(V).fill(Infinity));
        this.next = Array.from({ length: V }, () => new Int16Array(V).fill(-1));

        for (let i = 0; i < V; ++i) {
            this.dist[i][i] = 0.0;
            this.next[i][i] = i;
        }

        for (const uNode of nodes) {
            const u = this.nodeToIndex.get(uNode.id);
            for (const edge of graph.getNeighbors(uNode.id)) {
                const v = this.nodeToIndex.get(edge.to);
                if (v !== undefined) {
                    this.dist[u][v] = edge.weight;
                    this.next[u][v] = v;
                }
            }
        }

        for (let k = 0; k < V; ++k) {
            for (let i = 0; i < V; ++i) {
                const dik = this.dist[i][k];
                if (dik === Infinity) continue;
                for (let j = 0; j < V; ++j) {
                    const dkj = this.dist[k][j];
                    if (dkj === Infinity) continue;
                    if (dik + dkj < this.dist[i][j]) {
                        this.dist[i][j] = dik + dkj;
                        this.next[i][j] = this.next[i][k];
                    }
                }
            }
        }

        this.precomputed = true;
    }

    findPath(graph, srcId, dstId) {
        const start = performance.now();
        const res = new PathResult();
        res.algorithm = this.name;
        res.complexity = this.complexity;
        res.designTechnique = this.designTechnique;

        if (!this.precomputed) {
            this.precompute(graph);
        }

        const u = this.nodeToIndex.get(srcId);
        const v = this.nodeToIndex.get(dstId);

        if (u === undefined || v === undefined || this.dist[u][v] === Infinity) {
            res.errorMsg = 'No route available between selected landmarks.';
            res.runtimeMs = performance.now() - start;
            return res;
        }

        res.success = true;
        res.distance = this.dist[u][v];
        res.distanceMeters = Math.round(res.distance * 20.0);

        let curr = u;
        res.path.push(this.indexToNode[curr]);

        while (curr !== v) {
            curr = this.next[curr][v];
            if (curr === -1) break;
            const nid = this.indexToNode[curr];
            res.path.push(nid);
            res.visitOrder.push(nid);
            res.nodesExpanded++;
        }

        res.runtimeMs = performance.now() - start;
        return res;
    }
}
