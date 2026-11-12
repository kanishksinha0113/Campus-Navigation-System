/**
 * CampusNav3D — Main Enterprise Web Application Bootstrap
 */
import { Graph } from './core/Graph.js';
import { appStore } from './core/State.js';
import { World } from './scene/World.js';

import { BFSPathfinder } from './algorithms/BFS.js';
import { DFSPathfinder } from './algorithms/DFS.js';
import { DijkstraPathfinder } from './algorithms/Dijkstra.js';
import { AStarPathfinder } from './algorithms/AStar.js';
import { BellmanFordPathfinder } from './algorithms/BellmanFord.js';
import { FloydWarshallPathfinder } from './algorithms/FloydWarshall.js';

import { NavigationHUD } from './ui/NavigationHUD.js';
import { PlacesDirectory } from './ui/PlacesDirectory.js';
import { TelemetryHUD } from './ui/TelemetryHUD.js';
import { WaypointManager } from './ui/WaypointManager.js';
import { CommandPalette } from './ui/CommandPalette.js';
import { ThemeManager } from './ui/ThemeManager.js';

class Application {
    constructor() {
        this.graph = null;
        this.world = null;
        this.pathfinders = {};
        this.tooltip = null;
    }

    async init() {
        console.log('[CampusNav3D] Initializing Spatial Digital Twin...');

        // 1. Tooltip element
        this._initTooltip();

        // 2. Initialize 3D World
        const container = document.getElementById('viewport-container');
        this.world = new World(
            container,
            (node) => this._onNodeClicked(node),
            (node, x, y) => this._onNodeHovered(node, x, y)
        );

        // 3. Load Campus Graph Data
        try {
            this.graph = await Graph.loadFromAPI('/data/campus_nodes.json', '/data/campus_edges.json');
            appStore.set({ graph: this.graph });
            this.world.loadGraph(this.graph);
            console.log(`[CampusNav3D] Loaded ${this.graph.nodeCount()} nodes, ${this.graph.edgeCount()} edges.`);
        } catch (err) {
            console.error('[CampusNav3D] Failed to load campus data:', err);
            alert('Failed to load campus graph data: ' + err.message);
            return;
        }

        // 4. Initialize Algorithms
        this.pathfinders = {
            'BFS': new BFSPathfinder(),
            'DFS': new DFSPathfinder(),
            'Dijkstra': new DijkstraPathfinder(),
            'A*': new AStarPathfinder(),
            'Bellman-Ford': new BellmanFordPathfinder(),
            'Floyd-Warshall': new FloydWarshallPathfinder()
        };

        // Precompute Floyd-Warshall at startup
        console.log('[CampusNav3D] Precomputing Floyd-Warshall all-pairs matrix...');
        this.pathfinders['Floyd-Warshall'].precompute(this.graph);

        // 5. Initialize UI Modules
        this.navHUD = new NavigationHUD(appStore, this.graph, this.world);
        this.placesDirectory = new PlacesDirectory(appStore, this.graph, this.world);
        window.placesDirectory = this.placesDirectory;
        this.telemetryHUD = new TelemetryHUD(appStore, this.graph);
        this.waypointMgr = new WaypointManager(appStore, this.graph);
        this.cmdPalette = new CommandPalette(appStore, this.world);
        this.cmdPalette.setNodes(this.graph.getAllNodes());
        window.commandPalette = this.cmdPalette;

        this.themeMgr = new ThemeManager(appStore, this.world);

        // 6. Connect Reactive Event Bus
        this._bindStoreEvents();

        // Initial render of HUDs
        this.navHUD.render();
        this.telemetryHUD.render();
        this.waypointMgr.render();

        console.log('[CampusNav3D] Digital Twin Ready.');
    }

    _initTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'spatial-tooltip';
        document.body.appendChild(this.tooltip);
    }

    _onNodeHovered(node, x, y) {
        if (!node) {
            this.tooltip.classList.remove('active');
            return;
        }

        this.tooltip.innerHTML = `
            <div class="tt-header">
                <span class="tt-icon">${node.categoryMeta.icon}</span>
                <span class="tt-title">${node.name}</span>
            </div>
            <div class="tt-body">
                <span class="tt-cat">${node.category}</span> &bull; 
                <span class="tt-desc">${node.categoryMeta.desc}</span>
            </div>
            <div class="tt-hint">Click to set Origin / Destination</div>
        `;

        this.tooltip.style.left = `${x + 14}px`;
        this.tooltip.style.top = `${y - 12}px`;
        this.tooltip.classList.add('active');
    }

    _onNodeClicked(node) {
        appStore.selectNode(node);
    }

    _bindStoreEvents() {
        appStore.on('triggerSolve', () => this.solveActiveRoute());

        appStore.on('pathSolved', (pathResult) => {
            if (pathResult && pathResult.success) {
                this.world.trailRenderer.startAnimation(pathResult, this.graph);
                const nodes = pathResult.path.map(id => this.graph.getNode(id));
                this.world.cameraRig.flyToBoundingBox(nodes);
                this.world.startWalkingRoute(nodes);
            }
        });

        appStore.on('endpointsCleared', () => {
            this.world.trailRenderer.clear();
            if (this.world.walkerAvatar) {
                this.world.walkerAvatar.stop();
            }
        });
    }

    solveActiveRoute() {
        const { startNode, endNode, selectedAlgo } = appStore.get();
        if (!startNode || !endNode) return;

        const pathfinder = this.pathfinders[selectedAlgo] || this.pathfinders['Dijkstra'];
        console.log(`[CampusNav3D] Executing ${pathfinder.name} from [${startNode.name}] to [${endNode.name}]...`);

        const result = pathfinder.findPath(this.graph, startNode.id, endNode.id);
        appStore.set({ activePathResult: result });

        if (result.success) {
            this.world.trailRenderer.startAnimation(result, this.graph);
            const nodes = result.path.map(id => this.graph.getNode(id));
            this.world.cameraRig.flyToBoundingBox(nodes);
            this.world.startWalkingRoute(nodes);
        } else {
            this.world.trailRenderer.clear();
            if (this.world.walkerAvatar) {
                this.world.walkerAvatar.stop();
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.init();
});
