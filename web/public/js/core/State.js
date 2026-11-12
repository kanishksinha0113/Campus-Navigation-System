/**
 * CampusNav3D — Reactive Central Store & Event Bus
 */

export class Store {
    constructor() {
        this.state = {
            graph: null,
            startNode: null,        // Node object or null
            endNode: null,          // Node object or null
            selectedAlgo: 'Dijkstra',
            activePathResult: null,
            waypoints: [],          // array of Node objects for multi-stop
            isAnimating: false,
            revealStep: 0,
            theme: 'midnight',      // 'midnight' | 'cyberpunk' | 'daylight'
            cameraMode: 'orbit',    // 'orbit' | 'topdown' | 'firstperson'
            showBenchmarkModal: false,
            showMapOverlay: false,
            showTurnByTurn: true,
            walkingSpeedMps: 1.4,   // 1.4 m/s (approx 5 km/h)
            cyclingSpeedMps: 4.5,   // 4.5 m/s (approx 16 km/h)
            travelMode: 'walk'      // 'walk' | 'bike'
        };

        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
        return () => this.listeners.get(event).delete(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(cb => {
                try { cb(data, this.state); } catch (e) { console.error(`Error in listener for ${event}:`, e); }
            });
        }
    }

    set(partial) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...partial };
        this.emit('stateChange', { oldState, newState: this.state, changedKeys: Object.keys(partial) });
    }

    get() {
        return this.state;
    }

    selectNode(node) {
        if (!this.state.startNode) {
            this.set({ startNode: node });
            this.emit('nodeSelected', { slot: 'start', node });
        } else if (!this.state.endNode) {
            if (node.id === this.state.startNode.id) return;
            this.set({ endNode: node });
            this.emit('nodeSelected', { slot: 'end', node });
            this.emit('triggerSolve');
        } else {
            // Third selection resets and chooses as new start
            this.set({ startNode: node, endNode: null, activePathResult: null });
            this.emit('nodeSelected', { slot: 'start', node });
        }
    }

    swapEndpoints() {
        if (this.state.startNode && this.state.endNode) {
            const start = this.state.startNode;
            const end = this.state.endNode;
            this.set({ startNode: end, endNode: start });
            this.emit('triggerSolve');
        }
    }

    clearEndpoints() {
        this.set({ startNode: null, endNode: null, activePathResult: null });
        this.emit('endpointsCleared');
    }
}

export const appStore = new Store();
