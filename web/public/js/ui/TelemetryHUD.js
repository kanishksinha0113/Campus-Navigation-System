/**
 * CampusNav3D — DAA Algorithm Telemetry & Benchmark Dashboard
 */
import { BenchmarkEngine } from '../algorithms/Benchmark.js';

export class TelemetryHUD {
    constructor(store, graph) {
        this.store = store;
        this.graph = graph;
        this.benchEngine = new BenchmarkEngine();

        this.dom = document.getElementById('telemetry-hud');
        this._bindEvents();
    }

    _bindEvents() {
        this.store.on('stateChange', ({ changedKeys }) => {
            if (changedKeys.includes('selectedAlgo') || changedKeys.includes('activePathResult')) {
                this.render();
            }
        });
    }

    render() {
        const { selectedAlgo, activePathResult } = this.store.get();

        const algos = ['BFS', 'DFS', 'Dijkstra', 'A*', 'Bellman-Ford', 'Floyd-Warshall'];

        let runtimeStr = '—';
        let nodesStr = '—';
        let compStr = 'O((V + E) log V)';
        let techStr = 'Greedy + Min-Heap';

        if (activePathResult) {
            runtimeStr = `${activePathResult.runtimeMs.toFixed(3)} ms`;
            nodesStr = `${activePathResult.nodesExpanded} nodes`;
            compStr = activePathResult.complexity;
            techStr = activePathResult.designTechnique;
        }

        this.dom.innerHTML = `
            <div class="hud-panel glass-panel telemetry-card">
                <div class="telemetry-header">
                    <span class="hud-icon">⚡</span>
                    <span class="hud-title">Algorithm Engine</span>
                </div>

                <div class="algo-selector-row">
                    <label for="algo-select">Strategy:</label>
                    <select id="algo-select" class="custom-select">
                        ${algos.map(a => `<option value="${a}" ${a === selectedAlgo ? 'selected' : ''}>${a}</option>`).join('')}
                    </select>
                </div>

                <div class="telemetry-grid">
                    <div class="telem-item">
                        <div class="telem-val text-cyan">${compStr}</div>
                        <div class="telem-lbl">Worst-Case Big-O</div>
                    </div>
                    <div class="telem-item">
                        <div class="telem-val text-amber">${nodesStr}</div>
                        <div class="telem-lbl">Frontier Expansions</div>
                    </div>
                    <div class="telem-item">
                        <div class="telem-val text-green">${runtimeStr}</div>
                        <div class="telem-lbl">Execution Time</div>
                    </div>
                </div>

                <div class="telem-paradigm">
                    <span class="paradigm-pill">${techStr}</span>
                </div>

                <button class="btn-benchmark" id="btn-run-benchmark">
                    <span>📊 Compare All 6 Algorithms</span>
                </button>
            </div>
        `;

        const select = this.dom.querySelector('#algo-select');
        if (select) {
            select.addEventListener('change', (e) => {
                this.store.set({ selectedAlgo: e.target.value });
                this.store.emit('triggerSolve');
            });
        }

        const btnBench = this.dom.querySelector('#btn-run-benchmark');
        if (btnBench) {
            btnBench.addEventListener('click', () => this.openBenchmarkModal());
        }
    }

    openBenchmarkModal() {
        const { startNode, endNode } = this.store.get();
        if (!startNode || !endNode) {
            alert('Please select an Origin and Destination first to run comparative benchmarks.');
            return;
        }

        const data = this.benchEngine.runComparison(this.graph, startNode.id, endNode.id);

        let modal = document.getElementById('benchmark-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'benchmark-modal';
            modal.className = 'benchmark-modal-overlay';
            document.body.appendChild(modal);
        }

        const maxExpansions = Math.max(...data.results.map(r => r.nodesExpanded), 1);

        modal.innerHTML = `
            <div class="benchmark-modal-card glass-panel">
                <div class="modal-header">
                    <div>
                        <div class="modal-title">Design & Analysis Benchmark Suite</div>
                        <div class="modal-subtitle">Evaluating query: ${startNode.name} &rarr; ${endNode.name}</div>
                    </div>
                    <button class="modal-close-btn" id="close-bench-modal">&times;</button>
                </div>

                <div class="benchmark-table-wrapper">
                    <table class="benchmark-table">
                        <thead>
                            <tr>
                                <th>Algorithm</th>
                                <th>Distance</th>
                                <th>Nodes Expanded</th>
                                <th>Runtime</th>
                                <th>Theoretical Complexity</th>
                                <th>Frontier Relative</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.results.map(r => `
                                <tr class="${r.name === 'A*' ? 'highlight-row' : ''}">
                                    <td class="font-bold">${r.name}</td>
                                    <td>${r.success ? `${r.distanceMeters} m` : '—'}</td>
                                    <td>
                                        <span class="badge ${r.name === 'A*' ? 'badge-green' : 'badge-neutral'}">
                                            ${r.nodesExpanded}
                                        </span>
                                    </td>
                                    <td class="text-green font-mono">${r.runtimeMs.toFixed(3)} ms</td>
                                    <td class="text-cyan font-mono">${r.complexity}</td>
                                    <td class="bar-cell">
                                        <div class="progress-track">
                                            <div class="progress-bar ${r.name === 'A*' ? 'bar-astar' : ''}" style="width: ${Math.round((r.nodesExpanded / maxExpansions) * 100)}%"></div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="benchmark-insight-card">
                    <div class="insight-badge">DAA Theoretical Insight</div>
                    <p class="insight-text">${data.dijkstraVsAStar.insight}</p>
                </div>
            </div>
        `;

        modal.classList.add('active');
        modal.querySelector('#close-bench-modal').addEventListener('click', () => {
            modal.classList.remove('active');
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }
}
