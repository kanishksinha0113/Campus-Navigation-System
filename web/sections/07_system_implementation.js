import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, code, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter7() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 7: SYSTEM IMPLEMENTATION"));
    md += `# CHAPTER 7: SYSTEM IMPLEMENTATION\n\n`;

    // 7.1
    doc.push(h2("7.1 Backend Microservice & REST Controllers"));
    md += `## 7.1 Backend Microservice & REST Controllers\n\n`;

    doc.push(p("The backend architecture is implemented in server.js as a native, lightweight Node.js HTTP server. Rather than importing heavy framework layers, it utilizes Node's built-in http, fs, and path modules, maintaining zero third-party production dependencies, near-zero startup latency (<50 ms), and minimal memory consumption (<25 MB RSS).", { line: 280 }));

    doc.push(p("The server dispatches incoming requests across static frontend assets and RESTful data endpoints, handling Cross-Origin Resource Sharing (CORS) headers and strict Content-Type MIME mappings:", { line: 260 }));

    const serverSnippet = `// web/server.js - Core Request Dispatcher & Static File Handler
const server = http.createServer((req, res) => {
    // Enable CORS for distributed client access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, \`http://\${req.headers.host}\`);
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
});`;

    doc.push(code(serverSnippet, "Core Server Request Dispatcher in server.js"));
    md += "```javascript\n" + serverSnippet + "\n```\n\n";

    // 7.2
    doc.push(h2("7.2 In-Memory Graph Engine & Coordinate Transformation"));
    md += `## 7.2 In-Memory Graph Engine & Coordinate Transformation\n\n`;

    doc.push(p("The in-memory topological engine is encapsulated in Graph.js. It transforms normalized planar map coordinates (gx, gy in [0, 100]) into calibrated 3D world space meters centered at the campus midpoint (50.0, 50.0). It enriches every node with departmental metadata, icons, and heights, and constructs an adjacency list representation:", { line: 280 }));

    const graphSnippet = `// web/public/js/core/Graph.js - Spatial Coordinate Transform & Adjacency
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
}`;

    doc.push(code(graphSnippet, "Spatial Coordinate Transformation in Graph.js"));
    md += "```javascript\n" + graphSnippet + "\n```\n\n";

    // 7.3
    doc.push(h2("7.3 Pathfinding Solver Implementation: A* Search"));
    md += `## 7.3 Pathfinding Solver Implementation: A* Search\n\n`;

    doc.push(p("The A* pathfinder is encapsulated in AStar.js, inheriting from the base IPathfinder contract. It leverages a binary MinPriorityQueue, tracks cumulative costs in gScore, and evaluates unvisited nodes via Euclidean distance heuristics:", { line: 280 }));

    const astarSnippet = `// web/public/js/algorithms/AStar.js - Heuristic Search Engine
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
}`;

    doc.push(code(astarSnippet, "A* Heuristic Pathfinder Implementation in AStar.js"));
    md += "```javascript\n" + astarSnippet + "\n```\n\n";

    // 7.4
    doc.push(h2("7.4 3D Procedural Meshing & Billboard Badge Generation"));
    md += `## 7.4 3D Procedural Meshing & Billboard Badge Generation\n\n`;

    doc.push(p("The procedural architecture generator in BuildingMesh.js converts 2D building coordinates into extruded 3D solid geometries. It also dynamically generates high-resolution billboard labels by rasterizing text onto an HTML5 Canvas and uploading the image buffer to a WebGL Sprite texture:", { line: 280 }));

    const meshSnippet = `// web/public/js/scene/BuildingMesh.js - Dynamic Billboard Texture Generation
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
}`;

    doc.push(code(meshSnippet, "Dynamic Billboard Badge Rasterization in BuildingMesh.js"));
    md += "```javascript\n" + meshSnippet + "\n```\n\n";

    // 7.5
    doc.push(h2("7.5 Animated Pedestrian Avatar & Kinematics Engine"));
    md += `## 7.5 Animated Pedestrian Avatar & Kinematics Engine\n\n`;

    doc.push(p("The WalkerAvatar.js module controls an animated 3D pedestrian avatar scaled 3.6x with high-visibility safety orange materials to guarantee immediate visual tracking from high aerial isometric angles. As the avatar traverses calculated waypoints, the kinematics engine performs three synchronized operations on every animation frame:", { line: 280 }));

    doc.push(bullet("1. Parametric Linear Interpolation (Lerp)", "Computes the avatar's intermediate position along segment [p_k, p_{k+1}] using the scalar progress alpha in [0, 1]:"));
    doc.push(p("p(t) = (1 - alpha) * p_k + alpha * p_{k+1}", { bold: true, align: AlignmentType.CENTER, color: COLOR_SECONDARY }));

    doc.push(bullet("2. Tangent Alignment (Yaw Rotation)", "Smoothly rotates the avatar's heading towards the current segment vector using the angular differential:"));
    doc.push(p("yaw = atan2( (x_{k+1} - x_k), (z_{k+1} - z_k) )", { bold: true, align: AlignmentType.CENTER, color: COLOR_ACCENT }));

    doc.push(bullet("3. Harmonic Limb Oscillation (Walking Kinematics)", "Oscillates the left and right legs and arms in anti-phase using sinusoidal functions driven by the walk cycle accumulator:"));
    doc.push(p("legLeft.rotation.x = A * sin(omega * t),    legRight.rotation.x = -A * sin(omega * t)", { bold: true, align: AlignmentType.CENTER, color: COLOR_PRIMARY }));
    doc.push(p("armLeft.rotation.x = -B * sin(omega * t),    armRight.rotation.x = B * sin(omega * t)", { bold: true, align: AlignmentType.CENTER, color: COLOR_PRIMARY }));

    const avatarSnippet = `// web/public/js/scene/WalkerAvatar.js - Update Kinematics Loop
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
}`;

    doc.push(code(avatarSnippet, "Avatar Kinematic Update Loop in WalkerAvatar.js"));
    md += "```javascript\n" + avatarSnippet + "\n```\n\n";

    // 7.6
    doc.push(h2("7.6 UI Subsystems & Real-Time Metrics HUD"));
    md += `## 7.6 UI Subsystems & Real-Time Metrics HUD\n\n`;

    doc.push(p("The user interface integrates several reactive components encapsulated in TelemetryHUD.js, NavigationHUD.js, and PlacesDirectory.js. When a route is solved, the telemetry subsystem updates the DOM with high-precision runtime measurements, node expansion counters, and natural language turn guidance without triggering full page reflows.", { line: 280 }));

    doc.push(pageBreak());
    return { doc, md };
}
