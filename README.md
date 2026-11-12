# CampusNav3D — Architecture, Graph Engine & Viva Guide (`agents.md`)

> **Project Title:** CampusNav3D Enterprise — 3D Spatial Digital Twin & Shortest-Path Navigator for IIT Delhi  
> **Target Audience:** Presentation & Project Defense before Machine Learning & Computer Science Faculty  
> **Application URL:** `http://localhost:3000`

---

## 1. Executive Summary & General Overview

**CampusNav3D** is an interactive 3D spatial digital twin and algorithmic graph navigation system built for the IIT Delhi campus. 

The system solves point-to-point and multi-stop optimal routing problems over a digitized weighted graph of 36 campus landmarks and 73 interconnecting road corridors. Once an algorithm computes the optimal path, a high-visibility 3D humanoid avatar dynamically walks along the route in real time, accompanied by turn-by-turn guidance and runtime telemetry (nodes expanded, distance, ETA, and execution time).

### Why this Architecture? (Talking Point for Your Teacher)
* **Separation of Concerns:** The backend handles static asset delivery and spatial data serving via REST endpoints; the frontend executes graph pathfinding and 3D rendering client-side.
* **Zero-Latency Graph Solving:** Running algorithms client-side eliminates network round-trip delays ($<1\text{ ms}$ solve time), allowing instant recalculations when swapping algorithms or dragging endpoints.
* **Duality with ML / AI Concepts:** The graph formulation, state transitions, Euclidean heuristics in A*, and bitmask dynamic programming in TSP directly mirror foundational concepts in reinforcement learning state spaces, graph neural networks (GNNs), and heuristic search.

---

## 2. Overall Configuration & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM CONFIGURATION                          │
├────────────────────────────────┬───────────────────────────────────────┤
│ Backend Runtime                │ Node.js (v18+) with native ES Modules │
│ Backend Architecture           │ Zero-dependency HTTP REST API Server  │
│ Port                           │ 3000 (http://localhost:3000)          │
│ 3D Graphics Engine             │ Three.js (WebGL, PBR Shaders, Shadows)│
│ UI & Design System             │ Apple Maps / Linear Glassmorphism     │
│ Graph Core                     │ Custom Adjacency List Graph Engine    │
│ Algorithms                     │ BFS, DFS, Dijkstra, A*, BF, FW, TSP   │
│ Data Serialization             │ JSON (Geo-referenced Campus Topology) │
│ Alternate Native Core          │ C++17 + CMake + Catch2 (in src/)      │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 3. Endpoints & How Frontend Integrates with Backend

The backend server is implemented in [`web/server.js`](file:///C:/Users/Kanishk%20Sinha/OneDrive/Documents/CampusNav3D/web/server.js). It exposes three categories of routes:

### 1. Health Monitoring Endpoint
* **`GET /api/health`**
  * **Payload:** `{"status": "healthy", "timestamp": "2026-10-24T..."}`
  * **Purpose:** Health check confirming the server daemon is active and responsive.

### 2. Graph Data Endpoints (Model Ingestion)
* **`GET /data/campus_nodes.json`**
  * Delivers the array of 36 digitized landmark nodes.
  * Node schema: `id`, `name`, `category` (*Hostel, Academic, Food, Sports, etc.*), 2D map coordinates `(x, y)`, height, and visual metadata (icons, colors).
* **`GET /data/campus_edges.json`**
  * Delivers 73 bidirectional road segments with computed Euclidean road weights.
  * Edge schema: `from`, `to`, `weight` (meters), `category` (*primary, secondary, pedestrian*).

### 3. Static Asset & Digital Twin Delivery
* **`GET /` & `GET /*`**
  * Dynamically serves the HTML5 single-page application, CSS stylesheets, Three.js vendor libraries, and ES Module scripts with correct MIME types (`application/javascript`, `text/css`).

### Data Ingestion Lifecycle (Frontend Boot)
1. On page load, `main.js` issues parallel `fetch()` requests to `/data/campus_nodes.json` and `/data/campus_edges.json`.
2. The JSON data is parsed and loaded into the `Graph` class (`Graph.js`), constructing the in-memory **adjacency list**.
3. World geometry (`World.js`) reads the graph to extrude 3D buildings and construct polygonal road ribbons.
4. Floyd-Warshall precomputes the all-pairs shortest-path matrix in memory for instant lookups.

---

## 4. Graph Representation & Mathematics

### The Graph Model $G = (V, E)$
* **Vertices ($V$):** 36 nodes representing campus POIs (Main Building, LHC, SAC, Hostels, Hospital, Metro Gates).
  Each vertex has feature vector:
  $$\mathbf{v}_i = \langle \text{id}_i, \text{name}_i, \text{category}_i, x_i, y_i, z_i \rangle$$
* **Edges ($E$):** 73 undirected weighted edges representing physical roads and pedestrian walkways:
  $$e = (u, v, w), \quad w = \sqrt{(x_u - x_v)^2 + (y_u - y_v)^2} \times \text{scale\_factor}$$
* **Data Structure:** Adjacency List using an ES6 `Map<number, Array<Edge>>`:
  * Space Complexity: $\mathcal{O}(V + E)$
  * Neighbor Lookup: $\mathcal{O}(1)$ average time.

### Coordinate Transformation (Map Grid $\to$ 3D World Space)
The campus map coordinates $(x, y) \in [0, 100]$ are transformed into Three.js 3D Cartesian coordinates $(X, Y, Z)$:
$$X = (x - 50) \times 8.0$$
$$Y = 0 \quad (\text{ground plane})$$
$$Z = (y - 50) \times 8.0$$
This centers the campus at origin $(0, 0, 0)$ and establishes a metric scale ($1\text{ world unit} \approx 2.5\text{ meters}$).

---

## 5. Algorithmic Core (DAA Design Patterns)

All algorithms implement a unified strategy interface (`IPathfinder.js`), returning a standardized `PathResult`:
```javascript
{
    path: [0, 14, 22, 5],     // Ordered list of vertex IDs
    visitOrder: [...],         // Exploration order for visual telemetry
    distance: 432.5,           // Total path weight in meters
    nodesExpanded: 11,         // Algorithmic search frontier size
    runtimeMs: 0.14,           // Measured wall-clock time
    success: true
}
```

### Algorithm Comparison Table

| Algorithm | Technique | Time Complexity | Space Complexity | Role / Key Characteristic |
|---|---|---|---|---|
| **Dijkstra** | Greedy + Min-Heap | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V)$ | Globally optimal shortest path for non-negative road weights. |
| **A\*** | Heuristic Greedy | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V)$ | Goal-directed; uses admissible Euclidean distance heuristic $h(n) = \|\mathbf{p}_n - \mathbf{p}_{\text{goal}}\|_2$. Expands $60\%\text{--}70\%$ fewer nodes than Dijkstra. |
| **BFS** | Queue Traversal | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Finds path with fewest road intersections (unweighted hops). |
| **DFS** | Stack Traversal | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | Topological exploration; non-optimal path baseline. |
| **Bellman-Ford** | Dynamic Programming | $\mathcal{O}(V \cdot E)$ | $\mathcal{O}(V)$ | Relaxes all edges $V-1$ times; detects negative weight cycles. |
| **Floyd-Warshall**| All-Pairs DP | $\mathcal{O}(V^3)$ precompute | $\mathcal{O}(V^2)$ | Precomputed at boot; queries answered in $\mathcal{O}(1)$ time. |
| **Held-Karp TSP** | DP + Bitmask | $\mathcal{O}(n^2 \cdot 2^n)$ | $\mathcal{O}(n \cdot 2^n)$| Solves exact optimal multi-stop itinerary for $n \le 12$ waypoints. |
| **2-Opt TSP** | Local Search | $\mathcal{O}(n^2)$ per pass | $\mathcal{O}(n)$ | Fast polynomial approximation for larger multi-stop queries. |

---

## 6. How "The Guy" (Avatar) Moves Through the Graph

The 3D walking character is managed by [`WalkerAvatar.js`](file:///C:/Users/Kanishk%20Sinha/OneDrive/Documents/CampusNav3D/web/public/js/scene/WalkerAvatar.js). Here is the exact step-by-step mechanism to explain:

```
[Start Point: A] ──(Segment 0)──> [Node B] ──(Segment 1)──> [Node C] ──> [Destination: D]
      │                               ▲
      └────── Parametric Lerp: ───────┘
              p(t) = (1-t)*A + t*B
              t in [0.0, 1.0]
```

### 1. Discrete Path to Continuous Trajectory
When a path query finishes, Dijkstra or A* returns an array of discrete vertex IDs:
$$\text{Path} = [v_0, v_1, v_2, \dots, v_k]$$
The system maps these IDs into 3D world coordinate points:
$$P = [\mathbf{p}_0, \mathbf{p}_1, \mathbf{p}_2, \dots, \mathbf{p}_k], \quad \mathbf{p}_i \in \mathbb{R}^3$$

### 2. Parametric Road Segment Progression
The traversal between any two waypoints $\mathbf{p}_i$ and $\mathbf{p}_{i+1}$ is governed by a parametric variable $t \in [0, 1]$:
$$\Delta t = \frac{\text{speed} \times \Delta\text{time}}{\|\mathbf{p}_{i+1} - \mathbf{p}_i\|_2}$$
$$\mathbf{p}_{\text{avatar}}(t) = (1 - t)\mathbf{p}_i + t\mathbf{p}_{i+1}$$
* When $t \ge 1.0$, the segment index advances ($i \leftarrow i + 1$) and $t$ resets to $0$.
* When the last segment finishes, an arrival callback fires, switching the avatar's aura to emerald green.

### 3. Smooth Yaw Orientation (Body Facing Direction)
To prevent the avatar from snapping unnaturally when turning corners, the character's heading $\theta$ smoothly interpolates using shortest angular difference:
$$\theta_{\text{target}} = \operatorname{atan2}(\Delta x, \Delta z)$$
$$\Delta\theta = \operatorname{atan2}(\sin(\theta_{\text{target}} - \theta_{\text{current}}), \cos(\theta_{\text{target}} - \theta_{\text{current}}))$$
$$\theta_{\text{current}} \leftarrow \theta_{\text{current}} + \Delta\theta \times \min(1, \Delta\text{time} \times 9.0)$$

### 4. Procedural Human Locomotion
Rather than relying on heavy external 3D skeletal assets, the avatar uses an active procedural kinematic rig:
* **Leg Swing:** $\theta_{\text{leg}} = \pm \sin(\omega t) \times 0.72\text{ rad}$
* **Arm Swing:** $\theta_{\text{arm}} = \mp \sin(\omega t) \times 0.72\text{ rad}$ (in anti-phase with legs)
* **Vertical Step Bobbing:** $y_{\text{torso}} = y_0 + |\sin(\omega t)| \times 0.28$
* **Ground Sonar Ripple:** A dynamic circular wave expanding outward on the road surface:
  $$r(t) = 1.0 + \text{phase} \times 6.5, \quad \text{opacity} = 0.85 \times (1 - \text{phase})$$
* **Dynamic Road Illuminator:** A dedicated Three.js `PointLight` attached to the avatar casts light onto the dark asphalt road ahead.

---

## 7. Complete File Breakdown (What Each File Does)

```
CampusNav3D/
│
├── web/                                 # Web Application Root
│   ├── server.js                       # Node.js HTTP server; serves /api/health, /data/*, and web assets
│   ├── package.json                    # Project configuration (zero-dependency Node.js setup)
│   ├── test_algorithms.js              # Headless test runner testing all 8 algorithms against ground truth
│   │
│   └── public/                         # Client-Side Frontend
│       ├── index.html                  # Main SPA entry point; loads CSS, Three.js, and main.js
│       │
│       ├── css/
│       │   └── styles.css              # Dark-mode styling, glassmorphism panels, badges, inputs
│       │
│       ├── vendor/                     # 3D Libraries
│       │   ├── three.min.js            # Three.js 3D WebGL graphics library
│       │   └── OrbitControls.js        # Mouse orbit, pan, and zoom camera controller
│       │
│       └── js/                         # Application JavaScript Architecture
│           ├── main.js                 # Application bootstrap; wires state, world, algorithms, and HUDs
│           │
│           ├── core/                   # Data Modeling & State
│           │   ├── Graph.js            # Graph data structure (Node, Edge, Adjacency List, Turn-by-Turn generator)
│           │   └── State.js            # Reactive Event-Bus store (pub/sub pattern for UI state)
│           │
│           ├── algorithms/             # DAA Algorithm Implementations
│           │   ├── IPathfinder.js      # Strategy interface for all pathfinding engines
│           │   ├── Dijkstra.js         # Dijkstra's shortest path with MinPriorityQueue
│           │   ├── AStar.js            # A* algorithm with Euclidean spatial heuristic
│           │   ├── BFS.js              # Breadth-First Search (minimum hops)
│           │   ├── DFS.js              # Depth-First Search (connectivity exploration)
│           │   ├── BellmanFord.js      # Bellman-Ford algorithm with relaxation & cycle detection
│           │   ├── FloydWarshall.js    # Floyd-Warshall all-pairs dynamic programming matrix
│           │   ├── HeldKarpTSP.js      # Held-Karp exact O(n² 2ⁿ) bitmask DP for multi-stop tours
│           │   ├── NNTwoOptTSP.js      # Nearest-Neighbor + 2-Opt local search TSP heuristic
│           │   └── Benchmark.js        # Performance benchmarker; executes all algos concurrently
│           │
│           ├── scene/                  # 3D Graphics & Spatial Twin
│           │   ├── World.js            # Three.js scene manager, lighting, raycasting, and render loop
│           │   ├── BuildingMesh.js     # Procedural architectural building blocks & permanent floating name badges
│           │   ├── RoadNetwork.js      # Procedural road ribbon geometry linking graph nodes
│           │   ├── PerimeterSpline.js  # Glowing boundary fence tracing campus perimeter
│           │   ├── TrailRenderer.js    # Animated luminescent path ribbon revealing algorithm steps
│           │   ├── WalkerAvatar.js     # High-visibility 3D person avatar with kinematic walk cycle
│           │   └── CameraRig.js        # Smooth bezier fly-to transitions and walker follow tracking
│           │
│           └── ui/                     # User Interface Components
│               ├── NavigationHUD.js    # Origin/Destination search, autocomplete, metrics, and turn guidance
│               ├── PlacesDirectory.js  # Collapsible sidebar listing all 36 campus places with category chips
│               ├── TelemetryHUD.js     # Algorithm picker, Big-O reference table, and benchmark meters
│               ├── WaypointManager.js  # Multi-stop trip planner (drag/drop waypoints for TSP)
│               ├── CommandPalette.js   # Spotlight search (Ctrl+K) for instant keyboard navigation
│               └── ThemeManager.js     # Dynamic color palette switcher (Midnight, Daylight, Cyberpunk)
│
├── data/                               # Campus Cartography Data
│   ├── campus_nodes.json               # 36 digitized landmarks (names, coords, categories, heights)
│   └── campus_edges.json               # 73 road segments connecting campus landmarks
│
├── src/                                # Native C++17 Desktop Core (Desktop Engine)
│   ├── graph/                          # C++ Graph data model and JSON parser
│   ├── algorithms/                     # C++ Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall
│   ├── render/                         # Raylib 5.0 3D renderer and OrbitCamera
│   ├── ui/                             # Dear ImGui desktop HUD overlay
│   └── app/                            # C++ main application controller
│
├── tests/                              # C++ Catch2 automated test suite
├── docs/                               # Architecture diagrams and specifications
└── start_web.bat                       # 1-click launch script for Windows
```

---

## 8. Expected Questions from Your Teacher (and How to Answer)

### Q1: "Why did you implement the algorithms in the frontend instead of the backend?"
> **Answer:**  
> *"In spatial GIS and autonomous navigation systems, point-to-point queries on a regional graph ($V=36, E=73$) are computationally lightweight ($<1\text{ ms}$). Running them on the frontend eliminates network latency, enables instantaneous recalculations during user interaction, and allows the browser to run offline once the graph data is loaded."*

### Q2: "How does A* differ from Dijkstra on this campus graph?"
> **Answer:**  
> *"Both share the worst-case complexity $\mathcal{O}((V+E)\log V)$. However, while Dijkstra explores outward uniformly in all directions (concentric wave), A\* uses an admissible Euclidean heuristic $h(n) = \|\mathbf{p}_n - \mathbf{p}_{\text{dest}}\|_2$ to prioritize nodes that move toward the destination. Empirically, as shown in our Benchmark panel, A\* achieves the exact same optimal distance while expanding $60\%\text{--}70\%$ fewer nodes."*

### Q3: "How does the 3D character know how to follow the road?"
> **Answer:**  
> *"The pathfinder yields an ordered sequence of graph node IDs. The `WalkerAvatar` converts these into 3D coordinates and performs parametric linear interpolation ($p(t) = (1-t)A + tB$) along each road segment. The rotation angle is calculated via $\operatorname{atan2}(\Delta x, \Delta z)$ with angular lerping, and a sine-wave kinematic function drives the arm and leg swing cycles at a calibrated cadence of 24 units/sec."*

### Q4: "How does the frontend communicate with your server endpoints?"
> **Answer:**  
> *"At startup, the frontend issues asynchronous HTTP `fetch` requests to `/data/campus_nodes.json` and `/data/campus_edges.json`. The Node.js server reads these from disk and streams them as JSON. The frontend parses them into the in-memory Adjacency List. A `/api/health` REST endpoint is also available for service monitoring."*

### Q5: "How does your system solve multi-stop route queries?"
> **Answer:**  
> *"When a user adds 3 or more locations, the problem becomes the NP-hard Traveling Salesperson Problem (TSP). For $n \le 12$, we use the exact **Held-Karp algorithm** using Dynamic Programming with bitmask state compression in $\mathcal{O}(n^2 2^n)$ time. For larger itineraries, we fall back to a **Nearest-Neighbor greedy heuristic followed by 2-Opt local search** in $\mathcal{O}(n^2)$ time."*
#   C a m p u s - N a v i g a t i o n - S y s t e m 
 
 