import { p, h1, h2, h3, bullet, subBullet, callout, table, pageBreak, Paragraph, TextRun, AlignmentType, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_ACCENT, COLOR_TEXT, COLOR_MUTED } from './helpers.js';
import * as docx from 'docx';
const { Break } = docx;

export function getFrontMatter() {
    const doc = [];
    let md = "";

    // Helper: paragraph of multiple lines (each line = one Paragraph)
    function lines(textLines, opts = {}) {
        return textLines.map(text => new Paragraph({
            alignment: opts.align || AlignmentType.CENTER,
            spacing: { before: opts.before || 40, after: opts.after || 60, line: 276 },
            children: [
                new TextRun({
                    text,
                    size: opts.size || 22,
                    bold: opts.bold || false,
                    italic: opts.italic || false,
                    color: opts.color || COLOR_TEXT,
                    font: opts.font || "Calibri"
                })
            ]
        }));
    }

    // ================================================================
    // COVER PAGE
    // ================================================================
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480, after: 120 }, children: [new TextRun({ text: "A PROJECT REPORT ON", size: 22, bold: true, color: COLOR_MUTED, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 120 }, children: [new TextRun({ text: "CAMPUS NAVIGATION SYSTEM", size: 44, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 300 }, children: [new TextRun({ text: "An Integrated Spatial Digital Twin & Algorithmic Graph Routing Engine", size: 24, italic: true, color: COLOR_ACCENT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 60 }, children: [new TextRun({ text: "Submitted in partial fulfillment of the requirements for the award of", size: 20, italic: true, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "BACHELOR OF TECHNOLOGY", size: 28, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "IN", size: 20, bold: true, color: COLOR_TEXT, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "COMPUTER SCIENCE AND ENGINEERING", size: 26, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 300 }, children: [new TextRun({ text: "(Specialization: Big Data Analytics)", size: 20, italic: true, color: COLOR_MUTED, font: "Calibri" })] }));

    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 60 }, children: [new TextRun({ text: "Submitted By:", size: 22, bold: true, color: COLOR_MUTED, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 60, after: 40 }, children: [new TextRun({ text: "KANISHK SINHA", size: 32, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "Student ID: AP25110080048", size: 22, bold: true, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 300 }, children: [new TextRun({ text: "Section: CSE BDA 'A'", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));

    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 40 }, children: [new TextRun({ text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING", size: 22, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 480 }, children: [new TextRun({ text: "ACADEMIC YEAR 2026 - 2027", size: 20, bold: true, color: COLOR_MUTED, font: "Calibri" })] }));

    doc.push(pageBreak());

    // ================================================================
    // CERTIFICATE
    // ================================================================
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 280 }, children: [new TextRun({ text: "BONAFIDE CERTIFICATE", size: 32, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));

    doc.push(p("This is to certify that the project report entitled \"CAMPUS NAVIGATION SYSTEM: An Integrated Spatial Digital Twin & Algorithmic Graph Routing Engine\" is the bonafide work carried out by KANISHK SINHA (Student ID: AP25110080048), a student of Bachelor of Technology in Computer Science and Engineering (Specialization: Big Data Analytics), Section CSE BDA 'A', during the academic year 2026-2027.", { line: 320 }));

    doc.push(p("This project report is submitted in partial fulfillment of the requirements for the evaluation of the Capstone Project course in the Department of Computer Science and Engineering. The work described in this report is original and has not been submitted previously for the award of any other degree, diploma, fellowship, or similar title at any other institution or university.", { line: 320 }));

    doc.push(new Paragraph({ spacing: { before: 500, after: 100 }, children: [new TextRun({ text: "Date: _________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ spacing: { before: 20, after: 500 }, children: [new TextRun({ text: "Place: ________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));

    doc.push(new Paragraph({ spacing: { before: 100, after: 40 }, children: [new TextRun({ text: "____________________________              ____________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "PROJECT SUPERVISOR / GUIDE              HEAD OF DEPARTMENT", size: 22, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ spacing: { before: 20, after: 300 }, children: [new TextRun({ text: "Dept. of Computer Science & Engineering              Dept. of Computer Science & Engineering", size: 20, color: COLOR_MUTED, font: "Calibri" })] }));

    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 40 }, children: [new TextRun({ text: "____________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "EXTERNAL EXAMINER", size: 22, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 300 }, children: [new TextRun({ text: "Board of Evaluators", size: 20, color: COLOR_MUTED, font: "Calibri" })] }));

    doc.push(pageBreak());

    // ================================================================
    // DECLARATION
    // ================================================================
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 280 }, children: [new TextRun({ text: "CANDIDATE'S DECLARATION", size: 32, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));

    doc.push(p("I, KANISHK SINHA (Student ID: AP25110080048), hereby declare that this project report entitled \"CAMPUS NAVIGATION SYSTEM\" is an authentic record of my own research and development work carried out as part of my Bachelor of Technology degree in Computer Science and Engineering (Big Data Analytics), Section CSE BDA 'A'.", { line: 320 }));

    doc.push(p("I confirm that the mathematical modeling, graph algorithmic implementations, 3D WebGL rendering pipeline, client-server architecture, and empirical benchmarking presented in this report represent my original work, under the guidance of my project supervisor. All secondary literature, algorithm specifications, software libraries, and data sources utilized throughout the project have been duly cited and referenced in accordance with standard academic ethics.", { line: 320 }));

    doc.push(p("I further declare that this report has not formed the basis for the award of any previous degree, diploma, associateship, or other similar academic recognition to the best of my knowledge.", { line: 320 }));

    doc.push(new Paragraph({ spacing: { before: 400, after: 100 }, children: [new TextRun({ text: "Date: _________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ spacing: { before: 20, after: 400 }, children: [new TextRun({ text: "Place: ________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));

    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 200, after: 40 }, children: [new TextRun({ text: "_____________________________________", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "KANISHK SINHA", size: 26, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "Student ID: AP25110080048", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 20, after: 20 }, children: [new TextRun({ text: "Section: CSE BDA 'A'", size: 22, color: COLOR_TEXT, font: "Calibri" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 20, after: 200 }, children: [new TextRun({ text: "Department of Computer Science & Engineering", size: 20, color: COLOR_MUTED, font: "Calibri" })] }));

    doc.push(pageBreak());

    // ================================================================
    // ACKNOWLEDGEMENT
    // ================================================================
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 280 }, children: [new TextRun({ text: "ACKNOWLEDGEMENT", size: 32, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));

    doc.push(p("The successful completion of this project, \"Campus Navigation System: An Integrated Spatial Digital Twin & Algorithmic Graph Routing Engine,\" has been made possible through the guidance, encouragement, and technical support of several individuals to whom I owe my deepest gratitude.", { line: 300 }));

    doc.push(p("First and foremost, I express my profound gratitude and sincere respect to my Project Supervisor and Guide, whose constant technical mentorship, intellectual critique, and constructive feedback guided me through every phase of this work from mathematical graph modeling and algorithm optimization to 3D spatial rendering.", { line: 300 }));

    doc.push(p("I extend my heartfelt thanks to the Head of the Department of Computer Science and Engineering, for providing the necessary infrastructural resources, laboratory facilities, and an encouraging academic environment that facilitated the smooth execution of this capstone project.", { line: 300 }));

    doc.push(p("I am also grateful to all the faculty members of the Computer Science and Engineering Department, particularly those in the Big Data Analytics specialization, whose courses in Data Structures and Algorithms, Computer Networks, and System Architecture provided the foundational principles implemented in this software system.", { line: 300 }));

    doc.push(p("Finally, I express my deepest appreciation to my parents, family members, and classmates for their unceasing moral support, patience, and encouragement throughout my academic journey.", { line: 300 }));

    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 400, after: 40 }, children: [new TextRun({ text: "KANISHK SINHA", size: 26, bold: true, color: COLOR_PRIMARY, font: "Arial" })] }));
    doc.push(new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 20, after: 200 }, children: [new TextRun({ text: "AP25110080048  |  CSE BDA 'A'", size: 22, color: COLOR_MUTED, font: "Calibri" })] }));

    doc.push(pageBreak());

    // ================================================================
    // ABSTRACT
    // ================================================================
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 280 }, children: [new TextRun({ text: "ABSTRACT", size: 32, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));

    doc.push(p("Modern university campuses resemble miniature cities spanning hundreds of acres with intricate pedestrian networks, courtyards, academic zoning, and architectural clusters. Navigating such environments poses severe spatial disorientation for newly admitted students, visiting faculty, event attendees, and delivery personnel. Conventional satellite-based global positioning systems (GPS) and commercial digital maps such as Google Maps systematically fail within internal campus perimeters due to satellite signal degradation near high-rise concrete structures and a structural absence of pedestrian-only walkways, interior courtyards, and emergency accessibility routes.", { line: 300 }));

    doc.push(p("To resolve this navigational deficit, this project introduces the Campus Navigation System, a high-performance, full-stack spatial digital twin coupled with a multi-algorithm graph routing engine. The campus geographical topology is rigorously formulated as an undirected, weighted mathematical graph G = (V, E, W), comprising 36 landmark vertices and 73 pedestrian pathway edges with accurate metric spatial coordinates. The system integrates six state-of-the-art graph pathfinding and traversal algorithms: Dijkstra's Single-Source Shortest Path, A* Heuristic Search using Euclidean evaluation, Breadth-First Search (BFS), Depth-First Search (DFS), Bellman-Ford with negative cycle detection, and the Floyd-Warshall All-Pairs Shortest Path dynamic programming matrix. Additionally, an exact dynamic programming solver based on the Held-Karp recurrence with bitmask memoization is implemented alongside a 2-Opt heuristic for the multi-stop Traveling Salesperson Problem (TSP).", { line: 300 }));

    doc.push(p("The client interface is constructed upon a high-performance WebGL rendering pipeline via Three.js, projecting a 2.5D interactive digital twin complete with procedural building extrusions, dynamic raycasting selection, real-time glowing path corridors, dynamic billboard badges, and an animated 3D pedestrian avatar featuring parametric linear interpolation and sine-wave walking kinematics.", { line: 300 }));

    doc.push(p("Empirical benchmarking validates the architecture: on a standard traversal between the Main Metro Gate (Node 0) and the Central Library (Node 16), A* search achieves a 68.2% reduction in search space (7 vertices explored versus 22 by Dijkstra) while computing optimal routes in 0.111 ms. Floyd-Warshall provides instant lookups under 0.045 ms, and the 3D rendering pipeline sustains 60 FPS on standard client hardware.", { line: 300 }));

    doc.push(p("Keywords: Campus Navigation, Spatial Digital Twin, Graph Algorithms, Dijkstra, A* Heuristic Search, Floyd-Warshall, Traveling Salesperson Problem, WebGL, Three.js, Turn-by-Turn Wayfinding.", { bold: true, color: COLOR_SECONDARY, before: 180 }));

    doc.push(pageBreak());

    // ================================================================
    // TABLE OF CONTENTS
    // ================================================================
    doc.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240, after: 280 }, children: [new TextRun({ text: "TABLE OF CONTENTS", size: 32, bold: true, color: COLOR_SECONDARY, font: "Arial" })] }));

    const tocEntries = [
        ["Certificate", "ii"],
        ["Candidate's Declaration", "iii"],
        ["Acknowledgement", "iv"],
        ["Abstract", "v"],
        ["List of Figures", "viii"],
        ["List of Tables", "ix"],
        ["1. INTRODUCTION", "1"],
        ["   1.1 Context and Evolution of Campus Wayfinding", "1"],
        ["   1.2 Limitations of Commercial Mapping in University Micro-Cities", "2"],
        ["   1.3 Foundations of Graph Theory in Navigation", "3"],
        ["   1.4 Project Motivation and Scope", "4"],
        ["   1.5 Report Organization", "5"],
        ["2. PROBLEM STATEMENT AND OBJECTIVES", "6"],
        ["   2.1 Problem Formulation", "6"],
        ["   2.2 Operational Challenges in Campus Navigation", "7"],
        ["   2.3 Proposed Solution: Spatial Digital Twin & Algorithmic Router", "8"],
        ["   2.4 Project Objectives (Engineering, Pedagogical, UX)", "9"],
        ["3. SYSTEM REQUIREMENTS SPECIFICATION", "10"],
        ["   3.1 Functional Requirements (FR-01 to FR-12)", "10"],
        ["   3.2 Non-Functional Requirements", "12"],
        ["   3.3 Hardware Specifications", "13"],
        ["   3.4 Software Specifications & Runtime Environments", "14"],
        ["4. SYSTEM ARCHITECTURE AND DESIGN", "15"],
        ["   4.1 Multi-Tier System Architecture", "15"],
        ["   4.2 Data Layer & Geographic Topology Schema", "16"],
        ["   4.3 Backend REST API Service Architecture", "17"],
        ["   4.4 In-Memory Graph Representation & Spatial Indexing", "18"],
        ["   4.5 Algorithmic Engine & Strategy Pattern", "19"],
        ["   4.6 3D Spatial Rendering Pipeline & Scene Graph", "20"],
        ["   4.7 Reactive Client State Management & HUD", "21"],
        ["5. TECHNOLOGIES AND DATA STRUCTURES", "22"],
        ["   5.1 Technology Stack Selection and Rationale", "22"],
        ["   5.2 Comparative Analysis of Graph Data Structures", "23"],
        ["   5.3 Priority Queue Architectures & Min-Heap Analysis", "24"],
        ["   5.4 Cache-Friendly All-Pairs Cost Matrices", "25"],
        ["   5.5 Bitmask State Spaces for Exponential Combinatorics", "26"],
        ["6. ALGORITHMS AND METHODOLOGY", "27"],
        ["   6.1 Mathematical Graph Formulation", "27"],
        ["   6.2 Dijkstra's Single-Source Shortest Path Algorithm", "28"],
        ["   6.3 A* Heuristic Search & Admissibility / Consistency Proofs", "30"],
        ["   6.4 Unweighted Search: BFS & DFS", "32"],
        ["   6.5 Dynamic Programming: Bellman-Ford & Floyd-Warshall", "34"],
        ["   6.6 Traveling Salesperson Problem via Held-Karp & 2-Opt", "36"],
        ["   6.7 Semantic Navigation: Compass Bearing & Turn-by-Turn Logic", "38"],
        ["   6.8 Algorithmic Complexity Master Matrix", "40"],
        ["7. SYSTEM IMPLEMENTATION", "41"],
        ["   7.1 Backend Microservice & REST Controllers", "41"],
        ["   7.2 Graph Model Implementation & Coordinate Math", "43"],
        ["   7.3 Solver Implementation: A* Search", "45"],
        ["   7.4 3D Procedural Meshing & Billboard Badge Generation", "47"],
        ["   7.5 Animated Pedestrian Avatar & Kinematics Engine", "49"],
        ["   7.6 UI Subsystems & Real-Time Metrics HUD", "51"],
        ["8. TESTING AND RESULTS", "52"],
        ["   8.1 Automated Test Harness & Verification Methodology", "52"],
        ["   8.2 Automated Test Suite Results (9/9 Passed)", "53"],
        ["   8.3 Empirical Performance Benchmarks", "55"],
        ["   8.4 3D Rendering Performance & GPU Profiling", "57"],
        ["   8.5 Visual Verification and Ground-Truth Alignment", "58"],
        ["9. LIMITATIONS AND FUTURE SCOPE", "60"],
        ["   9.1 Current System Limitations", "60"],
        ["   9.2 Future Enhancements", "61"],
        ["10. CONCLUSION", "63"],
        ["   10.1 Project Summary", "63"],
        ["   10.2 Academic and Pedagogical Contributions", "64"],
        ["   10.3 Final Concluding Remarks", "64"],
        ["REFERENCES", "65"]
    ];

    doc.push(table(["Section / Chapter Title", "Page"], tocEntries, [85, 15]));
    doc.push(pageBreak());

    md += `# CAMPUS NAVIGATION SYSTEM
## An Integrated Spatial Digital Twin & Algorithmic Graph Routing Engine
**Submitted by:** Kanishk Sinha | AP25110080048 | CSE BDA 'A'
`;

    return { doc, md };
}
