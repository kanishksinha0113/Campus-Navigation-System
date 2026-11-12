/**
 * CampusNav3D — High-Visibility 3D Person Avatar
 * Scaled and styled for aerial isometric visibility, with leisurely walking speed,
 * swinging limbs, dynamic ground sonar ripple, road illumination, and permanent overhead badge.
 */

export class WalkerAvatar {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.group.name = 'walker_avatar';
        this.group.visible = false;
        this.scene.add(this.group);

        this.pathPoints = [];
        this.currentSegment = 0;
        this.segmentProgress = 0;
        this.isWalking = false;

        // Moderate brisk walking speed (24.0 world units/sec: balanced between slow 12 and fast 48)
        this.baseSpeed = 24.0;
        this.speedMultiplier = 1.0;
        this.walkCycle = 0;
        this.targetYaw = 0;

        this.onProgress = null;
        this.onComplete = null;

        this._buildCharacter();
    }

    get walkSpeed() {
        return this.baseSpeed * this.speedMultiplier;
    }

    setSpeedMultiplier(multiplier) {
        this.speedMultiplier = Math.max(0.4, Math.min(3.0, multiplier));
    }

    _buildCharacter() {
        // Master character group scaled 3.6x so it's clearly visible from high isometric viewpoints
        this.characterRoot = new THREE.Group();
        this.characterRoot.scale.set(3.6, 3.6, 3.6);
        this.group.add(this.characterRoot);

        // High-visibility materials (safety neon tangerine + electric cyan)
        const skinMat = new THREE.MeshStandardMaterial({
            color: 0xffdbac,
            roughness: 0.5
        });
        const jacketMat = new THREE.MeshStandardMaterial({
            color: 0xff6600, // Vibrant high-vis safety orange
            emissive: 0xff3300,
            emissiveIntensity: 0.55,
            roughness: 0.35,
            metalness: 0.2
        });
        const pantsMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a, // Deep charcoal athletic pants
            roughness: 0.6
        });
        const stripeMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8, // Cyan stripe
            emissive: 0x38bdf8,
            emissiveIntensity: 0.4
        });
        const shoeMat = new THREE.MeshStandardMaterial({
            color: 0xffffff, // White sneakers
            emissive: 0xcccccc,
            emissiveIntensity: 0.3,
            roughness: 0.2
        });
        const capMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Deep sky blue cap
            emissive: 0x0284c7,
            emissiveIntensity: 0.4,
            roughness: 0.4
        });
        const visorMat = new THREE.MeshStandardMaterial({
            color: 0x090d16,
            roughness: 0.1,
            metalness: 0.8
        });

        // 1. Torso
        this.torso = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.1, 1.1), jacketMat);
        this.torso.position.y = 2.65;
        this.torso.castShadow = true;
        this.characterRoot.add(this.torso);

        // Chest stripe accent
        const chestStripe = new THREE.Mesh(new THREE.BoxGeometry(1.64, 0.35, 1.14), stripeMat);
        chestStripe.position.y = 0.2;
        this.torso.add(chestStripe);

        // 2. Head, Cap & Sunglasses
        const headGeo = new THREE.SphereGeometry(0.68, 16, 16);
        this.head = new THREE.Mesh(headGeo, skinMat);
        this.head.position.y = 1.62;
        this.torso.add(this.head);

        // Sports Cap
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.32, 16), capMat);
        cap.position.y = 0.46;
        this.head.add(cap);

        const visor = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.12, 0.7), capMat);
        visor.position.set(0, 0.36, 0.65);
        this.head.add(visor);

        // Sunglasses visor
        const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 0.3), visorMat);
        glasses.position.set(0, 0.05, 0.58);
        this.head.add(glasses);

        // 3. Left Arm
        this.leftArmPivot = new THREE.Group();
        this.leftArmPivot.position.set(-1.05, 0.82, 0);
        this.torso.add(this.leftArmPivot);

        const armGeo = new THREE.BoxGeometry(0.42, 1.55, 0.42);
        armGeo.translate(0, -0.68, 0);
        this.leftArm = new THREE.Mesh(armGeo, jacketMat);
        this.leftArmPivot.add(this.leftArm);

        // Left Hand
        const handGeo = new THREE.SphereGeometry(0.24, 8, 8);
        handGeo.translate(0, -1.48, 0);
        const leftHand = new THREE.Mesh(handGeo, skinMat);
        this.leftArmPivot.add(leftHand);

        // 4. Right Arm
        this.rightArmPivot = new THREE.Group();
        this.rightArmPivot.position.set(1.05, 0.82, 0);
        this.torso.add(this.rightArmPivot);

        this.rightArm = new THREE.Mesh(armGeo, jacketMat);
        this.rightArmPivot.add(this.rightArm);

        const rightHand = new THREE.Mesh(handGeo, skinMat);
        this.rightArmPivot.add(rightHand);

        // 5. Left Leg & Shoe
        this.leftLegPivot = new THREE.Group();
        this.leftLegPivot.position.set(-0.48, 1.62, 0);
        this.characterRoot.add(this.leftLegPivot);

        const legGeo = new THREE.BoxGeometry(0.52, 1.75, 0.52);
        legGeo.translate(0, -0.88, 0);
        this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
        this.leftLegPivot.add(this.leftLeg);

        const shoeGeo = new THREE.BoxGeometry(0.58, 0.38, 0.96);
        shoeGeo.translate(0, -1.65, 0.16);
        const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
        this.leftLegPivot.add(leftShoe);

        // 6. Right Leg & Shoe
        this.rightLegPivot = new THREE.Group();
        this.rightLegPivot.position.set(0.48, 1.62, 0);
        this.characterRoot.add(this.rightLegPivot);

        this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
        this.rightLegPivot.add(this.rightLeg);

        const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
        this.rightLegPivot.add(rightShoe);

        // 7. Ground Radar Base Ring (Large & clearly visible on roads)
        const auraGeo = new THREE.RingGeometry(4.8, 6.6, 32);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85
        });
        this.auraRing = new THREE.Mesh(auraGeo, auraMat);
        this.auraRing.rotation.x = -Math.PI / 2;
        this.auraRing.position.y = 0.3;
        this.group.add(this.auraRing);

        // 8. Ground Dynamic Sonar Pulse Wave
        const pulseGeo = new THREE.RingGeometry(1.0, 2.2, 32);
        this.pulseMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7
        });
        this.pulseRing = new THREE.Mesh(pulseGeo, this.pulseMat);
        this.pulseRing.rotation.x = -Math.PI / 2;
        this.pulseRing.position.y = 0.25;
        this.group.add(this.pulseRing);

        // 9. Dedicated Road Illuminator PointLight
        this.walkLight = new THREE.PointLight(0x38bdf8, 3.2, 70.0);
        this.walkLight.position.set(0, 10.0, 0);
        this.group.add(this.walkLight);

        // 10. Overhead Rotating Holographic Diamond Beacon
        const diamondGeo = new THREE.OctahedronGeometry(2.0);
        const diamondMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x00f0ff,
            emissiveIntensity: 0.9,
            roughness: 0.1,
            metalness: 0.8
        });
        this.diamond = new THREE.Mesh(diamondGeo, diamondMat);
        this.diamond.position.y = 23.5;
        this.group.add(this.diamond);

        // 11. Permanent 3D Floating Name Badge (Always visible, depthTest: false)
        this.labelSprite = this._createWalkerLabel();
        this.labelSprite.position.y = 28.5;
        this.group.add(this.labelSprite);
    }

    _createWalkerLabel() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Dark glass rounded badge
        const x = 16, y = 16, w = 480, h = 96, r = 24;
        ctx.fillStyle = 'rgba(8, 14, 28, 0.94)';
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();

        // Neon border
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Pulsing green live dot
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(68, 64, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Icon
        ctx.font = '34px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚶', 120, 64);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px "Inter", -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('TRAVELER (WALKING)', 160, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });

        const sprite = new THREE.Sprite(spriteMat);
        sprite.renderOrder = 1000;
        sprite.scale.set(32.0, 8.0, 1.0);
        return sprite;
    }

    startWalk(pathNodes, onProgress = null, onComplete = null) {
        if (!pathNodes || pathNodes.length < 2) return;

        this.pathPoints = pathNodes.map(n => new THREE.Vector3(n.worldX, 0.2, n.worldZ));
        this.currentSegment = 0;
        this.segmentProgress = 0;
        this.isWalking = true;
        this.walkCycle = 0;
        this.onProgress = onProgress;
        this.onComplete = onComplete;

        // Position avatar at origin
        const startPos = this.pathPoints[0];
        this.group.position.copy(startPos);
        this.group.visible = true;

        if (this.auraRing) {
            this.auraRing.material.color.setHex(0x38bdf8);
        }

        this._computeTargetYaw();
        this.group.rotation.y = this.targetYaw;
    }

    _computeTargetYaw() {
        if (this.currentSegment < this.pathPoints.length - 1) {
            const p1 = this.pathPoints[this.currentSegment];
            const p2 = this.pathPoints[this.currentSegment + 1];
            const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
            if (dir.lengthSq() > 0.001) {
                this.targetYaw = Math.atan2(dir.x, dir.z);
            }
        }
    }

    stop() {
        this.isWalking = false;
        this.group.visible = false;
        this._resetLimbs();
    }

    _resetLimbs() {
        if (!this.leftArmPivot) return;
        this.leftArmPivot.rotation.x = 0;
        this.rightArmPivot.rotation.x = 0;
        this.leftLegPivot.rotation.x = 0;
        this.rightLegPivot.rotation.x = 0;
        this.torso.position.y = 2.65;
        this.torso.rotation.y = 0;
    }

    update(delta) {
        if (!this.group.visible) return;

        const time = performance.now() * 0.001;

        // 1. Holographic Overhead Diamond Animation
        if (this.diamond) {
            this.diamond.rotation.y += delta * 2.4;
            this.diamond.position.y = 23.5 + Math.sin(time * 3.5) * 1.2;
        }

        // 2. Dynamic Ground Sonar Ripple Pulse
        if (this.pulseRing && this.pulseMat) {
            const pulsePhase = (time * 1.2) % 1.0; // 0 to 1
            const pulseScale = 1.0 + pulsePhase * 6.5;
            this.pulseRing.scale.set(pulseScale, pulseScale, 1.0);
            this.pulseMat.opacity = Math.max(0, 0.85 * (1.0 - pulsePhase));
        }

        if (!this.isWalking) return;

        // 3. Smooth Yaw Rotation toward current direction
        const diff = Math.atan2(
            Math.sin(this.targetYaw - this.group.rotation.y),
            Math.cos(this.targetYaw - this.group.rotation.y)
        );
        this.group.rotation.y += diff * Math.min(1.0, delta * 9.0);

        // 4. Progress along current road segment
        const p1 = this.pathPoints[this.currentSegment];
        const p2 = this.pathPoints[this.currentSegment + 1];
        const segLen = p1.distanceTo(p2);

        this.segmentProgress += (this.walkSpeed * delta) / Math.max(segLen, 0.1);

        // 5. Brisk natural walking cadence matching 24.0 velocity
        this.walkCycle += delta * 8.5 * this.speedMultiplier;
        const swing = Math.sin(this.walkCycle) * 0.72;
        this.leftLegPivot.rotation.x = swing;
        this.rightLegPivot.rotation.x = -swing;
        this.leftArmPivot.rotation.x = -swing;
        this.rightArmPivot.rotation.x = swing;

        // Torso step bobbing & gentle organic shoulder sway
        this.torso.position.y = 2.65 + Math.abs(Math.sin(this.walkCycle)) * 0.28;
        this.torso.rotation.y = Math.sin(this.walkCycle) * 0.1;

        // 6. Advance to next segment
        if (this.segmentProgress >= 1.0) {
            this.currentSegment++;
            this.segmentProgress = 0;

            if (this.currentSegment >= this.pathPoints.length - 1) {
                // Reached destination!
                const finalPos = this.pathPoints[this.pathPoints.length - 1];
                this.group.position.copy(finalPos);
                this.isWalking = false;
                this._resetLimbs();

                // Emerald green arrival glow
                if (this.auraRing) {
                    this.auraRing.material.color.setHex(0x10b981);
                }
                if (this.walkLight) {
                    this.walkLight.color.setHex(0x10b981);
                }

                if (this.onComplete) this.onComplete();
                return;
            } else {
                this._computeTargetYaw();
            }
        }

        // 7. Interpolate position along road
        const nextP1 = this.pathPoints[this.currentSegment];
        const nextP2 = this.pathPoints[this.currentSegment + 1];
        this.group.position.lerpVectors(nextP1, nextP2, this.segmentProgress);

        if (this.onProgress) {
            const totalSegments = this.pathPoints.length - 1;
            const overallRatio = (this.currentSegment + this.segmentProgress) / totalSegments;
            this.onProgress(overallRatio, this.group.position);
        }
    }
}
