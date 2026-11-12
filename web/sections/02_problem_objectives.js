import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter2() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 2: PROBLEM STATEMENT AND OBJECTIVES"));
    md += `# CHAPTER 2: PROBLEM STATEMENT AND OBJECTIVES\n\n`;

    // 2.1
    doc.push(h2("2.1 Problem Formulation"));
    md += `## 2.1 Problem Formulation\n\n`;

    doc.push(p("University campuses are inherently complex, heterogeneous spatial ecosystems. Unlike urban municipal grids that follow orderly Cartesian layouts with numbered avenues and cross streets, academic institutions are organically evolved, multi-zone environments designed around architectural aesthetics, pedestrian green belts, and departmental zoning. A premier university campus typically spans between 100 and 400 acres, encompassing over 30 to 50 distinct functional complexes, including academic lecture halls, departmental research wings, central administrative blocks, student residential hostels, sports complexes, libraries, dining messes, and medical centers.", { line: 280 }));

    doc.push(p("Within this spatial context, thousands of individuals traverse the campus daily. However, a significant proportion of this demographic experiences persistent spatial disorientation. Specifically:", { line: 280 }));

    doc.push(bullet("Freshmen & Newly Enrolled Students", "During the initial weeks of an academic semester, freshmen must navigate unfamiliar terrain between disparate departmental lecture halls, laboratory complexes, and administrative offices to complete registrations and attend staggered classes. Spatial confusion routinely causes students to arrive late, missing critical lectures or examination slots."));

    doc.push(bullet("Visiting Faculty, Guest Lecturers, & External Examiners", "Distinguished academic visitors and industry speakers arriving for seminars, viva examinations, or conferences are unfamiliar with internal campus geography. Delays in locating specific departmental seminar rooms disrupt scheduled academic proceedings."));

    doc.push(bullet("Parents, Visitors, & Alumni", "During annual admissions, orientation weeks, convocation ceremonies, and campus festivals, thousands of external visitors enter the premises. Unable to navigate internal walkways, visitors often crowd security gates or disrupt ongoing academic sessions seeking directions."));

    doc.push(bullet("E-Commerce & Courier Delivery Logistics", "Delivery agents attempting to deliver packages, books, or food items struggle to locate specific hostel wings or departmental annexes, resulting in prolonged delivery delays and vehicular congestion along pedestrian-only paths."));

    // 2.2
    doc.push(h2("2.2 Operational Challenges in Campus Navigation"));
    md += `## 2.2 Operational Challenges in Campus Navigation\n\n`;

    doc.push(p("The design of an effective campus-wide navigation system faces several distinctive operational hurdles that distinguish it from conventional highway or vehicular navigation systems:", { line: 280 }));

    doc.push(bullet("Non-Linear & Curvilinear Pathway Networks", "Campus walkways rarely follow perpendicular grid patterns. Instead, they wind through lawns, encircle fountains, penetrate architectural porticos, and branch into diagonal pedestrian cut-throughs. Modeling these paths requires millimeter-level topological coordinate mapping."));

    doc.push(bullet("Strict Segregation of Pedestrian and Vehicular Corridors", "Many campus zones strictly prohibit motor vehicles. Standard road networks cannot be utilized for walking guidance, necessitating an autonomous pedestrian walkway graph distinct from public road databases."));

    doc.push(bullet("Multi-Gate Perimeter Constraints", "Large campuses possess multiple perimeter entry gates (e.g., Main Gate, Metro Station Gate, East Gate, Academic Gate). Visitors entering from different transit modalities require context-aware routing tailored to their specific ingress point."));

    doc.push(bullet("Multi-Stop Sequential Wayfinding Demands", "Campus visitors frequently need to execute multi-point itineraries within a single trip (e.g., 'Enter Main Gate -> Administrative Block for fee clearance -> Central Library -> Department of Computer Science -> Exit East Gate'). Determining the optimal sequence of visiting these nodes requires solving combinatorial routing problems such as the Traveling Salesperson Problem (TSP)."));

    // 2.3
    doc.push(h2("2.3 Proposed Solution: Spatial Digital Twin & Algorithmic Router"));
    md += `## 2.3 Proposed Solution: Spatial Digital Twin & Algorithmic Router\n\n`;

    doc.push(p("To resolve the aforementioned challenges comprehensively, this project engineers the Campus Navigation System—a fully integrated, browser-based, spatial digital twin paired with an algorithmic graph routing engine. Rather than relying on external cloud APIs or proprietary mobile applications, the system executes completely on open web standards (Node.js, Express, ES6+ JavaScript, WebGL, and Three.js), ensuring zero-friction cross-platform access across desktop workstations, laptops, tablets, and smartphones.", { line: 280 }));

    doc.push(p("The architecture of the proposed solution operates on three complementary tiers:", { line: 280 }));

    doc.push(bullet("1. In-Memory Mathematical Graph Topology", "The physical campus is abstracted into a clean, verified graph data structure comprising 36 landmark vertices and 73 pedestrian pathway edges with exact spatial coordinates, edge distances, and topological adjacencies."));

    doc.push(bullet("2. Multi-Algorithm Pathfinding & Optimization Core", "An extensible algorithmic suite provides instant computation of point-to-point shortest paths, all-pairs distance matrices, reachability trees, and optimized multi-stop tour sequences using classical DAA principles."));

    doc.push(bullet("3. Hardware-Accelerated 3D Interactive Spatial Twin", "A 3D WebGL viewport built with Three.js renders extruded architectural structures, dynamic landmark badges, glowing path corridors, and an animated pedestrian avatar that visually demonstrates the calculated route with realistic walking kinematics."));

    // 2.4
    doc.push(h2("2.4 Project Objectives"));
    md += `## 2.4 Project Objectives\n\n`;

    doc.push(p("The system development was guided by three rigorous sets of objectives:", { line: 280 }));

    doc.push(h3("2.4.1 Primary Engineering Objectives"));
    doc.push(bullet("Sub-Millisecond Query Response", "Design the routing engine such that point-to-point pathfinding queries execute in under 1 millisecond on client hardware, enabling instantaneous route recalculation as the user interacts with the UI."));
    doc.push(bullet("Interactive 60 FPS Spatial Rendering", "Ensure the WebGL 3D scene renders smoothly at a consistent 60 frames per second on standard commercial laptop displays without stuttering or high CPU utilization."));
    doc.push(bullet("Deterministic Mathematical Precision", "Guarantee that all calculated routes adhere to strict shortest-path invariants, eliminating suboptimal detours or erroneous geometric loops."));

    doc.push(h3("2.4.2 Pedagogical & Algorithmic Objectives"));
    doc.push(bullet("Real-World Comparative Benchmark Platform", "Bridge theoretical computer science education with real-world application by implementing six core graph pathfinding algorithms (Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall) and an NP-hard TSP tour optimizer within an identical topological environment."));
    doc.push(bullet("Empirical Validation of Heuristic Pruning", "Empirically demonstrate and quantify the search space reduction achieved by the A* Euclidean heuristic over Dijkstra's exhaustive greedy frontier expansion under production conditions."));
    doc.push(bullet("Algorithmic Transparency", "Expose internal algorithm performance metrics—including execution time in milliseconds, total nodes explored, path edge count, and metric walking distance—directly to the user interface for classroom demonstration and comparative study."));

    doc.push(h3("2.4.3 User Experience & Accessibility Objectives"));
    doc.push(bullet("Zero-Friction Access", "Eliminate any requirement for native app downloads, app store accounts, or external GPS permissions by hosting the complete system as a lightweight, responsive web application."));
    doc.push(bullet("Intuitive Visual Semantics", "Provide clear visual wayfinding through high-contrast 3D glowing path ribbons, floating billboard landmark labels, interactive building click-selection, and natural-language turn-by-turn walking instructions."));
    doc.push(bullet("Kinematic Pedestrian Simulation", "Provide a walking 3D avatar that traverses the route at a calibrated, human-readable speed, allowing users to mentally rehearse their walking trajectory before embarking physically."));

    doc.push(pageBreak());
    return { doc, md };
}
