import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter1() {
    const doc = [];
    let md = "";

    doc.push(h1("CHAPTER 1: INTRODUCTION"));
    md += `# CHAPTER 1: INTRODUCTION\n\n`;

    // 1.1
    doc.push(h2("1.1 Context and Evolution of Campus Wayfinding"));
    md += `## 1.1 Context and Evolution of Campus Wayfinding\n\n`;

    doc.push(p("Navigating higher-education campuses and large institutional premises has historically presented a significant cognitive challenge. In decades past, institutions relied exclusively upon static informational infrastructure, including physical directional signage, printed parchment maps, and fixed metallic 'You Are Here' orientation kiosks strategically positioned at primary entrance gates. While these analog tools sufficed for low-density facilities with predictable foot-traffic, the exponential expansion of contemporary university infrastructure has rendered them fundamentally inadequate.", { line: 280 }));

    doc.push(p("Modern universities function as autonomous micro-cities. They span hundreds of contiguous acres and house complex multi-disciplinary faculties, high-density residential hostels, extensive library complexes, athletic arenas, administrative secretariats, and research parks. Over time, physical campus maps deteriorate due to weathering, suffer from rapid informational obsolescence following infrastructural remodels, and impose severe cognitive friction upon visitors who must mentally translate a static, two-dimensional schematic into a physical three-dimensional walking trajectory.", { line: 280 }));

    doc.push(p("The early 2000s witnessed the emergence of Geographic Information Systems (GIS) and digitized raster maps. However, early digital approaches merely transposed static 2D cartography onto personal computer screens without computational routing capabilities. The recent maturation of WebGL (Web Graphics Library), dynamic GPU-accelerated web rendering, and in-memory algorithmic graph theory has enabled a paradigm shift: the creation of real-time, interactive Spatial Digital Twins. A digital twin is a high-fidelity virtual representation of physical infrastructure synchronized with spatial topology, enabling real-time simulation, algorithmic path optimization, and interactive visual wayfinding directly inside standard web browsers without requiring proprietary client installations.", { line: 280 }));

    // 1.2
    doc.push(h2("1.2 Limitations of Commercial Mapping in University Micro-Cities"));
    md += `## 1.2 Limitations of Commercial Mapping in University Micro-Cities\n\n`;

    doc.push(p("A frequent assumption among non-technical observers is that pervasive commercial mapping suites—such as Google Maps, Apple Maps, or OpenStreetMap—obviate the need for proprietary campus navigation systems. In practice, however, these platforms exhibit severe structural, technical, and semantic failure modes when deployed within university perimeters:", { line: 280 }));

    doc.push(bullet("Satellite Signal Occlusion & Urban Canyons", "Commercial mapping platforms rely heavily upon Global Navigation Satellite Systems (GNSS) including GPS, GLONASS, and Galileo. Within dense university campuses, multi-story concrete academic blocks, covered colonnades, and heavy tree canopies create urban canyons that attenuate satellite radio frequency signals, inducing multipath errors and positional drift exceeding 15 to 30 meters. This drift renders automated turn-by-turn routing completely erratic."));

    doc.push(bullet("Absence of Pedestrian-Only Walkway Topology", "Commercial map datasets are fundamentally vehicular-centric. They prioritize asphalt roadways, highway networks, and motorable streets. Campus environments, conversely, are predominantly pedestrianized. Paved footpaths, internal quadrangles, pedestrian plazas, academic corridors, and lawn bypasses are either entirely missing or modeled as unconnected spatial dead-ends in global cartographic databases."));

    doc.push(bullet("Semantic Disconnect in Point-of-Interest (POI) Tagging", "Commercial mapping providers index public retail storefronts and street addresses. They lack the fine-grained semantic domain knowledge required by students and faculty—such as specific laboratory rooms, departmental seminar halls, student administration windows, or student welfare kiosks. Finding 'Room CS-104' or 'Fluid Mechanics Laboratory' within a generic building polygon is impossible via standard GPS platforms."));

    doc.push(bullet("Inflexibility Regarding Campus Policies and Closures", "University campuses regularly alter pedestrian accessibility due to ongoing construction, convocation ceremonies, security restrictions during examinations, or nocturnal gate closures. Commercial mapping providers lack real-time mechanisms for campus administrators to inject dynamic edge penalties or temporary topological barriers into the underlying routing graph."));

    // 1.3
    doc.push(h2("1.3 Foundations of Graph Theory in Navigation"));
    md += `## 1.3 Foundations of Graph Theory in Navigation\n\n`;

    doc.push(p("At its mathematical core, every automated wayfinding problem reduces to the traversal and path optimization of a graph data structure. In this project, the physical layout of the campus is formally modeled as a weighted, connected mathematical graph denoted by:", { line: 280 }));

    doc.push(p("G = (V, E, W)", { bold: true, align: AlignmentType.CENTER, size: 24, color: COLOR_SECONDARY }));

    doc.push(p("where:", { line: 260 }));
    doc.push(bullet("Vertex Set V", "Represents physical topological landmarks, intersections of walkways, building entrances, transit hubs, and points of interest across the campus. In our reference deployment, |V| = 36 discrete landmark nodes."));
    doc.push(bullet("Edge Set E", "Represents traversable pedestrian pathways, corridors, and paved walkways directly connecting adjacent vertices. In our topology, |E| = 73 bidirectional edges."));
    doc.push(bullet("Weight Function W: E -> R+", "Assigns a strictly positive scalar cost to each edge e = (u, v), representing the true Euclidean surface distance (or walking travel impedance) between the connected physical locations."));

    doc.push(p("By formulating the campus as a formal graph, classical and modern algorithmic paradigms in Design and Analysis of Algorithms (DAA)—including greedy edge relaxation, heuristic best-first search, dynamic programming, and combinatorial tour optimization—can be applied directly to solve spatial navigation queries with mathematical guarantees of optimality and predictable asymptotic time complexity.", { line: 280 }));

    // 1.4
    doc.push(h2("1.4 Project Motivation and Scope"));
    md += `## 1.4 Project Motivation and Scope\n\n`;

    doc.push(p("The primary motivation of this project is to develop an integrated, high-performance, and visually intuitive web-based Campus Navigation System that bridges theoretical computer science with modern interactive 3D spatial computing. Rather than treating pathfinding as an isolated command-line simulation or a trivial toy project, this system implements an end-to-end production software platform capable of computing optimal pedestrian routes in sub-millisecond execution times and rendering them in an interactive 3D spatial digital twin.", { line: 280 }));

    doc.push(p("The scope of this project encompasses:", { line: 260 }));
    doc.push(bullet("Comprehensive Graph Topology Modeling", "Constructing an accurate, high-fidelity spatial graph of the campus encompassing 36 key institutional landmarks, academic departments, hostels, administrative complexes, and gates, connected by 73 calibrated walkway edges."));
    doc.push(bullet("Multi-Algorithm Pathfinding Engine", "Implementing and comparing six distinct graph algorithms: Dijkstra's Algorithm, A* Heuristic Search, Breadth-First Search (BFS), Depth-First Search (DFS), Bellman-Ford Algorithm, and Floyd-Warshall All-Pairs Shortest Path algorithm, plus an exact dynamic programming Held-Karp solver with 2-Opt local search for multi-stop Traveling Salesperson (TSP) campus tours."));
    doc.push(bullet("High-Performance 3D WebGL Visualization", "Building a hardware-accelerated 2.5D/3D digital twin using Three.js, complete with procedural building extrusions, glowing route corridors, billboard landmark labels, dynamic camera framing, and an animated pedestrian avatar with parametric kinematics."));
    doc.push(bullet("Real-Time Turn-by-Turn Wayfinding", "Developing a semantic instruction engine that translates mathematical coordinate differentials into intuitive natural-language directions (e.g., 'Turn left toward Central Library and walk 45 meters')."));
    doc.push(bullet("Empirical Benchmarking & Validation", "Rigorously verifying algorithmic execution times, node expansion counts, memory footprints, and rendering frame rates to evaluate performance trade-offs under real-world conditions."));

    // 1.5
    doc.push(h2("1.5 Report Organization"));
    md += `## 1.5 Report Organization\n\n`;

    doc.push(p("The remainder of this report is organized into the following chapters:", { line: 280 }));
    doc.push(bullet("Chapter 2: Problem Statement & Objectives", "Formulates the specific navigation challenges of university campuses, operational hurdles, and details the project's engineering, pedagogical, and user experience objectives."));
    doc.push(bullet("Chapter 3: System Requirements Specification", "Enumerates functional requirements (FR-01 to FR-12), non-functional criteria (latency, frame rate, reliability), and outlines hardware/software deployment environments."));
    doc.push(bullet("Chapter 4: System Architecture & Design", "Presents the multi-tier client-server architecture, GeoJSON data schemas, Express REST microservice, in-memory graph abstractions, and WebGL rendering pipeline."));
    doc.push(bullet("Chapter 5: Technologies & Data Structures", "Justifies the technology stack (Node.js, Three.js, C++ reference core) and analyzes core data structures (Adjacency Lists vs. Matrices, Binary Min-Heaps, DP bitmasks)."));
    doc.push(bullet("Chapter 6: Algorithms and Methodology", "Provides formal mathematical derivations, invariance proofs, heuristic admissibility criteria, and asymptotic complexity analyses for all implemented routing algorithms."));
    doc.push(bullet("Chapter 7: System Implementation", "Analyzes actual source code snippets across backend endpoints, graph modeling, procedural 3D extrusion, avatar kinematics, and UI subsystems."));
    doc.push(bullet("Chapter 8: Testing and Results", "Documents the automated test harness (9/9 passing suites), empirical benchmarks (Dijkstra vs. A* 68% search space reduction), GPU profiling, and visual validation."));
    doc.push(bullet("Chapter 9: Limitations & Future Scope", "Critically discusses current system constraints and outlines future extensions including indoor multi-story routing, dynamic edge weights, and WebXR Augmented Reality."));
    doc.push(bullet("Chapter 10: Conclusion", "Summarizes project achievements, pedagogical contributions, and concluding remarks, followed by formal academic references."));

    doc.push(pageBreak());
    return { doc, md };
}
