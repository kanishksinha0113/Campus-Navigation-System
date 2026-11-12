/**
 * CampusNav3D — Glowing Campus Perimeter Boundary
 * Traces the official IIT Delhi campus fence line matching the map's red boundary
 */
import { Graph } from '../core/Graph.js';

export class PerimeterBoundaryGenerator {
    static createPerimeterBoundary(theme = 'midnight') {
        const group = new THREE.Group();
        group.name = 'campus_perimeter';

        // Approximate digitized outer campus polygon boundary coordinates from the official map
        const boundaryPointsGrid = [
            { x: -2, y: 55 },   // Ber Sarai outer
            { x: 10, y: 88 },   // Delhi Metro West
            { x: 38, y: 82 },   // North boundary near hostels
            { x: 64, y: 92 },   // Delhi Metro East
            { x: 80, y: 82 },   // East hostels outer
            { x: 92, y: 82 },   // Amaltas North-East corner
            { x: 98, y: 40 },   // Adchini Gate East
            { x: 92, y: 15 },   // South-East Katwaria border
            { x: 52, y: 8 },    // Katwaria Sarai Market Gate South
            { x: 28, y: 6 },    // South border near Sitaram Bhartia
            { x: 12, y: 8 },    // Vasant Kunj Gate South-West
            { x: 2,  y: 35 },   // West boundary residences
            { x: -2, y: 55 }    // Loop back to Ber Sarai
        ];

        const points3D = boundaryPointsGrid.map(pt => {
            const world = Graph.gridToWorld(pt.x, pt.y);
            return new THREE.Vector3(world.x, 0.4, world.z);
        });

        // 1. Glowing red/orange dashed boundary line
        const curve = new THREE.CatmullRomCurve3(points3D, true);
        const curvePoints = curve.getPoints(240);
        const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);

        const isLight = (theme === 'daylight');
        const boundaryColor = isLight ? 0xef4444 : 0xf97316;

        const lineMat = new THREE.LineDashedMaterial({
            color: boundaryColor,
            linewidth: 2,
            scale: 1,
            dashSize: 12,
            gapSize: 6
        });

        const line = new THREE.LineLoop(lineGeo, lineMat);
        line.computeLineDistances();
        group.add(line);

        // 2. Translucent security fence curtain / beacon along boundary
        const fenceGeo = new THREE.TubeGeometry(curve, 180, 0.35, 6, true);
        const fenceMat = new THREE.MeshBasicMaterial({
            color: boundaryColor,
            transparent: true,
            opacity: isLight ? 0.3 : 0.6
        });
        const fenceMesh = new THREE.Mesh(fenceGeo, fenceMat);
        fenceMesh.position.y = 0.5;
        group.add(fenceMesh);

        return group;
    }
}
