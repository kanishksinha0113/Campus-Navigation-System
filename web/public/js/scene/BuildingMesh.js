/**
 * CampusNav3D — Procedural Architectural Building Generator
 * With permanent 3D floating name label badges above each building
 */

export class BuildingGenerator {
    static createBuilding(node, theme = 'midnight') {
        const group = new THREE.Group();
        group.name = `building_${node.id}`;
        group.userData = { nodeId: node.id, node };

        const meta = node.categoryMeta;
        const width = 12.0;
        const depth = 12.0;
        const height = meta.height * 1.2;

        const isLight = (theme === 'daylight');
        const baseColor = isLight ? 0xe2e8f0 : 0x1e2433;
        const roofColor = new THREE.Color(meta.color);

        // 1. Main building volume
        const bodyGeo = new THREE.BoxGeometry(width, height, depth);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: baseColor,
            roughness: 0.35,
            metalness: 0.25,
            flatShading: true
        });
        const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
        bodyMesh.position.y = height / 2.0;
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        group.add(bodyMesh);

        // 2. Architectural roof slab with category tint
        const roofGeo = new THREE.BoxGeometry(width + 1.2, 1.8, depth + 1.2);
        const roofMat = new THREE.MeshStandardMaterial({
            color: roofColor,
            emissive: roofColor,
            emissiveIntensity: isLight ? 0.15 : 0.45,
            roughness: 0.2,
            metalness: 0.6
        });
        const roofMesh = new THREE.Mesh(roofGeo, roofMat);
        roofMesh.position.y = height + 0.9;
        roofMesh.castShadow = true;
        group.add(roofMesh);

        // 3. Subtle architectural wireframe edges
        const edgesGeo = new THREE.EdgesGeometry(bodyGeo);
        const edgesMat = new THREE.LineBasicMaterial({
            color: isLight ? 0xcbd5e1 : 0x475569,
            linewidth: 1,
            transparent: true,
            opacity: 0.6
        });
        const edgeLines = new THREE.LineSegments(edgesGeo, edgesMat);
        edgeLines.position.y = height / 2.0;
        group.add(edgeLines);

        // 4. Floating category marker sphere
        const markerRadius = 2.4;
        const markerGeo = new THREE.SphereGeometry(markerRadius, 16, 16);
        const markerMat = new THREE.MeshStandardMaterial({
            color: roofColor,
            emissive: roofColor,
            emissiveIntensity: isLight ? 0.3 : 0.8,
            roughness: 0.1,
            metalness: 0.8
        });
        const markerMesh = new THREE.Mesh(markerGeo, markerMat);
        markerMesh.position.y = height + 4.5;
        markerMesh.name = `marker_${node.id}`;
        group.add(markerMesh);

        // 5. Pulsing ring beneath marker
        const ringGeo = new THREE.RingGeometry(2.8, 3.4, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: roofColor,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.position.y = height + 2.0;
        group.add(ringMesh);

        // 6. Permanent 3D Floating Name Label Badge above building (Always visible in 3D & 2D)
        const labelSprite = BuildingGenerator.createLabelSprite(node.name, meta.color, meta.icon, isLight);
        labelSprite.position.y = height + 8.5;
        labelSprite.name = `label_${node.id}`;
        group.add(labelSprite);

        group.position.set(node.worldX, 0, node.worldZ);
        return group;
    }

    /**
     * Creates a high-res billboarding 3D sprite with place name and category icon
     */
    static createLabelSprite(placeName, categoryColor, icon, isLight) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Draw pill background
        const x = 12, y = 14, w = 488, h = 100, r = 26;
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(10, 14, 24, 0.92)';
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();

        // 3px colored category border
        ctx.strokeStyle = categoryColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Icon circle accent on the left
        ctx.fillStyle = categoryColor;
        ctx.beginPath();
        ctx.arc(66, 64, 28, 0, Math.PI * 2);
        ctx.fill();

        // Icon text
        ctx.font = '30px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(icon || '📍', 66, 65);

        // Landmark name text
        ctx.fillStyle = isLight ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 32px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // Fit long place names
        let displayName = placeName;
        if (ctx.measureText(displayName).width > 360) {
            ctx.font = 'bold 26px "Inter", -apple-system, BlinkMacSystemFont, sans-serif';
            if (ctx.measureText(displayName).width > 360) {
                while (ctx.measureText(displayName + '...').width > 360 && displayName.length > 5) {
                    displayName = displayName.slice(0, -1);
                }
                displayName += '...';
            }
        }
        ctx.fillText(displayName, 114, 64);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false, // Ensures labels are never occluded by building rooftops
            depthWrite: false
        });

        const sprite = new THREE.Sprite(spriteMat);
        sprite.renderOrder = 999;
        sprite.scale.set(36.0, 9.0, 1.0);
        return sprite;
    }
}
