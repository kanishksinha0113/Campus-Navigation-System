/**
 * CampusNav3D — Procedural Road Network
 * Multi-tiered campus street rendering
 */

export class RoadNetworkGenerator {
    static createRoadNetwork(graph, theme = 'midnight') {
        const group = new THREE.Group();
        group.name = 'road_network';

        const isLight = (theme === 'daylight');
        const edges = graph.getAllEdges();

        for (const edge of edges) {
            const n1 = graph.getNode(edge.from);
            const n2 = graph.getNode(edge.to);
            if (!n1 || !n2) continue;

            const p1 = new THREE.Vector3(n1.worldX, 0.2, n1.worldZ);
            const p2 = new THREE.Vector3(n2.worldX, 0.2, n2.worldZ);

            const distance = p1.distanceTo(p2);
            const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

            // Determine road width and styling by hierarchy
            let roadWidth = 4.2;
            let roadColor = isLight ? 0x94a3b8 : 0x1e293b;
            let emissiveColor = 0x000000;
            let emissiveIntensity = 0.0;

            if (edge.roadTier === 'highway') {
                roadWidth = 6.8;
                roadColor = isLight ? 0x64748b : 0x0f172a;
            } else if (edge.roadTier === 'arterial') {
                roadWidth = 4.8;
                roadColor = isLight ? 0xa0aec0 : 0x1e293b;
                // Subtle cyan luminescent glow along major campus spine
                emissiveColor = isLight ? 0x0284c7 : 0x06b6d4;
                emissiveIntensity = isLight ? 0.08 : 0.25;
            }

            // Extruded flat box for road segment
            const roadGeo = new THREE.BoxGeometry(roadWidth, 0.35, distance);
            const roadMat = new THREE.MeshStandardMaterial({
                color: roadColor,
                emissive: emissiveColor,
                emissiveIntensity: emissiveIntensity,
                roughness: 0.6,
                metalness: 0.1
            });
            const roadMesh = new THREE.Mesh(roadGeo, roadMat);

            roadMesh.position.copy(midpoint);
            roadMesh.position.y = 0.18;
            roadMesh.lookAt(p2);
            roadMesh.receiveShadow = true;
            group.add(roadMesh);

            // Subtle dashed centerline for arterial roads
            if (edge.roadTier === 'arterial') {
                const lineGeo = new THREE.BoxGeometry(0.4, 0.38, distance * 0.94);
                const lineMat = new THREE.MeshBasicMaterial({
                    color: isLight ? 0x38bdf8 : 0x22d3ee,
                    transparent: true,
                    opacity: isLight ? 0.4 : 0.7
                });
                const lineMesh = new THREE.Mesh(lineGeo, lineMat);
                lineMesh.position.copy(midpoint);
                lineMesh.position.y = 0.22;
                lineMesh.lookAt(p2);
                group.add(lineMesh);
            }
        }

        return group;
    }
}
