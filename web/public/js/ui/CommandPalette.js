/**
 * CampusNav3D — Enterprise Command Palette (Ctrl + K)
 */

export class CommandPalette {
    constructor(store, world) {
        this.store = store;
        this.world = world;
        this.isOpen = false;
        this.nodes = [];

        this._createDOM();
        this._bindShortcuts();
    }

    setNodes(nodes) {
        this.nodes = nodes;
    }

    _createDOM() {
        const overlay = document.createElement('div');
        overlay.className = 'cmd-palette-overlay';
        overlay.id = 'cmd-palette';
        overlay.innerHTML = `
            <div class="cmd-palette-modal">
                <div class="cmd-palette-header">
                    <span class="cmd-search-icon">🔍</span>
                    <input type="text" id="cmd-input" placeholder="Search landmarks, departments, gates... (Esc to close)" autocomplete="off">
                    <span class="cmd-badge">ESC</span>
                </div>
                <div class="cmd-palette-results" id="cmd-results">
                    <!-- Dynamic search items -->
                </div>
                <div class="cmd-palette-footer">
                    <span>Navigation: <kbd>↑</kbd> <kbd>↓</kbd></span>
                    <span>Select: <kbd>↵ Enter</kbd></span>
                    <span>Direct Action: <kbd>O</kbd> Origin &bull; <kbd>D</kbd> Destination</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        this.dom = overlay;
        this.input = overlay.querySelector('#cmd-input');
        this.resultsContainer = overlay.querySelector('#cmd-results');

        this.input.addEventListener('input', (e) => this._renderResults(e.target.value));
        this.dom.addEventListener('click', (e) => {
            if (e.target === this.dom) this.close();
        });
    }

    _bindShortcuts() {
        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        this.isOpen = true;
        this.dom.classList.add('active');
        this.input.value = '';
        this.input.focus();
        this._renderResults('');
    }

    close() {
        this.isOpen = false;
        this.dom.classList.remove('active');
    }

    _renderResults(query) {
        const q = query.trim().toLowerCase();
        let matches = this.nodes;

        if (q) {
            matches = this.nodes.filter(n =>
                n.name.toLowerCase().includes(q) ||
                n.category.toLowerCase().includes(q) ||
                (n.categoryMeta && n.categoryMeta.desc.toLowerCase().includes(q))
            );
        }

        if (matches.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="cmd-no-results">No landmarks found matching "${query}"</div>
            `;
            return;
        }

        this.resultsContainer.innerHTML = matches.slice(0, 10).map((n, i) => `
            <div class="cmd-item ${i === 0 ? 'selected' : ''}" data-id="${n.id}">
                <span class="cmd-item-icon">${n.categoryMeta.icon}</span>
                <div class="cmd-item-info">
                    <div class="cmd-item-name">${n.name}</div>
                    <div class="cmd-item-cat">${n.category} &bull; ${n.categoryMeta.desc}</div>
                </div>
                <div class="cmd-item-actions">
                    <button class="cmd-btn-set-origin" title="Set as Start">Origin</button>
                    <button class="cmd-btn-set-dest" title="Set as Destination">Dest</button>
                    <button class="cmd-btn-fly" title="Fly Camera Here">Fly</button>
                </div>
            </div>
        `).join('');

        // Wire button events
        this.resultsContainer.querySelectorAll('.cmd-item').forEach(item => {
            const id = parseInt(item.dataset.id, 10);
            const node = this.nodes.find(n => n.id === id);

            item.querySelector('.cmd-btn-set-origin').addEventListener('click', (e) => {
                e.stopPropagation();
                this.store.set({ startNode: node });
                this.store.emit('triggerSolve');
                this.close();
            });

            item.querySelector('.cmd-btn-set-dest').addEventListener('click', (e) => {
                e.stopPropagation();
                this.store.set({ endNode: node });
                this.store.emit('triggerSolve');
                this.close();
            });

            item.querySelector('.cmd-btn-fly').addEventListener('click', (e) => {
                e.stopPropagation();
                this.world.cameraRig.flyTo(new THREE.Vector3(node.worldX, 0, node.worldZ), 180.0, 50.0);
                this.close();
            });

            item.addEventListener('click', () => {
                this.store.selectNode(node);
                this.close();
            });
        });
    }
}
