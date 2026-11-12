# CampusNav3D Enterprise — IIT Delhi 3D Spatial Digital Twin & Navigator

An interactive commercial-grade 3D campus navigation platform and algorithm evaluation suite for **IIT Delhi**, styled after **Apple Maps 3D**, **Mapbox Studio**, and **Linear**.

Runs directly in any modern browser on `http://localhost:3000` or as a standalone native desktop build.

---

## 🚀 Quick Start (Web Application on Localhost)

### Launch in 1 Step (Node.js)
```bash
cd web
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

Zero external npm dependencies required — the built-in Node.js server starts in $<50\text{ ms}$.

---

## 🌟 Key Features

### 1. Architectural 3D Digital Twin (Three.js)
- **Extruded 3D Buildings**: Footprints and heights proportional to the 11 official IIT Delhi categories (Academic, Hostels, Food, Shopping, Medical, Sports, etc.).
- **Multi-Tier Street Hierarchy**: Cyan-luminescent arterial campus roads vs dark asphalt outer boundary highways.
- **Campus Perimeter Boundary**: Traces the glowing red dashed campus boundary fence digitized directly from the official map.
- **Floating Spatial Badges**: Projecting landmark pins with distance meters that adapt to camera zoom.
- **Direct 3D Raycasting**: Click any building or marker in the 3D scene to set Origin and Destination.
- **Cinematic Camera Rig**: Smooth bezier fly-to transitions, isometric 3D view, and top-down 2D map view presets.

### 2. Commercial Turn-by-Turn Navigation Engine
- Real-time turn guidance ("Depart Ber Sarai Gate heading East toward Nalanda", "Bear right at SAC toward OAT", "Arrive at Main Building").
- Calculates accurate compass bearings, walking ETA (at $1.4\text{ m/s}$), cycling ETA (at $4.5\text{ m/s}$), step counts, and active calories.
- Traversal animation reveals the route node-by-node with a pulsing guidance beacon.

### 3. Enterprise Command Palette (`Ctrl + K` / `Cmd + K`)
- Keyboard-first fuzzy search across all 36 landmarks.
- Direct quick actions: Set Origin (`O`), Set Destination (`D`), or Fly Camera directly to the building.

### 4. DAA Algorithmic Telemetry & Live Benchmark
- Unified Strategy pattern powering all 8 algorithms with identical Big-O guarantees.
- **Live Benchmark Suite**: Runs BFS, DFS, Dijkstra, A\*, Bellman-Ford, and Floyd-Warshall simultaneously on the active query with real microsecond/millisecond performance meters.
- **Frontier Expansion Comparison**: Demonstrates why A\* shares Dijkstra's $\mathcal{O}((V+E)\log V)$ worst-case bound while empirically expanding $60\%\dots 70\%$ fewer nodes on campus cartography.
- **Multi-Stop Itinerary Planner**: Solves Traveling Salesperson (TSP) queries with exact Held-Karp Bitmask DP ($n \le 12$) or Nearest-Neighbor + 2-Opt local search.

---

## 📊 Algorithm Reference & DAA Analysis

| Algorithm | Design Technique | Time Complexity | Space | Role / Real-World Characteristic |
|---|---|---|---|---|
| **BFS** | Queue Traversal | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Minimum hop-count route (unweighted) |
| **DFS** | Stack Traversal | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Structural connectivity; not distance-optimal |
| **Dijkstra** | Greedy + Min-Heap | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V)$ | Standard optimal shortest path on non-negative weights |
| **A\*** | Greedy + Euclidean Heuristic | $\mathcal{O}((V + E) \log V)$ worst | $\mathcal{O}(V)$ | Goal-directed point-to-point; expands far fewer nodes |
| **Bellman-Ford** | Dynamic Programming | $\mathcal{O}(V \cdot E)$ | $\mathcal{O}(V)$ | Iterative edge relaxations; negative-weight cycle detection |
| **Floyd-Warshall** | All-Pairs DP | $\mathcal{O}(V^3)$ precompute, $\mathcal{O}(V)$ query | $\mathcal{O}(V^2)$ | Precomputed at startup; instant sub-millisecond lookup |
| **Held-Karp TSP** | DP + Bitmask | $\mathcal{O}(n^2 \cdot 2^n)$ | $\mathcal{O}(n \cdot 2^n)$ | Exact optimal multi-stop tour for $n \le 12$ waypoints |
| **NN + 2-Opt TSP** | Greedy + Local Search | $\mathcal{O}(n^2)$ per pass | $\mathcal{O}(n)$ | Fast heuristic multi-stop fallback for large itineraries |

---

## 📁 Repository Structure

```
CampusNav3D/
├── data/
│   ├── campus_nodes.json           # 36 digitized landmarks from IIT Delhi map
│   └── campus_edges.json           # 73 road corridors with category weights
├── web/                            # Modern Localhost Web Application
│   ├── server.js                   # Node.js high-performance server (port 3000)
│   ├── test_algorithms.js          # Automated headless validation suite (9/9 passed)
│   ├── package.json
│   └── public/
│       ├── index.html              # Apple Maps / Linear-grade single-page UI
│       ├── campus_map.jpg          # High-res official IIT Delhi reference map
│       ├── css/styles.css          # Glassmorphism design system
│       ├── vendor/                 # Three.js (r128) + OrbitControls
│       └── js/
│           ├── core/               # Graph data model, bearing math, reactive store
│           ├── algorithms/         # BFS, DFS, Dijkstra, A*, BF, FW, TSP, Benchmark
│           ├── scene/              # World, BuildingMesh, RoadNetwork, TrailRenderer
│           ├── ui/                 # CommandPalette, NavigationHUD, TelemetryHUD
│           └── main.js             # Master bootstrap
├── src/                            # Native C++17 desktop source (raylib + Dear ImGui)
├── tests/                          # Native Catch2 unit tests (20/20 passed)
└── docs/
    └── README.md
```

---

## 🧪 Automated Test Verification

Run the comprehensive headless test suite:
```bash
node web/test_algorithms.js
```

Output:
```
=== Running Web Algorithm Validation Suite ===
Graph initialized: 36 nodes, 73 edges.
✓ Dijkstra (0 -> 16): dist=63.1, nodes=4, expansions=22, time=0.348ms
✓ A* (0 -> 16): dist=63.1, expansions=7 (vs Dijkstra 22) -> 68% reduction
✓ Bellman-Ford (0 -> 16): dist=63.1, success=true
✓ Floyd-Warshall (0 -> 16): dist=63.1, lookup time=0.010ms
✓ BFS (0 -> 16): hops=3, dist=63.1
✓ DFS (0 -> 16): path length=14
✓ Held-Karp TSP (4 waypoints): tour distance=138.8, time=0.989ms
✓ 2-Opt TSP (4 waypoints): tour distance=138.8
✓ Benchmark Suite: 6 algorithms evaluated.

ALL 9 WEB ALGORITHM VALIDATION TESTS PASSED!
```
