import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, code, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter4() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 4: SYSTEM ARCHITECTURE AND DESIGN"));
    md += `# CHAPTER 4: SYSTEM ARCHITECTURE AND DESIGN\n\n`;

    // 4.1
    doc.push(h2("4.1 Multi-Tier System Architecture"));
    md += `## 4.1 Multi-Tier System Architecture\n\n`;

    doc.push(p("The Campus Navigation System is engineered as a decoupled, multi-tier architectural platform adhering to modern software engineering principles of modularity, separation of concerns, and low coupling. By isolating spatial data persistence, backend delivery, graph mathematical computation, and GPU-accelerated 3D graphics into distinct architectural layers, the system achieves maximum extensibility and fault tolerance.", { line: 280 }));

    doc.push(p("The system architecture is organized into four primary structural tiers:", { line: 280 }));

    doc.push(bullet("1. Client Presentation & 3D Spatial Viewport Tier", "Constructed using Three.js and modern HTML5/CSS3. This tier handles WebGL GPU rendering, interactive OrbitControls, raycasting-based building selection, dynamic billboard text badges, an animated pedestrian avatar with parametric kinematics, and a real-time heads-up display (HUD)."));

    doc.push(bullet("2. Algorithmic Routing & Client State Tier", "Executes directly within the client V8 JavaScript runtime for instantaneous, zero-latency pathfinding. It encapsulates the in-memory graph representation, the Strategy Pattern algorithm engine (Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall, TSP), the binary min-heap priority queue, and the reactive state store."));

    doc.push(bullet("3. Backend REST Service & Static Delivery Tier", "An asynchronous Node.js microservice powered by the Express framework. It serves application bundles, manages CORS security headers, provides diagnostic health check APIs, and streams standardized campus topological data models."));

    doc.push(bullet("4. Data Persistence & Geographic Topology Tier", "Structured JSON and GeoJSON datasets defining campus nodes, walkway edge adjacencies, metric distances, surface classifications, and 2.5D building footprint polygons."));

    const archDiagram = `
+========================================================================================+
|                       TIER 1: PRESENTATION & 3D VIEWPORT TIER                          |
|  +--------------------+  +----------------------+  +--------------------------------+  |
|  | WebGL 3D Viewport  |  | Turn-by-Turn Panel   |  | Benchmark HUD & Search Kiosk   |  |
|  | (Three.js Scene)   |  | (Natural Directions) |  | (Nodes, Metric Time, Distance) |  |
|  +---------^----------+  +----------^-----------+  +---------------^----------------+  |
+============|========================|==============================|===================+
             |                        |                              |
+============|========================|==============================|===================+
|            v                        v                              v                   |
|                   TIER 2: ALGORITHMIC ROUTING & CLIENT STATE TIER                      |
|  +----------------------------------------------------------------------------------+  |
|  | Central Reactive State Store (App.state: source, target, algorithm, route, walk) |  |
|  +------------------------------------------^---------------------------------------+  |
|                                             |                                          |
|  +------------------------------------------v---------------------------------------+  |
|  | Routing Strategy Engine: [Dijkstra] [A*] [BFS] [DFS] [Bellman-Ford] [Floyd-W]    |  |
|  |                          [Held-Karp TSP / 2-Opt Tour Solver]                     |  |
|  +------------------------------------------^---------------------------------------+  |
|                                             |                                          |
|  +------------------------------------------v---------------------------------------+  |
|  | In-Memory Graph Model (36 Vertices, 73 Edges, Adjacency List, Binary Min-Heap)  |  |
|  +------------------------------------------^---------------------------------------+  |
+=============================================|==========================================+
                                              | HTTP GET /data/*.json
+=============================================|==========================================+
|                                             v                                          |
|                  TIER 3: BACKEND REST & STATIC DELIVERY TIER (Node.js)                 |
|  +------------------------+  +------------------------+  +--------------------------+  |
|  | Express HTTP Server    |  | REST Routing (/data/*) |  | Diagnostic /api/health   |  |
|  +-----------^------------+  +-----------^------------+  +--------------------------+  |
+==============|===========================|=============================================+
               |                           |
+==============|===========================|=============================================+
|              v                           v                                             |
|                     TIER 4: GEOGRAPHIC DATA PERSISTENCE TIER                           |
|  [ campus_nodes.json ]        [ campus_edges.json ]       [ campus_buildings.json ]    |
+========================================================================================+
`;

    doc.push(code(archDiagram, "Multi-Tier Architectural Diagram & Communication Flow"));
    md += "```\n" + archDiagram + "\n```\n\n";

    // 4.2
    doc.push(h2("4.2 Data Layer & Geographic Topology Schema"));
    md += `## 4.2 Data Layer & Geographic Topology Schema\n\n`;

    doc.push(p("The campus layout is modeled through three core datasets residing in the persistence tier. Each dataset enforces strict structural schemas to ensure mathematical validity and rendering compatibility:", { line: 280 }));

    doc.push(h3("4.2.1 Node Topology Schema (campus_nodes.json)"));
    doc.push(p("Represents discrete geographical landmarks, junctions, and building entry points across the university. Each node contains a unique integer identifier, full human-readable title, 3D Cartesian coordinates calibrated to real-world meters, semantic category, and contextual description:", { line: 260 }));

    const nodeSchemaExample = `[
  {
    "id": 0,
    "name": "Metro Gate / Main Gate",
    "x": -180.5,
    "y": 0.0,
    "z": 142.3,
    "category": "gate",
    "desc": "Primary southern entry gate adjacent to the campus metro station."
  },
  {
    "id": 16,
    "name": "Central Library",
    "x": -45.2,
    "y": 0.0,
    "z": 12.8,
    "category": "academic",
    "desc": "Four-story central university library and digital repository."
  }
]`;
    doc.push(code(nodeSchemaExample, "Sample Node Schema Specification"));
    md += "```json\n" + nodeSchemaExample + "\n```\n\n";

    doc.push(h3("4.2.2 Edge Adjacency Schema (campus_edges.json)"));
    doc.push(p("Defines traversable pathways between node pairs. Each edge record specifies source node, target node, pre-calculated Euclidean surface distance, walkway surface material (e.g., paved asphalt, concrete tile, covered corridor), and physical accessibility flags:", { line: 260 }));

    const edgeSchemaExample = `[
  {
    "from": 0,
    "to": 1,
    "distance": 42.6,
    "surface": "paved",
    "accessible": true
  },
  {
    "from": 1,
    "to": 4,
    "distance": 31.8,
    "surface": "corridor",
    "accessible": true
  }
]`;
    doc.push(code(edgeSchemaExample, "Sample Edge Adjacency Specification"));
    md += "```json\n" + edgeSchemaExample + "\n```\n\n";

    doc.push(h3("4.2.3 Building Footprint Schema (campus_buildings.json)"));
    doc.push(p("Contains architectural 2.5D building footprints defined as ordered 2D planar polygon boundary vertices, vertical extrusion heights in meters, departmental designations, and chromatic hex codes for WebGL mesh generation.", { line: 260 }));

    // 4.3
    doc.push(h2("4.3 Backend REST API Service Architecture"));
    md += `## 4.3 Backend REST API Service Architecture\n\n`;

    doc.push(p("The backend is implemented as a lightweight, non-blocking HTTP microservice built on Node.js and Express. It serves two vital architectural functions: (1) delivering compiled frontend bundles, textures, and assets, and (2) providing clean RESTful endpoints for spatial data distribution and system diagnostics.", { line: 280 }));

    const apiTableData = [
        ["HTTP Method", "Route Endpoint", "Response Type", "Architectural Responsibility"],
        ["GET", "/api/health", "application/json", "Diagnostic probe returning server uptime, timestamp, memory usage, and operational status."],
        ["GET", "/data/campus_nodes.json", "application/json", "Streams the complete array of 36 landmark vertices and spatial coordinates."],
        ["GET", "/data/campus_edges.json", "application/json", "Streams the 73 bidirectional pedestrian pathway edges with distance weights."],
        ["GET", "/data/campus_buildings.json", "application/json", "Streams the architectural polygon geometries and heights for 3D extrusion."],
        ["GET", "/* (Static Files)", "text/html, js, css", "Serves public assets (index.html, Three.js modules, shaders, styling, images)."]
    ];

    doc.push(table(apiTableData[0], apiTableData.slice(1), [15, 25, 20, 40]));

    // 4.4
    doc.push(h2("4.4 In-Memory Graph Representation & Spatial Indexing"));
    md += `## 4.4 In-Memory Graph Representation & Spatial Indexing\n\n`;

    doc.push(p("Upon client application initialization, the Graph class ingests the node and edge JSON feeds, transforming raw records into an optimized in-memory adjacency list graph representation. The adjacency list is structured using a native ES6 Map<number, Edge[]>, guaranteeing average O(1) lookup time when accessing the neighbor set of any vertex u:", { line: 280 }));

    const graphListing = `// In-Memory Adjacency List Structure
class Graph {
    constructor() {
        this.nodes = new Map();       // Map<nodeId, NodeObject>
        this.adjacency = new Map();   // Map<nodeId, Array<{ target, weight, edge }>>
    }

    addEdge(fromId, toId, weight, edgeData) {
        if (!this.adjacency.has(fromId)) this.adjacency.set(fromId, []);
        if (!this.adjacency.has(toId)) this.adjacency.set(toId, []);

        // Bidirectional walkway connection
        this.adjacency.get(fromId).push({ target: toId, weight, edgeData });
        this.adjacency.get(toId).push({ target: fromId, weight, edgeData });
    }

    getNeighbors(nodeId) {
        return this.adjacency.get(nodeId) || [];
    }
}`;
    doc.push(code(graphListing, "Graph Adjacency List Abstraction"));
    md += "```javascript\n" + graphListing + "\n```\n\n";

    // 4.5
    doc.push(h2("4.5 Algorithmic Engine & Strategy Pattern"));
    md += `## 4.5 Algorithmic Engine & Strategy Pattern\n\n`;

    doc.push(p("To support dynamic swapping between multiple pathfinding solvers without polluting UI logic, the system implements the classic Strategy Design Pattern. Every algorithm module (Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall) conforms to an identical operational interface:", { line: 280 }));

    doc.push(p("findPath(graph, sourceId, targetId, options) -> PathResult", { bold: true, align: AlignmentType.CENTER, color: COLOR_SECONDARY }));

    doc.push(p("The standardized PathResult contract returns a structured telemetry object:", { line: 260 }));
    doc.push(bullet("path", "An ordered array of node IDs from source to target [v_0, v_1, ..., v_k]."));
    doc.push(bullet("distance", "Total accumulated walking distance along the computed path in meters."));
    doc.push(bullet("visitedCount", "Total number of unique vertices explored/expanded during algorithm execution."));
    doc.push(bullet("executionTimeMs", "High-resolution computation time measured via performance.now()."));
    doc.push(bullet("success", "Boolean flag indicating whether a reachable path was established."));

    // 4.6
    doc.push(h2("4.6 3D Spatial Rendering Pipeline & Scene Graph"));
    md += `## 4.6 3D Spatial Rendering Pipeline & Scene Graph\n\n`;

    doc.push(p("The 3D rendering pipeline is constructed using Three.js on top of WebGL 2.0. The pipeline utilizes a right-handed Cartesian coordinate system. Because geographic campus maps are typically drafted in 2D Planar space (X = Easting, Y = Northing), the coordinates are mathematically transformed to align with standard 3D camera conventions:", { line: 280 }));

    doc.push(p("X_3D = X_map,    Y_3D = Elevation (Ground = 0),    Z_3D = -Y_map", { bold: true, align: AlignmentType.CENTER, color: COLOR_ACCENT }));

    doc.push(p("The 3D scene architecture incorporates several specialized visual components:", { line: 280 }));

    doc.push(bullet("Procedural Building Extrusions", "Building footprint polygons are transformed into Three.js Shape geometries and extruded vertically using THREE.ExtrudeGeometry. Custom MeshStandardMaterial shaders apply subtle metallic and roughness properties with campus zone color coding (academic = blue, hostel = orange, sports = green)."));

    doc.push(bullet("Dynamic Billboard Landmark Badges", "Landmark titles are dynamically rasterized onto HTML5 Canvas elements and mapped onto THREE.Sprite entities with SpriteMaterial. Billboard sprites automatically orient towards the camera perspective at all times, ensuring flawless legibility from any viewing angle."));

    doc.push(bullet("Neon Glowing Path Corridors", "Active calculated routes are converted into continuous 3D Catmull-Rom splines and rendered as elevated tubular geometries (THREE.TubeGeometry). A custom pulsing emissive material highlights the path above the ground plane, preventing visual clipping with terrain features."));

    doc.push(bullet("Lighting and Shadows", "A balanced illumination model combines a soft hemisphere ambient light (0.6 intensity) with a directional sunlight (0.8 intensity) configured with cascaded shadow mapping, casting realistic architectural drop shadows that enhance spatial depth perception."));

    // 4.7
    doc.push(h2("4.7 Reactive Client State Management & HUD"));
    md += `## 4.7 Reactive Client State Management & HUD\n\n`;

    doc.push(p("The frontend architecture enforces a unidirectional reactive state flow. A centralized App.state store tracks the active application state, including selected source node, target node, active routing algorithm, calculated route, avatar animation state, and camera mode. Any mutation to the state triggers synchronized updates across the 3D scene, the natural-language turn-by-turn panel, and the real-time benchmark telemetry HUD.", { line: 280 }));

    doc.push(pageBreak());
    return { doc, md };
}
