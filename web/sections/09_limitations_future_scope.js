import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter9() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 9: LIMITATIONS AND FUTURE SCOPE"));
    md += `# CHAPTER 9: LIMITATIONS AND FUTURE SCOPE\n\n`;

    // 9.1
    doc.push(h2("9.1 Current System Limitations"));
    md += `## 9.1 Current System Limitations\n\n`;

    doc.push(p("While the Campus Navigation System successfully achieves sub-millisecond graph routing, multi-algorithm optimization, and high-fidelity 3D spatial rendering, several technical and topological constraints exist in the current prototype implementation:", { line: 280 }));

    doc.push(bullet("1. Planar 2.5D Topological Approximation", "The current routing graph operates in 2.5D space: while buildings are visually extruded into 3D solid blocks, all pedestrian pathway vertices are projected onto a uniform ground plane (Elevation Y = 0.0). The system does not currently model multi-level vertical indoor navigation—such as stairwells, elevators, connecting pedestrian skywalks between departmental wings, or subterranean tunnels."));

    doc.push(bullet("2. Static Metric Edge Weights", "Edge weights are currently determined by static Euclidean pathway distances. The system does not yet incorporate dynamic real-time impedance factors—such as localized pedestrian crowding during class changeovers, temporary construction blockades, weather-induced flooding, or nocturnal security gate closures."));

    doc.push(bullet("3. Manual Graph Digitization Overhead", "The current topological dataset (36 nodes and 73 edges) was curated through architectural cartographic digitization. While highly accurate for the reference campus, deploying the system across other university campuses requires manual surveying and coordinate entry rather than automated satellite/CAD ingestion."));

    doc.push(bullet("4. Absence of Live GNSS Geolocation Fusion", "The current client application operates as an interactive digital twin kiosk and desktop planner. It does not actively fuse mobile device GPS/sensor telemetry (compass heading, accelerometer) to auto-position the user's live physical location onto the 3D map."));

    // 9.2
    doc.push(h2("9.2 Future Scope and System Enhancements"));
    md += `## 9.2 Future Scope and System Enhancements\n\n`;

    doc.push(p("To evolve the system from an academic prototype into a pervasive, smart-campus operational platform, the following architectural enhancements are scheduled for future development:", { line: 280 }));

    doc.push(bullet("1. Multi-Level 3D Indoor Floorplan Navigation (BIM / IFC Integration)", "Extending the Graph data structure into a 3D multi-layered directed graph G = (V, E, W) where vertices possess vertical floor coordinates (x, y, z). By integrating Building Information Modeling (BIM) and Industry Foundation Classes (IFC) standards, the system will support continuous outdoor-to-indoor navigation, seamlessly guiding students from an external gate, through campus pathways, into an academic building, and up an elevator to a specific classroom door."));

    doc.push(bullet("2. Real-Time Dynamic Edge Weighting via WebSockets", "Deploying a bidirectional WebSockets push architecture connecting campus facility management with active clients. Administrators can flag pathways as 'closed for maintenance' or assign heavy congestion penalties. The client routing engine will dynamically recalculate active routes in real-time without requiring browser refreshes."));

    doc.push(bullet("3. Augmented Reality (AR) Walking Direction Overlays (WebXR)", "Leveraging the WebXR Device API to deliver mobile browser Augmented Reality. Users holding their smartphone camera will see glowing virtual 3D walking arrows and destination beacons projected directly onto their physical surroundings, eliminating all cognitive map-reading friction."));

    doc.push(bullet("4. Accessibility-First Multi-Criteria Routing", "Implementing multi-objective Pareto optimization that filters out stairs, steep slopes, and uneven cobblestones, providing dedicated accessible routes tailored for wheelchair users, visually impaired students, and logistics carts."));

    doc.push(bullet("5. Progressive Web Application (PWA) Offline Capabilities", "Packaging the application with Service Workers and IndexedDB client storage, enabling complete 3D digital twin exploration and algorithmic routing even when users experience cellular signal dead-zones across campus basements."));

    doc.push(pageBreak());
    return { doc, md };
}
