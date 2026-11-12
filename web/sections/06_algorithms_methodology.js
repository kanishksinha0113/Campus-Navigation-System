import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, code, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter6() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 6: ALGORITHMS AND METHODOLOGY"));
    md += `# CHAPTER 6: ALGORITHMS AND METHODOLOGY\n\n`;

    // 6.1
    doc.push(h2("6.1 Mathematical Graph Formulation"));
    md += `## 6.1 Mathematical Graph Formulation\n\n`;

    doc.push(p("The campus layout is formally defined as an undirected, edge-weighted mathematical graph G = (V, E, W), where:", { line: 280 }));

    doc.push(bullet("V = {v_0, v_1, ..., v_{n-1}}", "The set of n = 36 vertices corresponding to spatial landmarks, walkway intersections, and building entry porticos."));
    doc.push(bullet("E = {e_0, e_1, ..., e_{m-1}}", "The set of m = 73 bidirectional edges representing physical pedestrian pathways connecting adjacent vertices."));
    doc.push(bullet("W: E -> R+", "A metric weight function assigning a positive real number w(u, v) > 0 to each edge, defined as the true 3D Euclidean surface distance:"));

    doc.push(p("w(u, v) = sqrt( (x_u - x_v)^2 + (y_u - y_v)^2 + (z_u - z_v)^2 )", { bold: true, align: AlignmentType.CENTER, color: COLOR_SECONDARY }));

    doc.push(p("Because edge weights represent physical spatial distances on a Euclidean terrain, the graph G forms a valid Metric Space satisfying the three fundamental metric axioms:", { line: 280 }));
    doc.push(bullet("1. Non-negativity & Identity", "w(u, v) >= 0 for all u, v; and w(u, v) = 0 if and only if u = v."));
    doc.push(bullet("2. Symmetry", "w(u, v) = w(v, u) for all (u, v) in E (bidirectional walkways)."));
    doc.push(bullet("3. Triangle Inequality", "w(u, v) <= w(u, k) + w(k, v) for any intermediate waypoint k in the Euclidean plane."));

    // 6.2
    doc.push(h2("6.2 Dijkstra's Single-Source Shortest Path Algorithm"));
    md += `## 6.2 Dijkstra's Single-Source Shortest Path Algorithm\n\n`;

    doc.push(p("Dijkstra's algorithm is a classical greedy algorithm designed to determine the shortest path from a designated source vertex s in V to all other reachable vertices in a graph with non-negative edge weights.", { line: 280 }));

    doc.push(h3("6.2.1 Algorithmic Invariant and Relaxation Principle"));
    doc.push(p("The algorithm maintains a set of visited vertices S for which the exact shortest path distance from the source has been finalized, and a tentative distance array dist[v] representing the minimum known cost to reach vertex v from source s. The algorithm relies upon the fundamental Relaxation Operation:", { line: 260 }));

    doc.push(p("Relax(u, v, w): if dist[u] + w(u, v) < dist[v] then:", { bold: true, align: AlignmentType.CENTER, color: COLOR_ACCENT }));
    doc.push(p("   dist[v] <- dist[u] + w(u, v)   |   prev[v] <- u   |   PQ.decreaseKey(v, dist[v])", { bold: true, align: AlignmentType.CENTER, color: COLOR_ACCENT }));

    doc.push(p("Invariant: At the beginning of each extraction step, for every vertex u in S, dist[u] equals the true shortest distance delta(s, u) from the source. Furthermore, when vertex u* with the minimum tentative distance is extracted from the unvisited priority queue Q = V \\ S, dist[u*] is finalized: dist[u*] = delta(s, u*).", { line: 280 }));

    doc.push(h3("6.2.2 Asymptotic Complexity"));
    doc.push(p("Utilizing a Binary Min-Heap for priority queue operations:", { line: 260 }));
    doc.push(bullet("Queue Initialization", "O(V) to insert all vertices into the heap."));
    doc.push(bullet("Extract-Min Operations", "Executed exactly |V| times, each taking O(log V) time: O(V log V)."));
    doc.push(bullet("Edge Relaxations (Decrease-Key)", "Executed at most |E| times across all adjacency lists, each taking O(log V): O(E log V)."));
    doc.push(bullet("Total Time Complexity", "O((V + E) log V). For V = 36 and E = 73, (36 + 73) * log2(36) ~= 109 * 5.17 ~= 563 basic operations, executing in under 0.5 milliseconds."));
    doc.push(bullet("Space Complexity", "O(V) to store distance arrays, predecessor pointers, and heap elements."));

    const dijkstraCode = `Algorithm Dijkstra(Graph G, Source s, Target t):
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

    return ReconstructPath(prev, s, t)`;
    doc.push(code(dijkstraCode, "Dijkstra's Algorithm Pseudo-Code"));
    md += "```\n" + dijkstraCode + "\n```\n\n";

    // 6.3
    doc.push(h2("6.3 A* (A-Star) Heuristic Search Algorithm"));
    md += `## 6.3 A* (A-Star) Heuristic Search Algorithm\n\n`;

    doc.push(p("While Dijkstra's algorithm guarantees mathematical optimality, it searches isotropically—expanding outward in all radial directions like an expanding circular wavefront. This results in unnecessary node evaluations in directions opposite to the destination. The A* Search Algorithm resolves this inefficiency by incorporating domain-specific geometric knowledge in the form of a heuristic function.", { line: 280 }));

    doc.push(h3("6.3.1 Evaluation Function"));
    doc.push(p("A* evaluates vertices using a composite scoring function f(n):", { line: 260 }));
    doc.push(p("f(n) = g(n) + h(n)", { bold: true, align: AlignmentType.CENTER, size: 24, color: COLOR_SECONDARY }));
    doc.push(bullet("g(n)", "The exact accumulated distance cost from the starting vertex s to the current vertex n."));
    doc.push(bullet("h(n)", "The estimated heuristic distance cost from the current vertex n to the target destination t."));
    doc.push(bullet("f(n)", "The estimated total cost of the cheapest solution path traversing through vertex n."));

    doc.push(h3("6.3.2 Euclidean Distance Heuristic"));
    doc.push(p("Because our campus vertices are embedded in a 3D Euclidean spatial coordinate system, the heuristic function h(n) is chosen as the straight-line Euclidean distance ('as-the-crow-flies') between vertex n and destination t:", { line: 260 }));
    doc.push(p("h(n) = sqrt( (x_n - x_t)^2 + (y_n - y_t)^2 + (z_n - z_t)^2 )", { bold: true, align: AlignmentType.CENTER, color: COLOR_ACCENT }));

    doc.push(h3("6.3.3 Proof of Admissibility and Consistency"));
    doc.push(p("For A* to guarantee finding the mathematically optimal shortest path without backtracking over closed vertices, the heuristic function must satisfy two formal properties:", { line: 280 }));

    doc.push(p("Theorem 1 (Admissibility): A heuristic h(n) is admissible if it never overestimates the true cost to reach the goal: h(n) <= h*(n) for all n in V, where h*(n) is the true shortest path distance.", { italic: true, line: 260 }));
    doc.push(p("Proof: In physical Euclidean geometry, the straight line between any two spatial coordinates (x_n, y_n, z_n) and (x_t, y_t, z_t) is the shortest possible path through space. Any physical walking pathway following campus walkways must be greater than or equal to this straight line distance: w(path) >= h(n). Hence, h(n) <= h*(n) is strictly satisfied for all vertices. A* is therefore admissible and guaranteed to return the optimal shortest route. Q.E.D.", { line: 260 }));

    doc.push(p("Theorem 2 (Consistency / Monotonicity): A heuristic is consistent if for every vertex u and neighbor v connected by edge (u, v): h(u) <= c(u, v) + h(v), where c(u, v) is the edge cost.", { italic: true, line: 260 }));
    doc.push(p("Proof: By the geometric Triangle Inequality in Euclidean space, the straight-line distance from u to t cannot exceed the sum of the straight-line distance from u to v plus the straight-line distance from v to t: dist_euclidean(u, t) <= dist_euclidean(u, v) + dist_euclidean(v, t). Since the physical edge cost c(u, v) >= dist_euclidean(u, v), it directly follows that h(u) <= c(u, v) + h(v). Because h(n) is consistent, the f-values along any path are monotonically non-decreasing, guaranteeing that when a vertex is closed, its optimal path is finalized without reopening. Q.E.D.", { line: 260 }));

    doc.push(h3("6.3.4 Search Space Pruning Impact"));
    doc.push(p("By biasing the priority queue towards nodes whose geometric vector aligns with the destination, A* collapses Dijkstra's isotropic circular search wavefront into a narrow, targeted directional ellipse. In our empirical testing on the campus graph (Chapter 8), A* reduces the number of explored vertices by 68.2% compared to Dijkstra.", { line: 280 }));

    // 6.4
    doc.push(h2("6.4 Unweighted Search: Breadth-First Search & Depth-First Search"));
    md += `## 6.4 Unweighted Search: Breadth-First Search & Depth-First Search\n\n`;

    doc.push(bullet("Breadth-First Search (BFS)", "BFS explores the graph level-by-level utilizing a First-In-First-Out (FIFO) queue. In an unweighted graph where all edge costs are uniform (or when minimizing transit hop count), BFS is guaranteed to discover the shortest path in O(V + E) time. However, in our weighted campus graph, BFS frequently selects geographically longer routes because it treats a short 10-meter walkway and a long 150-meter road as equal 1-hop edges."));

    doc.push(bullet("Depth-First Search (DFS)", "DFS traverses deeply along each topological branch utilizing a Last-In-First-Out (LIFO) stack (or recursion) before backtracking. DFS executes in O(V + E) time and is vital for topological sorting, cycle detection, and verifying campus graph connectivity. However, DFS does not optimize path length and frequently produces highly tortuous, suboptimal routes."));

    // 6.5
    doc.push(h2("6.5 Dynamic Programming: Bellman-Ford & Floyd-Warshall"));
    md += `## 6.5 Dynamic Programming: Bellman-Ford & Floyd-Warshall\n\n`;

    doc.push(h3("6.5.1 Bellman-Ford Algorithm"));
    doc.push(p("The Bellman-Ford algorithm is a dynamic programming single-source shortest path algorithm capable of handling arbitrary edge weights. It operates on the recurrence relation:", { line: 260 }));
    doc.push(p("d^(k)[v] = min( d^(k-1)[v], min_{(u, v) in E} (d^(k-1)[u] + w(u, v)) )", { bold: true, align: AlignmentType.CENTER, color: COLOR_SECONDARY }));
    doc.push(p("Bellman-Ford relaxes all |E| edges |V|-1 times, yielding a time complexity of O(V * E). On our campus graph (36 vertices, 73 edges), this requires 35 * 73 = 2,555 edge evaluations. A 36th relaxation pass checks for negative cycles (reporting system errors if detected). While robust, its O(V * E) complexity makes it slower than Dijkstra's O((V + E) log V).", { line: 280 }));

    doc.push(h3("6.5.2 Floyd-Warshall All-Pairs Shortest Path Algorithm"));
    doc.push(p("The Floyd-Warshall algorithm uses dynamic programming to compute the shortest paths between all pairs of vertices in the campus graph simultaneously. It relies upon the recurrence:", { line: 260 }));
    doc.push(p("D^(k)[i][j] = min( D^(k-1)[i][j], D^(k-1)[i][k] + D^(k-1)[k][j] )", { bold: true, align: AlignmentType.CENTER, size: 22, color: COLOR_ACCENT }));
    doc.push(p("where D^(k)[i][j] represents the shortest path distance from vertex i to vertex j using only intermediate vertices from the set {0, 1, ..., k}. The algorithm executes three nested loops over all vertices, resulting in an exact time complexity of O(V^3) and spatial memory of O(V^2). Once this 36 x 36 matrix is precomputed upon server startup (taking ~2 milliseconds), any arbitrary point-to-point shortest path query can be answered in O(1) instantaneous lookup time.", { line: 280 }));

    // 6.6
    doc.push(h2("6.6 Traveling Salesperson Problem (TSP) for Multi-Stop Tours"));
    md += `## 6.6 Traveling Salesperson Problem (TSP) for Multi-Stop Tours\n\n`;

    doc.push(p("Campus visitors frequently wish to visit multiple locations (e.g., Administration -> Department -> Library -> Cafeteria -> Exit) in a single trip. Ordering these stops to minimize total walking distance is an instance of the NP-hard Traveling Salesperson Problem (TSP).", { line: 280 }));

    doc.push(h3("6.6.1 Held-Karp Dynamic Programming (Exact Solver for n <= 12)"));
    doc.push(p("For tours with up to 12 stops, the system implements the exact Held-Karp dynamic programming algorithm with integer bitmask state encoding:", { line: 260 }));
    doc.push(p("C(S, j) = min_{i in S, i != j} [ C(S \\ {j}, i) + dist(i, j) ]", { bold: true, align: AlignmentType.CENTER, color: COLOR_PRIMARY }));
    doc.push(p("where S is a subset of destinations represented as an integer bitmask, j in S is the terminal vertex of the tour, and dist(i, j) is the shortest path distance obtained from the Floyd-Warshall matrix. The time complexity is O(n^2 * 2^n), delivering guaranteed mathematical tour optimality in under 15 milliseconds for practical multi-stop campus tours.", { line: 280 }));

    doc.push(h3("6.6.2 2-Opt Local Search Heuristic (Fast Solver for n > 12)"));
    doc.push(p("For larger multi-stop itineraries, the system deploys a 2-Opt edge-swapping local search heuristic. It begins with a greedy nearest-neighbor tour and iteratively evaluates pairwise edge exchanges: if swapping edges (A, B) and (C, D) with (A, C) and (B, D) reduces the overall tour distance, the permutation is reversed. The algorithm terminates when no further 2-edge improvements exist, achieving near-optimal tours in O(n^2) time.", { line: 280 }));

    // 6.7
    doc.push(h2("6.7 Semantic Navigation: Compass Bearing & Turn-by-Turn Logic"));
    md += `## 6.7 Semantic Navigation: Compass Bearing & Turn-by-Turn Logic\n\n`;

    doc.push(p("Computing mathematical coordinate sequences is insufficient for human pedestrian navigation. The system translates raw 3D vectors into natural-language turn-by-turn guidance through trigonometric bearing analysis:", { line: 280 }));

    doc.push(bullet("1. Absolute Compass Heading Calculation", "For adjacent waypoints A(x1, z1) and B(x2, z2), the absolute compass heading theta is calculated using the four-quadrant inverse tangent:"));
    doc.push(p("theta = atan2( (x2 - x1), -(z2 - z1) ) * (180 / pi)", { bold: true, align: AlignmentType.CENTER, color: COLOR_ACCENT }));

    doc.push(bullet("2. Relative Angular Deflection", "The change in direction delta_theta at junction B when transitioning from segment AB to segment BC is computed by:"));
    doc.push(p("delta_theta = (theta_BC - theta_AB + 360) mod 360", { bold: true, align: AlignmentType.CENTER, color: COLOR_SECONDARY }));

    doc.push(bullet("3. Semantic Decision Boundaries", "The angular deflection is categorized into natural instructions:"));
    doc.push(subBullet("Continue Straight", "if -30 deg <= delta_theta <= 30 deg"));
    doc.push(subBullet("Turn Slight Right", "if 30 deg < delta_theta <= 60 deg"));
    doc.push(subBullet("Turn Right", "if 60 deg < delta_theta <= 120 deg"));
    doc.push(subBullet("Sharp Right", "if 120 deg < delta_theta <= 150 deg"));
    doc.push(subBullet("U-Turn", "if 150 deg < delta_theta <= 210 deg"));
    doc.push(subBullet("Sharp Left / Left / Slight Left", "Symmetric negative angle bounds [-150 deg, -30 deg]"));

    // 6.8
    doc.push(h2("6.8 Algorithmic Complexity and Trade-Off Master Matrix"));
    md += `## 6.8 Algorithmic Complexity and Trade-Off Master Matrix\n\n`;

    const masterAlgoData = [
        ["Algorithm", "Time Complexity", "Space Complexity", "Optimality Guarantee", "Heuristic Dependency", "Best Production Use Case"],
        ["Dijkstra", "O((V + E) log V)", "O(V)", "Guaranteed Shortest Path", "None (Uniform)", "Baseline shortest-path calculation; dense graphs."],
        ["A* Heuristic", "O((V + E) log V) worst; O(b^d) practical", "O(V)", "Guaranteed Shortest Path (Admissible)", "Euclidean 3D Distance", "Default interactive routing; 68% search space pruning."],
        ["BFS", "O(V + E)", "O(V)", "Optimal Hop Count Only", "None", "Unweighted topologies or minimum-transit routing."],
        ["DFS", "O(V + E)", "O(V)", "No Optimality Guarantee", "None", "Topological sorting, cycle detection, reachability."],
        ["Bellman-Ford", "O(V * E)", "O(V)", "Guaranteed Shortest Path", "None", "Graphs with dynamic cost penalties or negative cycles."],
        ["Floyd-Warshall", "O(V^3) precompute; O(1) query", "O(V^2)", "Guaranteed All-Pairs Shortest", "None", "Instant precomputed point-to-point queries."],
        ["Held-Karp TSP", "O(n^2 * 2^n)", "O(n * 2^n)", "Guaranteed Optimal Tour", "None (Bitmask DP)", "Multi-stop campus tours with n <= 12 destinations."],
        ["2-Opt TSP", "O(k * n^2)", "O(n)", "Near-Optimal (Local Optima)", "Greedy + Edge Swaps", "Fast multi-stop tour optimization for large itineraries."]
    ];

    doc.push(table(masterAlgoData[0], masterAlgoData.slice(1), [14, 18, 14, 18, 16, 20]));

    doc.push(pageBreak());
    return { doc, md };
}
