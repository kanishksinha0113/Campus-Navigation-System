/**
 * CampusNav3D — DAA Core Interface & Data Structures
 */

export class MinPriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(item, priority) {
        this.heap.push({ item, priority });
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        const top = this.heap[0];
        const bottom = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = bottom;
            this._sinkDown(0);
        }
        return top;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    size() {
        return this.heap.length;
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parentIdx = Math.floor((index - 1) / 2);
            if (this.heap[index].priority < this.heap[parentIdx].priority) {
                const temp = this.heap[index];
                this.heap[index] = this.heap[parentIdx];
                this.heap[parentIdx] = temp;
                index = parentIdx;
            } else {
                break;
            }
        }
    }

    _sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftIdx = 2 * index + 1;
            let rightIdx = 2 * index + 2;
            let smallest = index;

            if (leftIdx < length && this.heap[leftIdx].priority < this.heap[smallest].priority) {
                smallest = leftIdx;
            }
            if (rightIdx < length && this.heap[rightIdx].priority < this.heap[smallest].priority) {
                smallest = rightIdx;
            }

            if (smallest !== index) {
                const temp = this.heap[index];
                this.heap[index] = this.heap[smallest];
                this.heap[smallest] = temp;
                index = smallest;
            } else {
                break;
            }
        }
    }
}

export class PathResult {
    constructor() {
        this.path = [];             // Ordered array of node IDs from src to dst
        this.visitOrder = [];       // Array of node IDs visited during algorithm expansion
        this.distance = 0.0;        // Path weight
        this.distanceMeters = 0;    // Approximate real-world distance in meters
        this.nodesExpanded = 0;     // Number of nodes dequeued or relaxed
        this.runtimeMs = 0.0;       // Wall-clock runtime in milliseconds
        this.success = false;
        this.errorMsg = '';
        this.algorithm = '';
        this.complexity = '';
        this.designTechnique = '';
    }
}

export class IPathfinder {
    constructor(name, complexity, designTechnique) {
        this.name = name;
        this.complexity = complexity;
        this.designTechnique = designTechnique;
    }

    findPath(graph, srcId, dstId) {
        throw new Error("findPath must be implemented by subclass");
    }
}
