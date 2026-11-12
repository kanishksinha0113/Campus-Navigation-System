/**
 * CampusNav3D — Campus Places Directory Sidebar
 * Provides a comprehensive, searchable list of all 36 landmarks within the IIT Delhi campus
 */

export class PlacesDirectory {
    constructor(store, graph, world) {
        this.store = store;
        this.graph = graph;
        this.world = world;

        this.isOpen = false;
        this.selectedCategory = 'All';
        this.searchQuery = '';

        this._createDOM();
    }

    _createDOM() {
        // 1. Sidebar Container
        const drawer = document.createElement('aside');
        drawer.className = 'places-directory-drawer';
        drawer.id = 'places-directory';
        document.body.appendChild(drawer);
        this.dom = drawer;

        // 2. Floating quick-access pill button
        const pill = document.createElement('button');
        pill.className = 'btn-floating-directory glass-panel';
        pill.id = 'floating-dir-btn';
        pill.innerHTML = `<span>🏛️ Campus Places Directory (36)</span>`;
        document.body.appendChild(pill);

        pill.addEventListener('click', () => this.toggle());

        this.render();
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        this.isOpen = true;
        this.dom.classList.add('active');
        const pill = document.getElementById('floating-dir-btn');
        if (pill) pill.classList.add('hidden');
    }

    close() {
        this.isOpen = false;
        this.dom.classList.remove('active');
        const pill = document.getElementById('floating-dir-btn');
        if (pill) pill.classList.remove('hidden');
    }

    render() {
        const allNodes = this.graph.getAllNodes();

        // Extract unique categories
        const categories = ['All', ...new Set(allNodes.map(n => n.category))];

        // Filter nodes
        let filtered = allNodes;
        if (this.selectedCategory !== 'All') {
            filtered = filtered.filter(n => n.category === this.selectedCategory);
        }
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.trim().toLowerCase();
            filtered = filtered.filter(n =>
                n.name.toLowerCase().includes(q) ||
                n.category.toLowerCase().includes(q) ||
                (n.categoryMeta && n.categoryMeta.desc.toLowerCase().includes(q))
            );
        }

        this.dom.innerHTML = `
            <div class="directory-panel glass-panel">
                <div class="directory-header">
                    <div class="dir-title-group">
                        <span class="dir-title">IIT Delhi Places Directory</span>
                        <span class="dir-count-badge">${filtered.length} of ${allNodes.length}</span>
                    </div>
                    <button class="dir-close-btn" id="close-dir-btn">&times;</button>
                </div>

                <div class="directory-search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text"
                           id="dir-search-input"
                           placeholder="Search all campus places..."
                           value="${this.searchQuery}"
                           autocomplete="off">
                    ${this.searchQuery ? `<button class="search-clear-btn" id="clear-dir-search">&times;</button>` : ''}
                </div>

                <div class="directory-category-chips">
                    ${categories.map(cat => `
                        <button class="cat-chip ${this.selectedCategory === cat ? 'active' : ''}" data-cat="${cat}">
                            ${cat}
                        </button>
                    `).join('')}
                </div>

                <div class="directory-places-list" id="dir-places-list">
                    ${filtered.length === 0 ? `
                        <div class="dir-empty-state">No places found matching "${this.searchQuery}"</div>
                    ` : filtered.map(node => `
                        <div class="place-card" data-id="${node.id}">
                            <div class="place-card-top">
                                <span class="place-icon-badge" style="background-color: ${node.categoryMeta.color}22; border-color: ${node.categoryMeta.color}">
                                    ${node.categoryMeta.icon}
                                </span>
                                <div class="place-info">
                                    <div class="place-name">${node.name}</div>
                                    <div class="place-cat" style="color: ${node.categoryMeta.color}">${node.category} &bull; ${node.categoryMeta.desc}</div>
                                </div>
                            </div>
                            <div class="place-card-actions">
                                <button class="btn-place-action btn-set-start" data-id="${node.id}" title="Set as Departure Origin">🛫 Start</button>
                                <button class="btn-place-action btn-set-end" data-id="${node.id}" title="Set as Destination">📍 Destination</button>
                                <button class="btn-place-action btn-center-cam" data-id="${node.id}" title="Center 3D Camera on this place">🎯 Center</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this._bindDOMEvents();
    }

    _bindDOMEvents() {
        const closeBtn = this.dom.querySelector('#close-dir-btn');
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());

        const searchInput = this.dom.querySelector('#dir-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.render();
                const newInput = this.dom.querySelector('#dir-search-input');
                if (newInput) {
                    newInput.focus();
                    newInput.setSelectionRange(this.searchQuery.length, this.searchQuery.length);
                }
            });
        }

        const clearSearch = this.dom.querySelector('#clear-dir-search');
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                this.searchQuery = '';
                this.render();
            });
        }

        this.dom.querySelectorAll('.cat-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                this.selectedCategory = e.currentTarget.dataset.cat;
                this.render();
            });
        });

        // Set Start
        this.dom.querySelectorAll('.btn-set-start').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id, 10);
                const node = this.graph.getNode(id);
                if (node) {
                    this.store.set({ startNode: node });
                    this.world.centerOnNode(node);
                    this.store.emit('triggerSolve');
                }
            });
        });

        // Set End
        this.dom.querySelectorAll('.btn-set-end').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id, 10);
                const node = this.graph.getNode(id);
                if (node) {
                    this.store.set({ endNode: node });
                    this.world.centerOnNode(node);
                    this.store.emit('triggerSolve');
                }
            });
        });

        // Center Camera in 3D
        this.dom.querySelectorAll('.btn-center-cam').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id, 10);
                const node = this.graph.getNode(id);
                if (node) {
                    this.world.centerOnNode(node);
                }
            });
        });

        // Clicking on place card body centers camera
        this.dom.querySelectorAll('.place-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id, 10);
                const node = this.graph.getNode(id);
                if (node) this.world.centerOnNode(node);
            });
        });
    }
}
