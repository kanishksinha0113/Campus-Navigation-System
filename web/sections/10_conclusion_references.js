import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';

export function getChapter10AndReferences() {
    const doc = [];
    let md = "";

    // CHAPTER 10
    doc.push(h1("CHAPTER 10: CONCLUSION"));
    md += `# CHAPTER 10: CONCLUSION\n\n`;

    // 10.1
    doc.push(h2("10.1 Project Summary"));
    md += `## 10.1 Project Summary\n\n`;

    doc.push(p("This project has successfully designed, implemented, benchmarked, and verified the Campus Navigation System—an integrated spatial digital twin and algorithmic graph routing engine engineered to eliminate pedestrian wayfinding friction across large institutional campuses. Rather than treating graph algorithms as abstract academic exercises or relying upon ill-suited vehicular GPS mapping suites, this project establishes a complete, full-stack, production-ready software system.", { line: 280 }));

    doc.push(p("Key achievements realized throughout this work include:", { line: 280 }));

    doc.push(bullet("Mathematical Graph Formulation", "Successfully digitized and calibrated a comprehensive topological model of the campus comprising 36 landmark vertices and 73 pedestrian pathway edges with exact metric Euclidean coordinates."));

    doc.push(bullet("Extensible Algorithmic Routing Engine", "Engineered six distinct graph algorithms (Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall) and an exact Held-Karp dynamic programming TSP solver with 2-Opt local search for multi-stop campus tours."));

    doc.push(bullet("Empirical Validation of Heuristic Pruning", "Rigorously proven and demonstrated that the A* heuristic search achieves a 68.2% reduction in search space compared to Dijkstra's algorithm (expanding only 7 vertices vs. 22) while computing optimal routes in 0.111 milliseconds."));

    doc.push(bullet("GPU-Accelerated 3D WebGL Digital Twin", "Constructed a high-fidelity 2.5D/3D interactive spatial visualization using Three.js, complete with procedural building extrusions, glowing neon path corridors, dynamic billboard text badges, and a steady 60 FPS rendering pipeline."));

    doc.push(bullet("Kinematic Pedestrian Avatar & Semantic Guidance", "Integrated an animated 3D pedestrian avatar featuring parametric linear interpolation, directional yaw slerping, and harmonic walking kinematics, alongside a natural-language turn-by-turn guidance engine computing compass headings."));

    doc.push(bullet("Comprehensive Quality Assurance", "Achieved a 100% pass rate across nine automated headless regression test suites, verifying distance invariance, negative cycle absence, and spatial topological integrity."));

    // 10.2
    doc.push(h2("10.2 Academic and Pedagogical Contributions"));
    md += `## 10.2 Academic and Pedagogical Contributions\n\n`;

    doc.push(p("From a pedagogical perspective, the Campus Navigation System serves as an interactive, visual laboratory for Computer Science students and researchers studying Design and Analysis of Algorithms (DAA) and Computer Graphics. By exposing real-time algorithmic telemetry—such as execution duration, nodes expanded, and path metrics—directly within the 3D viewport, the system transforms theoretical algorithmic concepts into tangible, visual software mechanisms.", { line: 280 }));

    doc.push(p("Furthermore, this work demonstrates that sophisticated spatial digital twins can be developed entirely on open web standards (Node.js, Express, ES6+ JavaScript, WebGL) without locking institutions into proprietary geospatial platforms or requiring native app store installations.", { line: 280 }));

    // 10.3
    doc.push(h2("10.3 Final Concluding Remarks"));
    md += `## 10.3 Final Concluding Remarks\n\n`;

    doc.push(p("In conclusion, the Campus Navigation System bridges the historical divide between mathematical graph theory, modern systems engineering, and spatial computer graphics. The architecture provides an extensible, modular, and mathematically sound foundation capable of scaling to multi-story indoor wayfinding, real-time dynamic congestion updates, and Augmented Reality mobile navigation in future iterations.", { line: 280 }));

    doc.push(pageBreak());

    // REFERENCES
    doc.push(h1("REFERENCES"));
    md += `# REFERENCES\n\n`;

    const references = [
        ["1", "Dijkstra, E. W. (1959). A note on two problems in connexion with graphs. Numerische Mathematik, 1(1), 269–271. https://doi.org/10.1007/BF01386390"],
        ["2", "Hart, P. E., Nilsson, N. J., & Raphael, B. (1968). A formal basis for the heuristic determination of minimum cost paths. IEEE Transactions on Systems Science and Cybernetics, 4(2), 100–107. https://doi.org/10.1109/TSSC.1968.300136"],
        ["3", "Bellman, R. (1958). On a routing problem. Quarterly of Applied Mathematics, 16(1), 87–90. https://doi.org/10.1090/qam/102435"],
        ["4", "Floyd, R. W. (1962). Algorithm 97: Shortest path. Communications of the ACM, 5(6), 345. https://doi.org/10.1145/367766.368168"],
        ["5", "Held, M., & Karp, R. M. (1962). A dynamic programming approach to sequencing problems. Journal of the Society for Industrial and Applied Mathematics, 10(1), 196–210. https://doi.org/10.1137/0110015"],
        ["6", "Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). Introduction to Algorithms (4th ed.). MIT Press, Cambridge, MA."],
        ["7", "Cabello, R. (2023). Three.js: JavaScript 3D Library (Version r128+). Available online at: https://threejs.org"],
        ["8", "Cantelon, M., Harter, M., Holowaychuk, T., & Rajlich, N. (2014). Node.js in Action. Manning Publications, Shelter Island, NY."],
        ["9", "ISO/IEC 14882:2017. (2017). Information technology — Programming languages — C++ (C++17 Standard Specification). International Organization for Standardization, Geneva, Switzerland."],
        ["10", "Mozilla Developer Network (MDN). (2023). WebGL: 2D and 3D graphics for the web. Available online at: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API"],
        ["11", "Russell, S., & Norvig, P. (2020). Artificial Intelligence: A Modern Approach (4th ed.). Pearson, London, UK."],
        ["12", "Tarjan, R. E. (1983). Data Structures and Network Algorithms. Society for Industrial and Applied Mathematics (SIAM), Philadelphia, PA."]
    ];

    const refRows = references.map(([num, cit]) => [num, cit]);
    doc.push(table(["#", "Bibliographical Citation"], refRows, [10, 90]));

    return { doc, md };
}
