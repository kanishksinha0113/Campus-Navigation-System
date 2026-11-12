import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter3() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION"));
    md += `# CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION\n\n`;

    // 3.1
    doc.push(h2("3.1 Functional Requirements Specification"));
    md += `## 3.1 Functional Requirements Specification\n\n`;

    doc.push(p("Functional requirements define the core capabilities, operations, and services that the Campus Navigation System must provide to end-users and client applications. Each functional requirement is uniquely identified with a formal requirement code (FR-01 through FR-12):", { line: 280 }));

    const frData = [
        ["Req ID", "Requirement Name", "Functional Description", "Priority"],
        ["FR-01", "Graph Topology Ingestion", "The system shall ingest topological datasets (nodes, edges, buildings) in standardized JSON format and construct an in-memory weighted graph representation upon initialization.", "Mandatory"],
        ["FR-02", "Multi-Algorithm Routing", "The system shall allow users to select from six distinct graph routing algorithms (Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall) to compute optimal or heuristic walking paths.", "Mandatory"],
        ["FR-03", "Multi-Stop TSP Optimization", "The system shall provide an automated Traveling Salesperson Problem (TSP) solver capable of determining the optimal sequence to visit multiple user-selected campus destinations.", "Essential"],
        ["FR-04", "3D Scene Initialization", "The system shall initialize a GPU-accelerated 3D scene using Three.js, rendering ground plane grids, lighting models, building geometries, and landmark beacons.", "Mandatory"],
        ["FR-05", "Route Geometry Extrusion", "The system shall visually extrude the calculated mathematical path in the 3D viewport as a glowing continuous corridor with elevated markers at intermediate waypoints.", "Mandatory"],
        ["FR-06", "Turn-by-Turn Wayfinding", "The system shall compute vector bearings between adjacent path segments and generate human-readable natural language instructions (e.g., 'Turn left toward Central Library').", "Mandatory"],
        ["FR-07", "Avatar Kinematics Simulation", "The system shall provide an animated 3D pedestrian avatar that smoothly traverses the active route with parametric interpolation and realistic limb oscillation.", "Essential"],
        ["FR-08", "POI Search & Autocomplete", "The system shall provide an instant text search interface allowing users to filter and select campus locations with real-time substring matching.", "Mandatory"],
        ["FR-09", "Dynamic Camera Perspectives", "The system shall support multiple camera modes, including Free Orbit Controls, Top-Down Orthographic View, and Follow-Avatar First/Third-Person tracking.", "Desirable"],
        ["FR-10", "Interactive Building Raycasting", "The system shall detect mouse pointer intersections with 3D building meshes, displaying building names, departments, and click-to-select source/destination triggers.", "Essential"],
        ["FR-11", "Performance Benchmark HUD", "The system shall display a real-time heads-up display (HUD) detailing path distance in meters, execution time in milliseconds, and total nodes explored.", "Mandatory"],
        ["FR-12", "Error Handling & Fallbacks", "The system shall gracefully handle edge cases—such as identical source and destination, disconnected vertices, or non-existent paths—with clear user alerts.", "Mandatory"]
    ];

    const frHeaders = frData[0];
    const frRows = frData.slice(1);
    doc.push(table(frHeaders, frRows, [12, 24, 52, 12]));

    // 3.2
    doc.push(h2("3.2 Non-Functional Requirements"));
    md += `## 3.2 Non-Functional Requirements\n\n`;

    doc.push(p("Non-functional requirements specify the operational quality attributes, performance envelopes, reliability constraints, and security criteria governing the system architecture:", { line: 280 }));

    doc.push(bullet("NFR-01: Sub-Millisecond Path Computation Latency", "The routing engine must compute the complete shortest path between any two reachable vertices within the 36-node campus graph in less than 5.0 milliseconds (with target execution under 1.0 ms on desktop hardware)."));

    doc.push(bullet("NFR-02: 60 FPS 3D Rendering Performance", "The WebGL rendering loop must maintain a sustained refresh rate of 60 frames per second (FPS) during camera rotation, zooming, panning, and avatar animation on standard integrated graphics hardware."));

    doc.push(bullet("NFR-03: Scalability and Memory Efficiency", "The graph data structure and rendering pipeline must be architected to scale seamlessly to institutional graphs containing upwards of 1,000 vertices and 5,000 edges without exceeding 150 MB of browser memory allocation or inducing garbage-collection stutter."));

    doc.push(bullet("NFR-04: High Usability and Visual Ergonomics", "The user interface must adhere to WCAG AAA contrast guidelines, featuring clean dark-slate backgrounds, high-contrast cyan route highlights, and legible typography readable across varying ambient lighting conditions."));

    doc.push(bullet("NFR-05: High Reliability & 100% Test Pass Rate", "The system must maintain 100% pass rates across all automated regression test suites verifying graph ingestion, shortest path invariants, negative cycle handling, and topological reachability."));

    doc.push(bullet("NFR-06: Cross-Platform Browser Portability", "The client application must execute reliably across all modern evergreen web browsers supporting WebGL 2.0 and ES6 Modules—including Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari—without third-party plugins."));

    // 3.3
    doc.push(h2("3.3 Hardware Specifications"));
    md += `## 3.3 Hardware Specifications\n\n`;

    doc.push(p("The following hardware configurations specify the environments used during system development, profiling, and the minimum hardware recommended for end-user deployment:", { line: 280 }));

    const hwData = [
        ["Hardware Component", "Development Environment", "Minimum Client Specification", "Recommended Client Specification"],
        ["Processor (CPU)", "Intel Core i7 / AMD Ryzen 7 (8 cores)", "Intel Core i3 / AMD Ryzen 3 (Dual core)", "Intel Core i5 / AMD Ryzen 5 or Apple M-Series"],
        ["System Memory (RAM)", "16 GB DDR4 / DDR5", "4 GB RAM", "8 GB RAM or higher"],
        ["Graphics (GPU)", "NVIDIA GeForce RTX 3050 / Intel Iris Xe", "WebGL-compatible Integrated Graphics", "Dedicated GPU or Modern Integrated (Intel Iris Xe / AMD Radeon)"],
        ["Storage Space", "512 GB NVMe SSD", "100 MB free browser cache space", "500 MB free space"],
        ["Display Resolution", "1920 x 1080 Full HD (or higher)", "1280 x 720 HD", "1920 x 1080 Full HD"],
        ["Input Peripherals", "Standard Keyboard & Precision Mouse", "Standard Mouse or Touchscreen", "Precision Mouse with Scroll Wheel or Multi-Touch Trackpad"]
    ];

    doc.push(table(hwData[0], hwData.slice(1), [22, 26, 26, 26]));

    // 3.4
    doc.push(h2("3.4 Software Specifications"));
    md += `## 3.4 Software Specifications\n\n`;

    doc.push(p("The software architecture relies upon standardized, modern, and open-source development tools and execution runtimes:", { line: 280 }));

    const swData = [
        ["Layer / Category", "Technology / Software Tool", "Version", "Role & Justification in System"],
        ["Operating System", "Microsoft Windows 11 / Linux (Ubuntu 22.04 LTS)", "64-bit", "Host operating system for backend execution and development"],
        ["Runtime Engine", "Node.js (V8 JavaScript Engine)", "v20.x / v24.x LTS", "High-throughput asynchronous server runtime for REST microservice"],
        ["Web Application Server", "Express.js Framework", "v4.19+", "Lightweight HTTP server serving static assets and REST data endpoints"],
        ["3D Graphics Engine", "Three.js (WebGL 2.0)", "r128 / r160+", "Scene graph, geometry buffers, procedural extrusion, and shader materials"],
        ["Language Standards", "Modern JavaScript (ES6+ Modules)", "ECMAScript 2022", "Object-oriented client and server logic with native class syntax"],
        ["Reference Algorithmic Core", "C++ Programming Language", "ISO C++17 Standard", "High-performance reference implementation of core graph algorithms"],
        ["Version Control", "Git & GitHub", "v2.40+", "Source code revision tracking, branch management, and collaborative development"],
        ["Testing Framework", "Custom Node.js Benchmark & Test Harness", "ES6 Native", "Automated regression testing, invariant verification, and profiling"]
    ];

    doc.push(table(swData[0], swData.slice(1), [20, 25, 15, 40]));

    doc.push(pageBreak());
    return { doc, md };
}
