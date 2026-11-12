/**
 * CampusNav3D — Theme & View Mode Controls
 */

export class ThemeManager {
    constructor(store, world) {
        this.store = store;
        this.world = world;
        this.dom = document.getElementById('view-controls');
        this.render();
    }

    render() {
        const { theme } = this.store.get();

        this.dom.innerHTML = `
            <div class="view-controls-bar glass-panel">
                <div class="view-mode-buttons">
                    <button class="view-btn" id="btn-view-3d" title="3D Isometric Perspective">3D</button>
                    <button class="view-btn" id="btn-view-2d" title="Top-Down 2D Map View">2D</button>
                    <button class="view-btn" id="btn-view-map" title="View Source IITD Map Overlay">🗺️ Map</button>
                </div>
                <div class="v-divider"></div>
                <div class="theme-switcher">
                    <button class="theme-btn ${theme === 'midnight' ? 'active' : ''}" data-theme="midnight" title="Midnight Navy (Default)">🌙</button>
                    <button class="theme-btn ${theme === 'cyberpunk' ? 'active' : ''}" data-theme="cyberpunk" title="Cyberpunk High-Contrast">⚡</button>
                    <button class="theme-btn ${theme === 'daylight' ? 'active' : ''}" data-theme="daylight" title="Daylight Crisp">☀️</button>
                </div>
            </div>
        `;

        this.dom.querySelector('#btn-view-3d').addEventListener('click', () => {
            this.world.cameraRig.resetIsometricView();
        });

        this.dom.querySelector('#btn-view-2d').addEventListener('click', () => {
            this.world.cameraRig.setTopDownView();
        });

        this.dom.querySelector('#btn-view-map').addEventListener('click', () => {
            this.toggleMapOverlay();
        });

        this.dom.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const newTheme = e.currentTarget.dataset.theme;
                this.store.set({ theme: newTheme });
                this.world.applyTheme(newTheme);
                document.body.className = `theme-${newTheme}`;
                this.render();
            });
        });
    }

    toggleMapOverlay() {
        let overlay = document.getElementById('map-overlay-modal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'map-overlay-modal';
            overlay.className = 'map-overlay-modal';
            overlay.innerHTML = `
                <div class="map-modal-card glass-panel">
                    <div class="modal-header">
                        <div class="modal-title">Official IIT Delhi Campus Map Reference</div>
                        <button class="modal-close-btn" id="close-map-modal">&times;</button>
                    </div>
                    <div class="map-image-wrapper">
                        <img src="/campus_map.jpg" alt="IIT Delhi Map" class="campus-source-img">
                    </div>
                    <div class="map-footer-note">
                        36 landmarks and 73 connecting road corridors were directly digitized from this official campus cartography.
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);

            overlay.querySelector('#close-map-modal').addEventListener('click', () => {
                overlay.classList.remove('active');
            });
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('active');
            });
        }

        overlay.classList.toggle('active');
    }
}
