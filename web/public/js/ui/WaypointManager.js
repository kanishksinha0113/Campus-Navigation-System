/**
 * CampusNav3D — Multi-Stop Itinerary & TSP Trip Planner
 */
import { HeldKarpTSP } from '../algorithms/HeldKarpTSP.js';
import { NNTwoOptTSP } from '../algorithms/NNTwoOptTSP.js';

export class WaypointManager {
    constructor(store, graph) {
        this.store = store;
        this.graph = graph;
        this.heldKarp = new HeldKarpTSP();
        this.nnTwoOpt = new NNTwoOptTSP();

        this.dom = document.getElementById('waypoint-hud');
        this.waypoints = [];
        this._bindEvents();
    }

    _bindEvents() {
        this.store.on('stateChange', ({ changedKeys }) => {
            if (changedKeys.includes('waypoints')) {
                this.waypoints = this.store.get().waypoints;
                this.render();
            }
        });
    }

    render() {
        const nodes = this.graph.getAllNodes();

        this.dom.innerHTML = `
            <div class="hud-panel glass-panel waypoint-card">
                <div class="waypoint-header">
                    <span class="hud-icon">🧭</span>
                    <span class="hud-title">Multi-Stop Trip Planner</span>
                    <span class="waypoint-count">${this.waypoints.length}</span>
                </div>

                <div class="waypoint-add-bar">
                    <select id="select-add-poi" class="custom-select">
                        <option value="">+ Add Landmark to Trip...</option>
                        ${nodes.map(n => `<option value="${n.id}">${n.name} (${n.category})</option>`).join('')}
                    </select>
                    <button class="btn-add-poi" id="btn-add-poi">Add</button>
                </div>

                <div class="waypoints-list" id="waypoints-list">
                    ${this.waypoints.length === 0 ? `
                        <div class="waypoints-empty">
                            Add 2 or more stops to optimize a multi-destination itinerary using Traveling Salesperson algorithms.
                        </div>
                    ` : this.waypoints.map((wp, i) => `
                        <div class="waypoint-item" data-index="${i}">
                            <span class="waypoint-index">${i + 1}</span>
                            <span class="waypoint-icon">${wp.categoryMeta.icon}</span>
                            <div class="waypoint-info">
                                <div class="waypoint-name">${wp.name}</div>
                                <div class="waypoint-cat">${wp.category}</div>
                            </div>
                            <div class="waypoint-controls">
                                ${i > 0 ? `<button class="btn-wp-move" data-action="up" data-index="${i}">↑</button>` : ''}
                                ${i < this.waypoints.length - 1 ? `<button class="btn-wp-move" data-action="down" data-index="${i}">↓</button>` : ''}
                                <button class="btn-wp-remove" data-action="remove" data-index="${i}">&times;</button>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${this.waypoints.length >= 2 ? `
                    <div class="tsp-actions">
                        <button class="btn-solve-tsp btn-held-karp" id="btn-solve-held-karp">
                            <span class="btn-title">Held-Karp Exact DP</span>
                            <span class="btn-sub">O(n²·2ⁿ) Optimal Tour</span>
                        </button>
                        <button class="btn-solve-tsp btn-two-opt" id="btn-solve-two-opt">
                            <span class="btn-title">Nearest-Neighbor + 2-Opt</span>
                            <span class="btn-sub">O(n²) Fast Local Search</span>
                        </button>
                    </div>
                ` : ''}

                ${this.waypoints.length > 0 ? `
                    <button class="btn-clear-waypoints" id="btn-clear-waypoints">Clear All Waypoints</button>
                ` : ''}
            </div>
        `;

        this._bindDOMEvents();
    }

    _bindDOMEvents() {
        const btnAdd = this.dom.querySelector('#btn-add-poi');
        const select = this.dom.querySelector('#select-add-poi');
        if (btnAdd && select) {
            btnAdd.addEventListener('click', () => {
                const id = parseInt(select.value, 10);
                if (!isNaN(id)) {
                    const node = this.graph.getNode(id);
                    if (node && !this.waypoints.some(w => w.id === node.id)) {
                        const next = [...this.waypoints, node];
                        this.store.set({ waypoints: next });
                    }
                }
            });
        }

        this.dom.querySelectorAll('.btn-wp-move').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                const action = e.currentTarget.dataset.action;
                const next = [...this.waypoints];
                if (action === 'up' && idx > 0) {
                    const temp = next[idx];
                    next[idx] = next[idx - 1];
                    next[idx - 1] = temp;
                } else if (action === 'down' && idx < next.length - 1) {
                    const temp = next[idx];
                    next[idx] = next[idx + 1];
                    next[idx + 1] = temp;
                }
                this.store.set({ waypoints: next });
            });
        });

        this.dom.querySelectorAll('.btn-wp-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.index, 10);
                const next = this.waypoints.filter((_, i) => i !== idx);
                this.store.set({ waypoints: next });
            });
        });

        const btnClear = this.dom.querySelector('#btn-clear-waypoints');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                this.store.set({ waypoints: [] });
            });
        }

        const btnHeldKarp = this.dom.querySelector('#btn-solve-held-karp');
        if (btnHeldKarp) {
            btnHeldKarp.addEventListener('click', () => {
                const waypointIds = this.waypoints.map(w => w.id);
                const res = this.heldKarp.solveTSP(this.graph, waypointIds);
                this.store.set({ activePathResult: res, selectedAlgo: 'Held-Karp TSP' });
                this.store.emit('pathSolved', res);
            });
        }

        const btnTwoOpt = this.dom.querySelector('#btn-solve-two-opt');
        if (btnTwoOpt) {
            btnTwoOpt.addEventListener('click', () => {
                const waypointIds = this.waypoints.map(w => w.id);
                const res = this.nnTwoOpt.solveTSP(this.graph, waypointIds);
                this.store.set({ activePathResult: res, selectedAlgo: 'NN + 2-Opt' });
                this.store.emit('pathSolved', res);
            });
        }
    }
}
