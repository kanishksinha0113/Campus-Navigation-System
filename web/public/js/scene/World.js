/**
 * CampusNav3D — Main 3D Scene Controller
 * Apple Maps / Mapbox Studio Aesthetic
 */
import { BuildingGenerator } from './BuildingMesh.js';
import { RoadNetworkGenerator } from './RoadNetwork.js';
import { PerimeterBoundaryGenerator } from './PerimeterSpline.js';
import { TrailRenderer } from './TrailRenderer.js';
import { CameraRig } from './CameraRig.js';
import { WalkerAvatar } from './WalkerAvatar.js';

export class World {
    constructor(canvasContainer, onNodeClick, onNodeHover) {
        this.container = canvasContainer;
        this.onNodeClick = onNodeClick;
        this.onNodeHover = onNodeHover;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cameraRig = null;
        this.trailRenderer = null;
        this.graph = null;

        this.buildingGroup = null;
        this.roadGroup = null;
        this.perimeterGroup = null;
        this.groundMesh = null;
        this.gridHelper = null;

        this.lights = {};
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.hoveredNode = null;
        this.currentTheme = 'midnight';

        this.clock = new THREE.Clock();
        this._initEngine();
    }

    _initEngine() {
        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 1.0, 3000.0);
        this.camera.position.set(320.0, 360.0, 380.0);

        // 3. Renderer with high-end tonemapping & antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.05;

        this.container.appendChild(this.renderer.domElement);

        // 4. Camera Rig
        this.cameraRig = new CameraRig(this.camera, this.renderer.domElement);

        // 5. Trail Renderer
        this.trailRenderer = new TrailRenderer(this.scene);

        // 6. 3D Fast-Walking Person Avatar
        this.walkerAvatar = new WalkerAvatar(this.scene);

        // 7. Ground & Lights
        this._buildGroundAndEnvironment();

        // 8. Event listeners
        window.addEventListener('resize', () => this._onResize());
        this.renderer.domElement.addEventListener('pointermove', (e) => this._onPointerMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this._onClick(e));

        // 8. Start loop
        this._animate();
    }

    _buildGroundAndEnvironment() {
        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(3000, 3000);
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x08090e,
            roughness: 0.85,
            metalness: 0.15
        });
        this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
        this.groundMesh.rotation.x = -Math.PI / 2;
        this.groundMesh.position.y = -0.1;
        this.groundMesh.receiveShadow = true;
        this.scene.add(this.groundMesh);

        // High-tech subtle spatial grid
        this.gridHelper = new THREE.GridHelper(1600, 80, 0x1e293b, 0x0f172a);
        this.gridHelper.position.y = 0.05;
        this.scene.add(this.gridHelper);

        // Lighting
        const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 0.6);
        this.scene.add(hemiLight);
        this.lights.hemi = hemiLight;

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(300, 450, 200);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        dirLight.shadow.camera.near = 50;
        dirLight.shadow.camera.far = 1000;
        const d = 500;
        dirLight.shadow.camera.left = -d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = -d;
        dirLight.shadow.bias = -0.0005;
        this.scene.add(dirLight);
        this.lights.dir = dirLight;

        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        this.currentTheme = theme;
        if (theme === 'daylight') {
            this.scene.background = new THREE.Color(0xdbeafe);
            this.scene.fog = new THREE.FogExp2(0xdbeafe, 0.0007);
            this.groundMesh.material.color.setHex(0xe2e8f0);
            this.lights.hemi.color.setHex(0xffffff);
            this.lights.hemi.groundColor.setHex(0x94a3b8);
            this.lights.hemi.intensity = 0.8;
            this.lights.dir.color.setHex(0xfffbeb);
            this.lights.dir.intensity = 1.4;
            if (this.gridHelper) this.gridHelper.material.color.setHex(0xcbd5e1);
        } else if (theme === 'cyberpunk') {
            this.scene.background = new THREE.Color(0x05050d);
            this.scene.fog = new THREE.FogExp2(0x05050d, 0.001);
            this.groundMesh.material.color.setHex(0x05050d);
            this.lights.hemi.color.setHex(0xec4899);
            this.lights.hemi.groundColor.setHex(0x06b6d4);
            this.lights.hemi.intensity = 0.7;
            this.lights.dir.color.setHex(0x38bdf8);
            this.lights.dir.intensity = 1.2;
            if (this.gridHelper) this.gridHelper.material.color.setHex(0x27272a);
        } else {
            // Midnight (Default)
            this.scene.background = new THREE.Color(0x08090e);
            this.scene.fog = new THREE.FogExp2(0x08090e, 0.0009);
            this.groundMesh.material.color.setHex(0x08090e);
            this.lights.hemi.color.setHex(0x38bdf8);
            this.lights.hemi.groundColor.setHex(0x020617);
            this.lights.hemi.intensity = 0.6;
            this.lights.dir.color.setHex(0xf8fafc);
            this.lights.dir.intensity = 1.1;
            if (this.gridHelper) this.gridHelper.material.color.setHex(0x1e293b);
        }

        if (this.graph) {
            this.rebuildEntities();
        }
    }

    loadGraph(graph) {
        this.graph = graph;
        this.rebuildEntities();
        this.cameraRig.resetIsometricView();
    }

    rebuildEntities() {
        if (!this.graph) return;

        // Clear previous
        if (this.buildingGroup) this.scene.remove(this.buildingGroup);
        if (this.roadGroup) this.scene.remove(this.roadGroup);
        if (this.perimeterGroup) this.scene.remove(this.perimeterGroup);

        // Build roads
        this.roadGroup = RoadNetworkGenerator.createRoadNetwork(this.graph, this.currentTheme);
        this.scene.add(this.roadGroup);

        // Build campus perimeter boundary
        this.perimeterGroup = PerimeterBoundaryGenerator.createPerimeterBoundary(this.currentTheme);
        this.scene.add(this.perimeterGroup);

        // Build buildings & marker spheres
        this.buildingGroup = new THREE.Group();
        this.buildingGroup.name = 'all_buildings';

        for (const node of this.graph.getAllNodes()) {
            const b = BuildingGenerator.createBuilding(node, this.currentTheme);
            this.buildingGroup.add(b);
        }
        this.scene.add(this.buildingGroup);
    }

    _onPointerMove(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (!this.buildingGroup) return;

        const intersects = this.raycaster.intersectObjects(this.buildingGroup.children, true);
        if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && hit.parent !== this.buildingGroup) {
                hit = hit.parent;
            }
            if (hit.userData && hit.userData.node) {
                this.renderer.domElement.style.cursor = 'pointer';
                if (this.hoveredNode !== hit.userData.node) {
                    this.hoveredNode = hit.userData.node;
                    if (this.onNodeHover) this.onNodeHover(this.hoveredNode, e.clientX, e.clientY);
                }
                return;
            }
        }

        this.renderer.domElement.style.cursor = 'default';
        if (this.hoveredNode !== null) {
            this.hoveredNode = null;
            if (this.onNodeHover) this.onNodeHover(null, 0, 0);
        }
    }

    _onClick(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        if (!this.buildingGroup) return;

        const intersects = this.raycaster.intersectObjects(this.buildingGroup.children, true);
        if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && hit.parent !== this.buildingGroup) {
                hit = hit.parent;
            }
            if (hit.userData && hit.userData.node) {
                if (this.onNodeClick) this.onNodeClick(hit.userData.node);
            }
        }
    }

    _onResize() {
        if (!this.container || !this.renderer) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    centerOnNode(node, distance = 180.0, pitchDeg = 50.0) {
        if (!node || !this.cameraRig) return;
        this.cameraRig.flyTo(new THREE.Vector3(node.worldX, 0, node.worldZ), distance, pitchDeg, 1000);
    }

    startWalkingRoute(pathNodes, onComplete = null) {
        if (!this.walkerAvatar) return;
        this.walkerAvatar.startWalk(pathNodes, null, onComplete);
    }

    setFollowWalker(enabled) {
        if (!this.cameraRig || !this.walkerAvatar) return;
        this.cameraRig.setFollowTarget(enabled ? this.walkerAvatar.group : null);
    }

    setWalkerSpeed(multiplier) {
        if (this.walkerAvatar) {
            this.walkerAvatar.setSpeedMultiplier(multiplier);
        }
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        const delta = this.clock.getDelta();

        if (this.cameraRig) this.cameraRig.update();
        if (this.trailRenderer) this.trailRenderer.update(delta);
        if (this.walkerAvatar) this.walkerAvatar.update(delta);

        this.renderer.render(this.scene, this.camera);
    }
}
