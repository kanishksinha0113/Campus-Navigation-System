/**
 * CampusNav3D — High-Performance Path Trail & Search Wavefront Renderer
 */

export class TrailRenderer {
    constructor(scene) {
        this.scene = scene;
        this.trailGroup = new THREE.Group();
        this.trailGroup.name = 'navigation_trail';
        this.scene.add(this.trailGroup);

        this.currentPath = [];
        this.visitOrder = [];
        this.revealIndex = 0;
        this.isRevealing = false;
        this.revealTimer = 0;
        this.pulseHeadMesh = null;
        this.tubes = [];
        this.pulseTime = 0;
    }

    clear() {
        while (this.trailGroup.children.length > 0) {
            const obj = this.trailGroup.children[0];
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
            this.trailGroup.remove(obj);
        }
        this.tubes = [];
        this.pulseHeadMesh = null;
        this.currentPath = [];
        this.visitOrder = [];
        this.revealIndex = 0;
        this.isRevealing = false;
    }

    startAnimation(pathResult, graph, onComplete) {
        this.clear();
        this.currentPath = pathResult.path.map(id => graph.getNode(id)).filter(Boolean);
        this.visitOrder = (pathResult.visitOrder || []).map(id => graph.getNode(id)).filter(Boolean);
        this.onComplete = onComplete;

        if (this.currentPath.length < 2) return;

        this.revealIndex = 0;
        this.isRevealing = true;
        this.revealTimer = 0;

        // Create head beacon sphere
        const headGeo = new THREE.SphereGeometry(3.2, 16, 16);
        const headMat = new THREE.MeshBasicMaterial({
            color: 0xfef08a,
            transparent: true,
            opacity: 0.9
        });
        this.pulseHeadMesh = new THREE.Mesh(headGeo, headMat);
        this.pulseHeadMesh.position.set(this.currentPath[0].worldX, 2.5, this.currentPath[0].worldZ);
        this.trailGroup.add(this.pulseHeadMesh);
    }

    update(delta) {
        this.pulseTime += delta * 4.0;

        if (this.pulseHeadMesh) {
            const scale = 1.0 + 0.3 * Math.sin(this.pulseTime * 2.0);
            this.pulseHeadMesh.scale.set(scale, scale, scale);
        }

        if (!this.isRevealing || this.currentPath.length < 2) return;

        this.revealTimer += delta;
        const stepDuration = 0.18; // 180ms per edge segment reveal

        if (this.revealTimer >= stepDuration) {
            this.revealTimer = 0;

            if (this.revealIndex < this.currentPath.length - 1) {
                const p1 = this.currentPath[this.revealIndex];
                const p2 = this.currentPath[this.revealIndex + 1];

                this._buildPathSegment(p1, p2);
                this.revealIndex++;

                if (this.pulseHeadMesh) {
                    this.pulseHeadMesh.position.set(p2.worldX, 2.5, p2.worldZ);
                }

                if (this.revealIndex >= this.currentPath.length - 1) {
                    this.isRevealing = false;
                    this._buildContinuousRibbon();
                    if (this.onComplete) this.onComplete();
                }
            }
        }
    }

    _buildPathSegment(n1, n2) {
        const v1 = new THREE.Vector3(n1.worldX, 1.4, n1.worldZ);
        const v2 = new THREE.Vector3(n2.worldX, 1.4, n2.worldZ);

        const curve = new THREE.LineCurve3(v1, v2);
        const tubeGeo = new THREE.TubeGeometry(curve, 8, 1.4, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xfbbf24,
            emissiveIntensity: 0.8,
            roughness: 0.2,
            metalness: 0.8
        });
        const mesh = new THREE.Mesh(tubeGeo, tubeMat);
        this.trailGroup.add(mesh);
        this.tubes.push(mesh);
    }

    _buildContinuousRibbon() {
        if (this.currentPath.length < 2) return;

        const points = this.currentPath.map(n => new THREE.Vector3(n.worldX, 1.5, n.worldZ));
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, points.length * 12, 1.6, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.9,
            roughness: 0.1,
            metalness: 0.9
        });
        const ribbonMesh = new THREE.Mesh(tubeGeo, tubeMat);
        this.trailGroup.add(ribbonMesh);
    }
}
