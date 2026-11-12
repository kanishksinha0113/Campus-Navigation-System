/**
 * CampusNav3D — Interactive Navigation HUD & Turn-by-Turn Guidance Sheet
 * Allows direct text typing with instant autocomplete for Origin & Destination
 */

export class NavigationHUD {
    constructor(store, graph, world) {
        this.store = store;
        this.graph = graph;
        this.world = world;

        this.dom = document.getElementById('nav-hud');
        this.activeDropdown = null; // 'start' | 'end' | null
        this.isFollowingWalker = false;
        this.currentSpeed = 1.0;
        this._bindEvents();
    }

    _bindEvents() {
        this.store.on('stateChange', ({ changedKeys }) => {
            if (changedKeys.includes('startNode') || changedKeys.includes('endNode') || changedKeys.includes('activePathResult')) {
                this.render();
            }
        });

        // Close autocomplete when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.routing-inputs')) {
                this._closeDropdowns();
            }
        });
    }

    _closeDropdowns() {
        const d1 = this.dom.querySelector('#start-autocomplete');
        const d2 = this.dom.querySelector('#end-autocomplete');
        if (d1) d1.classList.remove('active');
        if (d2) d2.classList.remove('active');
        this.activeDropdown = null;
    }

    render() {
        const { startNode, endNode, activePathResult, travelMode } = this.store.get();

        const startVal = startNode ? startNode.name : '';
        const endVal   = endNode   ? endNode.name   : '';

        let pathContent = '';
        if (activePathResult && activePathResult.success && activePathResult.path.length >= 2) {
            const meters = activePathResult.distanceMeters || Math.round(activePathResult.distance * 20.0);
            const walkMin = (meters / 1.4 / 60.0).toFixed(1);
            const bikeMin = (meters / 4.5 / 60.0).toFixed(1);
            const steps = Math.round(meters / 0.75);
            const calories = Math.round(meters * 0.04);

            const turnByTurn = this.graph.generateTurnByTurn(activePathResult.path);

            pathContent = `
                <div class="route-summary-card">
                    <div class="route-metrics">
                        <div class="metric-block">
                            <span class="metric-val">${meters} m</span>
                            <span class="metric-lbl">Distance</span>
                        </div>
                        <div class="metric-block">
                            <span class="metric-val">${travelMode === 'walk' ? walkMin : bikeMin} min</span>
                            <span class="metric-lbl">ETA (${travelMode === 'walk' ? 'Walk' : 'Bike'})</span>
                        </div>
                        <div class="metric-block">
                            <span class="metric-val">${steps}</span>
                            <span class="metric-lbl">Steps</span>
                        </div>
                        <div class="metric-block">
                            <span class="metric-val">${calories} kcal</span>
                            <span class="metric-lbl">Energy</span>
                        </div>
                    </div>

                    <div class="route-actions-bar">
                        <button class="btn-fit-route" id="btn-fit-route" title="Center camera on full path">Focus Route</button>
                        <button class="btn-replay-walk" id="btn-replay-walk" title="Watch 3D Person walk again">🚶 Walk Again</button>
                        <button class="btn-follow-toggle ${this.isFollowingWalker ? 'active' : ''}" id="btn-follow-toggle" title="Keep 3D camera smoothly tracking the walker">
                            🎥 Follow: ${this.isFollowingWalker ? 'ON' : 'OFF'}
                        </button>
                        <button class="btn-clear-route" id="btn-clear-route" title="Reset endpoints">Reset</button>
                    </div>

                    <div class="walker-speed-bar">
                        <span class="speed-label">Walk Pace:</span>
                        <div class="speed-pill-group">
                            <button class="btn-speed-pill ${this.currentSpeed === 0.6 ? 'active' : ''}" data-speed="0.6">🐢 Slow</button>
                            <button class="btn-speed-pill ${this.currentSpeed === 1.0 ? 'active' : ''}" data-speed="1.0">🚶 Brisk (Default)</button>
                            <button class="btn-speed-pill ${this.currentSpeed === 1.5 ? 'active' : ''}" data-speed="1.5">⚡ Fast</button>
                        </div>
                    </div>
                </div>

                <div class="turn-by-turn-container">
                    <div class="turn-header">Turn-by-Turn Route Guidance</div>
                    <div class="turn-steps-list">
                        ${turnByTurn.map(s => `
                            <div class="turn-step-item">
                                <span class="turn-icon">${this._getStepIcon(s.icon)}</span>
                                <div class="turn-details">
                                    <div class="turn-text">${s.instruction}</div>
                                    ${s.distanceMeters > 0 ? `<div class="turn-dist">${s.distanceMeters} m</div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (startNode && endNode && activePathResult && !activePathResult.success) {
            pathContent = `
                <div class="route-error-card">
                    ⚠️ No connected path found between selected locations.
                </div>
            `;
        }

        this.dom.innerHTML = `
            <div class="hud-panel glass-panel">
                <div class="hud-title-bar">
                    <div class="app-brand">
                        <span class="brand-badge">IITD</span>
                        <span class="brand-text">CampusNav 3D</span>
                    </div>
                    <div class="hud-actions-right">
                        <button class="btn-directory-toggle" id="btn-toggle-directory" title="Browse All 36 Places Directory">
                            <span>📍 Places</span>
                        </button>
                        <button class="btn-cmd-k" id="btn-open-cmd" title="Open Command Palette (Ctrl+K)">
                            <span>⌘K</span>
                        </button>
                    </div>
                </div>

                <div class="routing-inputs">
                    <!-- Origin Input -->
                    <div class="input-row">
                        <span class="node-indicator origin-dot"></span>
                        <input type="text"
                               class="hud-search-input"
                               id="start-search-input"
                               placeholder="Type origin place or click map..."
                               value="${startVal}"
                               autocomplete="off">
                        ${startNode ? `
                            <button class="btn-center-slot" id="center-start-btn" title="Center 3D camera on ${startNode.name}">🎯</button>
                            <button class="btn-clear-slot" id="clear-start-btn" title="Clear origin">&times;</button>
                        ` : ''}
                        <div class="hud-autocomplete-dropdown" id="start-autocomplete"></div>
                    </div>

                    <div class="input-divider">
                        <div class="divider-line"></div>
                        <button class="btn-swap" id="btn-swap-endpoints" title="Swap Origin and Destination">⇅</button>
                    </div>

                    <!-- Destination Input -->
                    <div class="input-row">
                        <span class="node-indicator dest-dot"></span>
                        <input type="text"
                               class="hud-search-input"
                               id="end-search-input"
                               placeholder="Type destination place or click map..."
                               value="${endVal}"
                               autocomplete="off">
                        ${endNode ? `
                            <button class="btn-center-slot" id="center-end-btn" title="Center 3D camera on ${endNode.name}">🎯</button>
                            <button class="btn-clear-slot" id="clear-end-btn" title="Clear destination">&times;</button>
                        ` : ''}
                        <div class="hud-autocomplete-dropdown" id="end-autocomplete"></div>
                    </div>
                </div>

                ${pathContent}
            </div>
        `;

        this._bindDOMEvents();
    }

    _getStepIcon(type) {
        switch (type) {
            case 'depart': return '🛫';
            case 'arrive': return '📍';
            case 'straight': return '⬆️';
            case 'slight-right': return '↗️';
            case 'right': return '➡️';
            case 'sharp-right': return '↪️';
            case 'slight-left': return '↖️';
            case 'left': return '⬅️';
            case 'sharp-left': return '↩️';
            default: return '🚶';
        }
    }

    _bindDOMEvents() {
        const startInput = this.dom.querySelector('#start-search-input');
        const endInput = this.dom.querySelector('#end-search-input');
        const startDropdown = this.dom.querySelector('#start-autocomplete');
        const endDropdown = this.dom.querySelector('#end-autocomplete');

        // Start input typing & autocomplete
        if (startInput && startDropdown) {
            startInput.addEventListener('focus', () => {
                this._renderAutocomplete(startDropdown, startInput.value, (node) => {
                    this.store.set({ startNode: node });
                    startInput.value = node.name;
                    this._closeDropdowns();
                    this.store.emit('triggerSolve');
                });
            });

            startInput.addEventListener('input', (e) => {
                this._renderAutocomplete(startDropdown, e.target.value, (node) => {
                    this.store.set({ startNode: node });
                    startInput.value = node.name;
                    this._closeDropdowns();
                    this.store.emit('triggerSolve');
                });
            });
        }

        // End input typing & autocomplete
        if (endInput && endDropdown) {
            endInput.addEventListener('focus', () => {
                this._renderAutocomplete(endDropdown, endInput.value, (node) => {
                    this.store.set({ endNode: node });
                    endInput.value = node.name;
                    this._closeDropdowns();
                    this.store.emit('triggerSolve');
                });
            });

            endInput.addEventListener('input', (e) => {
                this._renderAutocomplete(endDropdown, e.target.value, (node) => {
                    this.store.set({ endNode: node });
                    endInput.value = node.name;
                    this._closeDropdowns();
                    this.store.emit('triggerSolve');
                });
            });
        }

        // Center on Start
        const centerStart = this.dom.querySelector('#center-start-btn');
        if (centerStart) {
            centerStart.addEventListener('click', () => {
                const { startNode } = this.store.get();
                if (startNode) this.world.centerOnNode(startNode);
            });
        }

        // Center on End
        const centerEnd = this.dom.querySelector('#center-end-btn');
        if (centerEnd) {
            centerEnd.addEventListener('click', () => {
                const { endNode } = this.store.get();
                if (endNode) this.world.centerOnNode(endNode);
            });
        }

        // Clear Start
        const clearStart = this.dom.querySelector('#clear-start-btn');
        if (clearStart) {
            clearStart.addEventListener('click', (e) => {
                e.stopPropagation();
                this.store.set({ startNode: null, activePathResult: null });
            });
        }

        // Clear End
        const clearEnd = this.dom.querySelector('#clear-end-btn');
        if (clearEnd) {
            clearEnd.addEventListener('click', (e) => {
                e.stopPropagation();
                this.store.set({ endNode: null, activePathResult: null });
            });
        }

        // Swap
        const btnSwap = this.dom.querySelector('#btn-swap-endpoints');
        if (btnSwap) {
            btnSwap.addEventListener('click', () => this.store.swapEndpoints());
        }

        // Directory Drawer Toggle
        const btnToggleDir = this.dom.querySelector('#btn-toggle-directory');
        if (btnToggleDir) {
            btnToggleDir.addEventListener('click', () => {
                window.placesDirectory && window.placesDirectory.toggle();
            });
        }

        // Command Palette
        const btnOpenCmd = this.dom.querySelector('#btn-open-cmd');
        if (btnOpenCmd) {
            btnOpenCmd.addEventListener('click', () => {
                window.commandPalette && window.commandPalette.open();
            });
        }

        // Focus Route
        const btnFit = this.dom.querySelector('#btn-fit-route');
        if (btnFit) {
            btnFit.addEventListener('click', () => {
                const { activePathResult } = this.store.get();
                if (activePathResult && activePathResult.path.length > 0) {
                    const nodes = activePathResult.path.map(id => this.graph.getNode(id));
                    this.world.cameraRig.flyToBoundingBox(nodes);
                }
            });
        }

        // Replay Walking Person
        const btnReplay = this.dom.querySelector('#btn-replay-walk');
        if (btnReplay) {
            btnReplay.addEventListener('click', () => {
                const { activePathResult } = this.store.get();
                if (activePathResult && activePathResult.path.length >= 2) {
                    const nodes = activePathResult.path.map(id => this.graph.getNode(id));
                    this.world.startWalkingRoute(nodes);
                }
            });
        }

        // Follow Walker Toggle
        const btnFollow = this.dom.querySelector('#btn-follow-toggle');
        if (btnFollow) {
            btnFollow.addEventListener('click', () => {
                this.isFollowingWalker = !this.isFollowingWalker;
                this.world.setFollowWalker(this.isFollowingWalker);
                btnFollow.classList.toggle('active', this.isFollowingWalker);
                btnFollow.innerHTML = `🎥 Follow: ${this.isFollowingWalker ? 'ON' : 'OFF'}`;
            });
        }

        // Walk Speed Pills
        this.dom.querySelectorAll('.btn-speed-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = parseFloat(btn.dataset.speed);
                this.currentSpeed = speed;
                this.world.setWalkerSpeed(speed);
                this.dom.querySelectorAll('.btn-speed-pill').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Reset
        const btnClear = this.dom.querySelector('#btn-clear-route');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                this.isFollowingWalker = false;
                this.world.setFollowWalker(false);
                this.store.clearEndpoints();
            });
        }
    }

    _renderAutocomplete(dropdownEl, query, onSelect) {
        const q = (query || '').trim().toLowerCase();
        let matches = this.graph.getAllNodes();

        if (q) {
            matches = matches.filter(n =>
                n.name.toLowerCase().includes(q) ||
                n.category.toLowerCase().includes(q) ||
                (n.categoryMeta && n.categoryMeta.desc.toLowerCase().includes(q))
            );
        }

        if (matches.length === 0) {
            dropdownEl.innerHTML = `<div class="autocomplete-no-matches">No landmarks found</div>`;
            dropdownEl.classList.add('active');
            return;
        }

        dropdownEl.innerHTML = matches.slice(0, 8).map(n => `
            <div class="autocomplete-item" data-id="${n.id}">
                <span class="ac-icon">${n.categoryMeta.icon}</span>
                <div class="ac-info">
                    <div class="ac-name">${n.name}</div>
                    <div class="ac-meta">${n.category} &bull; ${n.categoryMeta.desc}</div>
                </div>
            </div>
        `).join('');

        dropdownEl.classList.add('active');

        dropdownEl.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(item.dataset.id, 10);
                const node = this.graph.getNode(id);
                if (node) onSelect(node);
            });
        });
    }
}
