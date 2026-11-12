# CAMPUS NAVIGATION SYSTEM
## An Integrated Spatial Digital Twin & Algorithmic Graph Routing Engine
**Submitted by:** Kanishk Sinha | AP25110080048 | CSE BDA 'A'


# CHAPTER 1: INTRODUCTION

## 1.1 Context and Evolution of Campus Wayfinding

## 1.2 Limitations of Commercial Mapping in University Micro-Cities

## 1.3 Foundations of Graph Theory in Navigation

## 1.4 Project Motivation and Scope

## 1.5 Report Organization



# CHAPTER 2: PROBLEM STATEMENT AND OBJECTIVES

## 2.1 Problem Formulation

## 2.2 Operational Challenges in Campus Navigation

## 2.3 Proposed Solution: Spatial Digital Twin & Algorithmic Router

## 2.4 Project Objectives



# CHAPTER 3: SYSTEM REQUIREMENTS SPECIFICATION

## 3.1 Functional Requirements Specification

## 3.2 Non-Functional Requirements

## 3.3 Hardware Specifications

## 3.4 Software Specifications



# CHAPTER 4: SYSTEM ARCHITECTURE AND DESIGN

## 4.1 Multi-Tier System Architecture

```

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

```

## 4.2 Data Layer & Geographic Topology Schema

```json
[
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
]
```

```json
[
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
]
```

## 4.3 Backend REST API Service Architecture

## 4.4 In-Memory Graph Representation & Spatial Indexing

```javascript
// In-Memory Adjacency List Structure
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
}
```

## 4.5 Algorithmic Engine & Strategy Pattern

## 4.6 3D Spatial Rendering Pipeline & Scene Graph

## 4.7 Reactive Client State Management & HUD



# CHAPTER 5: TECHNOLOGIES AND DATA STRUCTURES

## 5.1 Technology Stack Selection and Rationale

## 5.2 Comparative Analysis of Graph Data Structures

## 5.3 Priority Queue Architectures & Min-Heap Analysis

## 5.4 Cache-Friendly All-Pairs Cost Matrices

## 5.5 Bitmask State Spaces for Exponential Combinatorics



# CHAPTER 6: ALGORITHMS AND METHODOLOGY

## 6.1 Mathematical Graph Formulation

## 6.2 Dijkstra's Single-Source Shortest Path Algorithm

```
Algorithm Dijkstra(Graph G, Source s, Target t):
    Initialize dist[v] = infinity for all v in V
    Initialize prev[v] = null for all v in V
    dist[s] = 0
    PQ = new BinaryMinHeap()
    PQ.insert(s, 0)

    while PQ is not empty:
        u = PQ.extractMin()
        if u == t: break  // Target reached

        for each neighbor (v, weight) of u:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                prev[v] = u
                PQ.insertOrUpdate(v, dist[v])

    return ReconstructPath(prev, s, t)
```

## 6.3 A* (A-Star) Heuristic Search Algorithm

## 6.4 Unweighted Search: Breadth-First Search & Depth-First Search

## 6.5 Dynamic Programming: Bellman-Ford & Floyd-Warshall

## 6.6 Traveling Salesperson Problem (TSP) for Multi-Stop Tours

## 6.7 Semantic Navigation: Compass Bearing & Turn-by-Turn Logic

## 6.8 Algorithmic Complexity and Trade-Off Master Matrix



# CHAPTER 7: SYSTEM IMPLEMENTATION

## 7.1 Backend Microservice & REST Controllers

```javascript
// web/server.js - Core Request Dispatcher & Static File Handler
const server = http.createServer((req, res) => {
    // Enable CORS for distributed client access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Route: System Health Check Probe
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'online',
            service: 'CampusNav3D-Backend',
            uptimeSeconds: process.uptime(),
            memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
        }));
        return;
    }

    // Route: Campus Topological Data Streams
    if (pathname.startsWith('/data/')) {
        const dataFile = path.join(DATA_DIR, pathname.replace('/data/', ''));
        serveFile(res, dataFile, MIME_TYPES['.json']);
        return;
    }

    // Default: Static Frontend Asset Pipeline
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    const ext = path.extname(filePath).toLowerCase();
    serveFile(res, filePath, MIME_TYPES[ext] || 'application/octet-stream');
});
```

## 7.2 In-Memory Graph Engine & Coordinate Transformation

```javascript
// web/public/js/core/Graph.js - Spatial Coordinate Transform & Adjacency
export class Graph {
    constructor() {
        this.nodes = new Map();     // id -> Node Record
        this.adj = new Map();       // id -> Edge[]
        this.nodeOrder = [];
        this.edges = [];
    }

    // Transforms normalized 2D map space (0-100) into 3D metric world space
    static gridToWorld(gx, gy, scale = 12.0) {
        const wx = (gx - 50.0) * scale;       // West -> East axis
        const wz = (50.0 - gy) * scale;       // South -> North axis (inverted Z)
        return { x: wx, y: 0.0, z: wz };
    }

    addNode(node) {
        const world = Graph.gridToWorld(node.x, node.y);
        const enriched = {
            ...node,
            worldX: world.x,
            worldY: world.y,
            worldZ: world.z,
            categoryMeta: CATEGORY_META[node.category] || CATEGORY_META.Academic
        };
        this.nodes.set(node.id, enriched);
        if (!this.adj.has(node.id)) {
            this.adj.set(node.id, []);
            this.nodeOrder.push(node.id);
        }
    }

    addEdge(u, v, weight, meta = {}) {
        const w = (weight !== undefined && weight !== null)
            ? weight
            : this.calcDistance(this.getNode(u), this.getNode(v));
        this.adj.get(u).push({ to: v, weight: w, meta });
        this.adj.get(v).push({ to: u, weight: w, meta });
    }
}
```

## 7.3 Pathfinding Solver Implementation: A* Search

```javascript
// web/public/js/algorithms/AStar.js - Heuristic Search Engine
export class AStarPathfinder extends IPathfinder {
    constructor() {
        super('A*', 'O((V + E) log V) worst', 'Greedy + Euclidean Heuristic (Admissible & Consistent)');
    }

    heuristic(graph, uId, dstId) {
        const u = graph.getNode(uId);
        const dst = graph.getNode(dstId);
        if (!u || !dst) return 0;
        return Math.hypot(u.x - dst.x, u.y - dst.y);
    }

    findPath(graph, srcId, dstId) {
        const start = performance.now();
        const res = new PathResult();
        const pq = new MinPriorityQueue();
        const gScore = new Map();
        const parent = new Map();
        const visited = new Set();

        gScore.set(srcId, 0.0);
        pq.push(srcId, this.heuristic(graph, srcId, dstId));

        while (!pq.isEmpty()) {
            const { item: u } = pq.pop();
            if (visited.has(u)) continue;
            visited.add(u);
            res.nodesExpanded++;
            res.visitOrder.push(u);

            if (u === dstId) {
                res.success = true;
                res.distance = gScore.get(u);
                res.distanceMeters = Math.round(res.distance * 20.0);
                break;
            }

            const currentG = gScore.get(u);
            for (const edge of graph.getNeighbors(u)) {
                if (visited.has(edge.to)) continue;
                const tentativeG = currentG + edge.weight;
                const knownG = gScore.has(edge.to) ? gScore.get(edge.to) : Infinity;

                if (tentativeG < knownG) {
                    gScore.set(edge.to, tentativeG);
                    parent.set(edge.to, u);
                    const fScore = tentativeG + this.heuristic(graph, edge.to, dstId);
                    pq.push(edge.to, fScore);
                }
            }
        }
        res.path = this._reconstructPath(parent, srcId, dstId);
        res.runtimeMs = performance.now() - start;
        return res;
    }
}
```

## 7.4 3D Procedural Meshing & Billboard Badge Generation

```javascript
// web/public/js/scene/BuildingMesh.js - Dynamic Billboard Texture Generation
_createFloatingBadge(name, category, worldPos, height) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // High-contrast rounded badge background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'; // Deep Navy Slate
    ctx.strokeStyle = '#0284c7';              // Electric Cyan Border
    ctx.lineWidth = 4;
    ctx.roundRect(10, 10, 492, 108, 24);
    ctx.fill();
    ctx.stroke();

    // Bold Typography Rendering
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 256, 60);

    // Dynamic Sprite Texture Binding
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(worldPos.x, height + 8.0, worldPos.z);
    sprite.scale.set(24, 6, 1);
    return sprite;
}
```

## 7.5 Animated Pedestrian Avatar & Kinematics Engine

```javascript
// web/public/js/scene/WalkerAvatar.js - Update Kinematics Loop
update(delta) {
    if (!this.isWalking || this.pathPoints.length < 2) return;

    const pA = this.pathPoints[this.currentSegment];
    const pB = this.pathPoints[this.currentSegment + 1];
    const segDist = pA.distanceTo(pB);

    // Advance segment progress based on calibrated walking velocity
    this.segmentProgress += (this.walkSpeed * delta) / Math.max(segDist, 0.001);

    if (this.segmentProgress >= 1.0) {
        this.segmentProgress = 0.0;
        this.currentSegment++;
        if (this.currentSegment >= this.pathPoints.length - 1) {
            this.stopWalking();
            if (this.onComplete) this.onComplete();
            return;
        }
    }

    // Position Interpolation
    this.group.position.lerpVectors(pA, pB, this.segmentProgress);

    // Orientation Slerp
    const angle = Math.atan2(pB.x - pA.x, pB.z - pA.z);
    this.group.rotation.y = THREE.MathUtils.lerp(this.group.rotation.y, angle, 0.15);

    // Harmonic Limb Oscillation
    this.walkCycle += delta * (this.walkSpeed * 0.4);
    const legAngle = Math.sin(this.walkCycle) * 0.65;
    this.leftLeg.rotation.x = legAngle;
    this.rightLeg.rotation.x = -legAngle;
    this.leftArm.rotation.x = -legAngle * 0.8;
    this.rightArm.rotation.x = legAngle * 0.8;
}
```

## 7.6 UI Subsystems & Real-Time Metrics HUD



# CHAPTER 8: TESTING AND RESULTS

## 8.1 Automated Test Harness & Verification Methodology

## 8.2 Automated Test Suite Results

## 8.3 Empirical Performance Benchmark Analysis

## 8.4 3D Rendering Performance & GPU Profiling

## 8.5 Visual Verification and Ground-Truth Alignment

![Live 3D WebGL Digital Twin Viewport](C:\Users\Kanishk Sinha\OneDrive\Documents\CampusNav3D\screenshot_3d_nav.png)
*Figure 8.1: Live 3D WebGL Digital Twin Viewport showing Active Glowing Path Corridor, Extruded Buildings, Floating Billboard Labels, and Telemetry HUD.*

![Ground-Truth Architectural Master Plan](C:\Users\Kanishk Sinha\OneDrive\Documents\CampusNav3D\campus_map_ref.jpg)
*Figure 8.2: Ground-Truth Architectural Master Plan of IIT Delhi Campus Used for Coordinate Calibration and Edge Verification.*



# CHAPTER 9: LIMITATIONS AND FUTURE SCOPE

## 9.1 Current System Limitations

## 9.2 Future Scope and System Enhancements



# CHAPTER 10: CONCLUSION

## 10.1 Project Summary

## 10.2 Academic and Pedagogical Contributions

## 10.3 Final Concluding Remarks

# REFERENCES



