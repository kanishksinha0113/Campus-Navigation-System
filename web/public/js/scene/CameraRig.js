/**
 * CampusNav3D — Cinematic Camera Rig & Transitions
 */

export class CameraRig {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.controls = new THREE.OrbitControls(camera, domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.maxPolarAngle = Math.PI / 2.05; // Prevent dipping beneath ground
        this.controls.minDistance = 30.0;
        this.controls.maxDistance = 1400.0;

        this.isFlying = false;
        this.flyStart = null;
        this.flyDuration = 1200; // ms
        this.flyTargetPos = new THREE.Vector3();
        this.flyTargetLook = new THREE.Vector3();
        this.flyStartPos = new THREE.Vector3();
        this.flyStartLook = new THREE.Vector3();

        this.followTarget = null;
        this.isFollowing = false;
    }

    setFollowTarget(targetObject) {
        this.followTarget = targetObject;
        this.isFollowing = !!targetObject;
    }

    flyTo(targetLook, distance = 240.0, pitchDeg = 48.0, durationMs = 1200) {
        this.isFlying = true;
        this.flyStart = performance.now();
        this.flyDuration = durationMs;

        this.flyStartPos.copy(this.camera.position);
        this.flyStartLook.copy(this.controls.target);

        this.flyTargetLook.copy(targetLook);

        const pitchRad = (pitchDeg * Math.PI) / 180.0;
        const yawRad = Math.PI / 4; // 45 deg isometric

        const offsetX = distance * Math.cos(pitchRad) * Math.sin(yawRad);
        const offsetY = distance * Math.sin(pitchRad);
        const offsetZ = distance * Math.cos(pitchRad) * Math.cos(yawRad);

        this.flyTargetPos.set(
            targetLook.x + offsetX,
            targetLook.y + offsetY,
            targetLook.z + offsetZ
        );
    }

    flyToBoundingBox(points, durationMs = 1400) {
        if (!points || points.length === 0) return;

        const box = new THREE.Box3();
        points.forEach(p => box.expandByPoint(new THREE.Vector3(p.worldX, 0, p.worldZ)));

        const center = new THREE.Vector3();
        box.getCenter(center);

        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.z, 80.0);
        const distance = maxDim * 1.6;

        this.flyTo(center, Math.max(distance, 180.0), 52.0, durationMs);
    }

    setTopDownView() {
        this.flyTo(new THREE.Vector3(0, 0, 0), 650.0, 89.0, 900);
    }

    resetIsometricView() {
        this.flyTo(new THREE.Vector3(0, 0, 0), 480.0, 48.0, 900);
    }

    update() {
        if (this.isFollowing && this.followTarget && !this.isFlying) {
            const targetPos = this.followTarget.position;
            // Smoothly glide orbit target with the walker
            this.controls.target.lerp(new THREE.Vector3(targetPos.x, targetPos.y + 8.0, targetPos.z), 0.06);
        }

        if (this.isFlying) {
            const elapsed = performance.now() - this.flyStart;
            const progress = Math.min(elapsed / this.flyDuration, 1.0);

            // Smooth cubic ease-in-out
            const t = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            this.camera.position.lerpVectors(this.flyStartPos, this.flyTargetPos, t);
            this.controls.target.lerpVectors(this.flyStartLook, this.flyTargetLook, t);

            if (progress >= 1.0) {
                this.isFlying = false;
            }
        }

        this.controls.update();
    }
}
