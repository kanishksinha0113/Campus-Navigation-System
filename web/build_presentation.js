import pptxgen from 'pptxgenjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Presentation with Modern 16:9 Widescreen (13.333" x 7.5")
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // Standard Modern PowerPoint 16:9 Widescreen: 13.333" x 7.5"
pres.author = 'Kanishk Sinha (AP25110080048)';
pres.company = 'CSE BDA A - College Classroom Presentation';
pres.title = 'Campus Navigation System';

// Professional Color Palette Definitions
const THEME = {
    bgDark: '0B132B',       // Deep Obsidian Navy
    bgCard: '1C2541',       // Elevated Card Navy
    bgCardSubtle: '152039', // Dark Accent Container
    borderSubtle: '2E3D60', // Subtle Slate Border
    borderAccent: '0284C7', // Electric Blue Border
    primaryCyan: '00F0FF',  // Bright Electric Cyan Accent
    accentBlue: '38BDF8',   // Light Sky Blue
    accentAmber: 'F59E0B',  // Amber / Orange Highlight
    accentGreen: '10B981',  // Emerald Green Success
    textWhite: 'FFFFFF',    // High-contrast Pure White
    textSlate: '94A3B8',    // Muted Subtitle Slate
    textLight: 'E2E8F0',    // Off-white Body Text
    codeBg: '0F172A'        // Deep Code/Telemetry Background
};

// Reusable Helper to Add Standard Slide Chrome (Header & Footer) with Safe Margins
function addSlideHeader(slide, category, title, subtitle) {
    // Top Category Pill / Breadcrumb
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 0.42, w: 3.6, h: 0.32,
        fill: { color: '0284C7', transparency: 85 },
        line: { color: '38BDF8', width: 1 },
        rectRadius: 0.1
    });
    slide.addText(category.toUpperCase(), {
        x: 0.85, y: 0.42, w: 3.6, h: 0.32,
        fontSize: 10, fontFace: 'Arial', bold: true,
        color: THEME.accentBlue, align: 'center', valign: 'middle'
    });

    // Main Slide Title
    slide.addText(title, {
        x: 0.85, y: 0.78, w: 10.5, h: 0.52,
        fontSize: 23, fontFace: 'Arial', bold: true,
        color: THEME.textWhite, valign: 'top'
    });

    // Slide Subtitle / Objective
    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.85, y: 1.32, w: 11.5, h: 0.35,
            fontSize: 11.5, fontFace: 'Calibri',
            color: THEME.textSlate, valign: 'top'
        });
    }

    // Bottom Decorative Rule (Width: 11.6, ending at 12.45)
    slide.addShape(pres.ShapeType.line, {
        x: 0.85, y: 6.82, w: 11.6, h: 0,
        line: { color: '1E293B', width: 1 }
    });

    // Bottom Footer Metadata
    slide.addText('Campus Navigation System  |  Kanishk Sinha (AP25110080048)  |  Section: CSE BDA \'A\'', {
        x: 0.85, y: 6.9, w: 8.5, h: 0.3,
        fontSize: 9.5, fontFace: 'Calibri',
        color: THEME.textSlate, valign: 'middle'
    });
}

function addSlideNumber(slide, currentNum) {
    slide.addText(`Slide ${currentNum} of 8`, {
        x: 10.45, y: 6.9, w: 2.0, h: 0.3,
        fontSize: 9.5, fontFace: 'Calibri', bold: true,
        color: THEME.accentBlue, align: 'right', valign: 'middle'
    });
}

// ==========================================
// SLIDE 1: TITLE SLIDE
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };

    // Decorative geometric container card (Width: 11.6, well within 13.333)
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 0.65, w: 11.6, h: 5.95,
        fill: { color: THEME.bgCard, transparency: 20 },
        line: { color: THEME.borderSubtle, width: 1.5 },
        rectRadius: 0.2
    });

    // Glowing Accent Top Bar
    slide.addShape(pres.ShapeType.rect, {
        x: 0.85, y: 0.65, w: 11.6, h: 0.08,
        fill: { color: THEME.primaryCyan },
        line: { color: THEME.primaryCyan, width: 0 }
    });

    // Academic Badge
    slide.addShape(pres.ShapeType.roundRect, {
        x: 1.3, y: 1.05, w: 4.6, h: 0.36,
        fill: { color: '0284C7', transparency: 80 },
        line: { color: '38BDF8', width: 1.2 },
        rectRadius: 0.15
    });
    slide.addText('CSE BDA CAPSTONE PROJECT DEFENSE', {
        x: 1.3, y: 1.05, w: 4.6, h: 0.36,
        fontSize: 10.5, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan, align: 'center', valign: 'middle'
    });

    // Main Presentation Title
    slide.addText('CAMPUS NAVIGATION SYSTEM', {
        x: 1.3, y: 1.5, w: 10.5, h: 0.85,
        fontSize: 36, fontFace: 'Arial', bold: true,
        color: THEME.textWhite, valign: 'middle'
    });

    // Subtitle
    slide.addText('An Integrated Spatial Digital Twin & Algorithmic Graph Routing Engine', {
        x: 1.3, y: 2.38, w: 10.5, h: 0.45,
        fontSize: 15, fontFace: 'Calibri',
        color: THEME.accentBlue, valign: 'top'
    });

    // Divider Line
    slide.addShape(pres.ShapeType.line, {
        x: 1.3, y: 2.92, w: 10.7, h: 0,
        line: { color: THEME.borderSubtle, width: 1.2 }
    });

    // Student Information Card (Left)
    slide.addShape(pres.ShapeType.roundRect, {
        x: 1.3, y: 3.18, w: 5.2, h: 3.1,
        fill: { color: THEME.bgCardSubtle },
        line: { color: THEME.borderAccent, width: 1 },
        rectRadius: 0.15
    });

    slide.addText('PRESENTER CREDENTIALS', {
        x: 1.55, y: 3.35, w: 4.7, h: 0.3,
        fontSize: 11, fontFace: 'Arial', bold: true,
        color: THEME.accentAmber
    });

    const studentInfo = [
        { text: 'Student Name: ', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
        { text: 'Kanishk Sinha\n', options: { color: THEME.primaryCyan, fontSize: 12.5, bold: true } },
        { text: 'Student ID: ', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
        { text: 'AP25110080048\n', options: { color: THEME.textLight, fontSize: 12.5 } },
        { text: 'Section: ', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
        { text: 'CSE BDA \'A\'\n', options: { color: THEME.textLight, fontSize: 12.5 } },
        { text: 'Department: ', options: { bold: true, color: THEME.textWhite, fontSize: 12.5 } },
        { text: 'Computer Science & Engineering', options: { color: THEME.textLight, fontSize: 12.5 } }
    ];
    slide.addText(studentInfo, {
        x: 1.55, y: 3.75, w: 4.7, h: 2.3,
        fontFace: 'Calibri', lineSpacing: 20, valign: 'top'
    });

    // Key Highlights / Scope Card (Right - Ends at 12.0", perfectly inside 13.333")
    slide.addShape(pres.ShapeType.roundRect, {
        x: 6.8, y: 3.18, w: 5.2, h: 3.1,
        fill: { color: THEME.bgCardSubtle },
        line: { color: THEME.borderSubtle, width: 1 },
        rectRadius: 0.15
    });

    slide.addText('SYSTEM HIGHLIGHTS', {
        x: 7.05, y: 3.35, w: 4.7, h: 0.3,
        fontSize: 11, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan
    });

    const highlights = [
        { text: '• Full-Stack Architecture: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Integrated client-server model\n', options: { color: THEME.textSlate } },
        { text: '• Graph-Based Topology: ', options: { bold: true, color: THEME.textWhite } },
        { text: '36 landmark nodes, 73 road corridors\n', options: { color: THEME.textSlate } },
        { text: '• DAA Core: ', options: { bold: true, color: THEME.textWhite } },
        { text: '6 verified pathfinding algorithms + TSP\n', options: { color: THEME.textSlate } },
        { text: '• Sub-Millisecond Speed: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Instant client-side route solving (<0.5 ms)', options: { color: THEME.textSlate } }
    ];
    slide.addText(highlights, {
        x: 7.05, y: 3.75, w: 4.7, h: 2.3,
        fontSize: 11.5, fontFace: 'Calibri', lineSpacing: 20, valign: 'top'
    });

    addSlideNumber(slide, 1);
}

// ==========================================
// SLIDE 2: INTRODUCTION & PROBLEM STATEMENT
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'Project Context', 'Introduction and Problem Statement', 'Why university campuses require a specialized spatial navigation software system');

    // Left Card: The Problem Space
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 1.75, w: 5.65, h: 4.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderSubtle, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addShape(pres.ShapeType.roundRect, {
        x: 1.1, y: 1.95, w: 2.8, h: 0.32,
        fill: { color: 'EF4444', transparency: 85 },
        line: { color: 'F87171', width: 1 },
        rectRadius: 0.1
    });
    slide.addText('CHALLENGES & BOTTLENECK', {
        x: 1.1, y: 1.95, w: 2.8, h: 0.32,
        fontSize: 9.5, fontFace: 'Arial', bold: true,
        color: 'FCA5A5', align: 'center', valign: 'middle'
    });

    slide.addText('Problems Faced in Large Campuses', {
        x: 1.1, y: 2.38, w: 5.15, h: 0.38,
        fontSize: 16, fontFace: 'Arial', bold: true,
        color: THEME.textWhite
    });

    const problemsList = [
        { text: '• Sprawling Multi-Acre Environment: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Large campuses encompass academic blocks, hostels, sports complexes, and medical facilities spread across vast areas.\n\n', options: { color: THEME.textSlate } },
        { text: '• Commercial Map Deficiencies: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Commercial navigation tools (like Google Maps) primarily index motorable roads and miss intricate pedestrian walkways, internal alleys, and building gates.\n\n', options: { color: THEME.textSlate } },
        { text: '• High Disorientation Rate: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'New students, visiting faculty, parents, and event attendees regularly take inefficient detours and arrive late to classes and exams.\n\n', options: { color: THEME.textSlate } },
        { text: '• Lack of Multi-Stop Itinerary Logic: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'No standard tool computes optimal multi-stop schedules (e.g. Hostel -> Library -> Academic Block -> ATM) efficiently.', options: { color: THEME.textSlate } }
    ];
    slide.addText(problemsList, {
        x: 1.1, y: 2.85, w: 5.15, h: 3.6,
        fontSize: 11, fontFace: 'Calibri', lineSpacing: 15, valign: 'top'
    });

    // Right Card: Proposed Solution (Ends at 12.45", perfectly inside 13.333")
    slide.addShape(pres.ShapeType.roundRect, {
        x: 6.8, y: 1.75, w: 5.65, h: 4.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderAccent, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addShape(pres.ShapeType.roundRect, {
        x: 7.05, y: 1.95, w: 2.8, h: 0.32,
        fill: { color: '10B981', transparency: 85 },
        line: { color: '34D399', width: 1 },
        rectRadius: 0.1
    });
    slide.addText('PROPOSED SYSTEM SOLUTION', {
        x: 7.05, y: 1.95, w: 2.8, h: 0.32,
        fontSize: 9.5, fontFace: 'Arial', bold: true,
        color: 'A7F3D0', align: 'center', valign: 'middle'
    });

    slide.addText('Integrated CampusNav3D Platform', {
        x: 7.05, y: 2.38, w: 5.15, h: 0.38,
        fontSize: 16, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan
    });

    const solutionList = [
        { text: '• Dedicated Topological Graph Engine: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Converts official campus cartography into a weighted mathematical graph with 36 localized nodes and 73 pedestrian corridors.\n\n', options: { color: THEME.textSlate } },
        { text: '• Strategy-Based Algorithm Core: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Implements 6 verified pathfinding algorithms (Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall) and TSP solvers.\n\n', options: { color: THEME.textSlate } },
        { text: '• Zero-Latency Client Pathfinding: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Executes routing client-side in <0.5 ms, eliminating network lag and supporting offline field usage.\n\n', options: { color: THEME.textSlate } },
        { text: '• Human-Readable Turn Guidance: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Provides real-time metric distances, walking/cycling ETAs, calorie estimates, and animated route visualization.', options: { color: THEME.textSlate } }
    ];
    slide.addText(solutionList, {
        x: 7.05, y: 2.85, w: 5.15, h: 3.6,
        fontSize: 11, fontFace: 'Calibri', lineSpacing: 15, valign: 'top'
    });

    addSlideNumber(slide, 2);
}

// ==========================================
// SLIDE 3: SYSTEM ARCHITECTURE
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'System Design', 'System Architecture & Data Flow', 'End-to-end multi-tier pipeline: from spatial data ingestion to client-side path calculation');

    // 4 Architecture Flow Blocks (Horizontal Sequence)
    const blocks = [
        {
            title: '1. Data Model Layer',
            badge: 'GEO-JSON REPOSITORY',
            badgeColor: '0284C7',
            items: [
                '• campus_nodes.json: 36 vertices with X, Y, Z coords and categories',
                '• campus_edges.json: 73 bidirectional road corridors with weights',
                '• Ground-truth digitization from official IIT Delhi master map'
            ]
        },
        {
            title: '2. Backend Service Layer',
            badge: 'NODE.JS SERVER',
            badgeColor: '10B981',
            items: [
                '• Lightweight native HTTP server (server.js) on port 3000',
                '• Endpoints: GET /api/health, GET /data/campus_nodes.json, /edges',
                '• Zero external runtime dependencies; serves static assets & data'
            ]
        },
        {
            title: '3. Core Algorithm Engine',
            badge: 'STRATEGY PATTERN',
            badgeColor: 'F59E0B',
            items: [
                '• Pluggable IPathfinder strategy interface for hot-swapping engines',
                '• Dijkstra, A*, BFS, DFS, Bellman-Ford, Floyd-Warshall',
                '• Multi-stop TSP engine (Held-Karp Bitmask DP + 2-Opt heuristic)'
            ]
        },
        {
            title: '4. Client & Visualization',
            badge: 'SPATIAL RUNTIME',
            badgeColor: '8B5CF6',
            items: [
                '• Reactive state store (State.js) & Navigation HUD search/autocomplete',
                '• Turn-by-Turn guidance engine with compass bearing calculation',
                '• Real-time kinematic avatar traversal & live algorithm benchmark telemetry'
            ]
        }
    ];

    const startX = 0.85;
    const colW = 2.7;
    const gap = 0.23;

    blocks.forEach((b, idx) => {
        const xPos = startX + idx * (colW + gap);

        // Container Card
        slide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 1.75, w: colW, h: 4.15,
            fill: { color: THEME.bgCard },
            line: { color: THEME.borderSubtle, width: 1.2 },
            rectRadius: 0.12
        });

        // Step Badge
        slide.addShape(pres.ShapeType.roundRect, {
            x: xPos + 0.12, y: 1.95, w: colW - 0.24, h: 0.28,
            fill: { color: b.badgeColor, transparency: 85 },
            line: { color: b.badgeColor, width: 1 },
            rectRadius: 0.08
        });
        slide.addText(b.badge, {
            x: xPos + 0.12, y: 1.95, w: colW - 0.24, h: 0.28,
            fontSize: 9, fontFace: 'Arial', bold: true,
            color: THEME.textWhite, align: 'center', valign: 'middle'
        });

        // Block Title
        slide.addText(b.title, {
            x: xPos + 0.12, y: 2.32, w: colW - 0.24, h: 0.42,
            fontSize: 13.5, fontFace: 'Arial', bold: true,
            color: THEME.primaryCyan, valign: 'middle'
        });

        // Content
        const textArr = b.items.map(item => ({
            text: item + '\n\n',
            options: { fontSize: 10, fontFace: 'Calibri', color: THEME.textLight }
        }));
        slide.addText(textArr, {
            x: xPos + 0.12, y: 2.85, w: colW - 0.24, h: 2.9,
            lineSpacing: 13, valign: 'top'
        });

        // Connecting Arrow (except last)
        if (idx < 3) {
            slide.addShape(pres.ShapeType.rightArrow, {
                x: xPos + colW + 0.04, y: 3.65, w: 0.15, h: 0.2,
                fill: { color: THEME.primaryCyan },
                line: { color: THEME.primaryCyan, width: 0 }
            });
        }
    });

    // Bottom Architecture Summary Bar
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 6.05, w: 11.6, h: 0.62,
        fill: { color: THEME.bgCardSubtle },
        line: { color: THEME.borderAccent, width: 1 },
        rectRadius: 0.1
    });
    slide.addText('Key Architectural Takeaway: Algorithms operate entirely on mathematical graph interfaces decoupled from the UI. Running route calculation client-side guarantees sub-millisecond solving (<0.5 ms) and zero network latency during routing.', {
        x: 1.05, y: 6.05, w: 11.2, h: 0.62,
        fontSize: 10.5, fontFace: 'Calibri', italic: true,
        color: THEME.textLight, valign: 'middle'
    });

    addSlideNumber(slide, 3);
}

// ==========================================
// SLIDE 4: TECH STACK & DATA STRUCTURES
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'Technical Foundations', 'Technology Stack & Data Structures', 'Integrated software stack and core data structures managing campus cartography');

    // Left Column: Tech Stack (Mentions C++ ONCE here!)
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 1.75, w: 5.65, h: 4.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderSubtle, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('INTEGRATED TECHNOLOGY STACK', {
        x: 1.1, y: 1.95, w: 5.15, h: 0.32,
        fontSize: 12.5, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan
    });

    const techItems = [
        {
            title: 'Backend Service & Data Layer:',
            desc: 'Node.js runtime hosting a native REST HTTP server for spatial JSON distribution (/api/health, /data/campus_nodes.json, /data/campus_edges.json).'
        },
        {
            title: 'Client Runtime & Graph Core:',
            desc: 'Modern JavaScript (ES6+ Modules) implementing decoupled pathfinding engines, reactive event-driven state store, and turn-by-turn instruction generator.'
        },
        {
            title: '3D Spatial Engine & Graphics:',
            desc: 'WebGL with Three.js for procedural architectural building volumes, road ribbons, directional lighting, and animated avatar traversal.'
        },
        {
            title: 'High-Performance Native Core:',
            desc: 'C++17 engine with CMake build system and Catch2 test suite maintained as an alternate desktop baseline for algorithmic verification.' // C++ mentioned once!
        }
    ];

    let curY = 2.4;
    techItems.forEach(t => {
        slide.addText([
            { text: t.title + '\n', options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
            { text: t.desc, options: { color: THEME.textSlate, fontSize: 10 } }
        ], {
            x: 1.1, y: curY, w: 5.15, h: 0.95,
            fontFace: 'Calibri', lineSpacing: 13, valign: 'top'
        });
        curY += 1.0;
    });

    // Right Column: Data Structures
    slide.addShape(pres.ShapeType.roundRect, {
        x: 6.8, y: 1.75, w: 5.65, h: 4.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderSubtle, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('CORE DATA STRUCTURES & REPRESENTATION', {
        x: 7.05, y: 1.95, w: 5.15, h: 0.32,
        fontSize: 12.5, fontFace: 'Arial', bold: true,
        color: THEME.accentAmber
    });

    const dsItems = [
        {
            title: '1. Adjacency List (Graph Topology):',
            desc: 'Stored as Map<number, Array<Edge>>. Captures the undirected weighted graph G=(V, E) in O(V + E) memory space, supporting O(1) neighbor lookups.'
        },
        {
            title: '2. Binary Min-Heap (Priority Queue):',
            desc: 'Backs Dijkstra and A* pathfinders to efficiently extract the minimum tentative cost vertex in O(log V) time rather than O(V).'
        },
        {
            title: '3. 2D Cost Lookup Matrix (All-Pairs):',
            desc: 'An O(V^2) precomputed matrix storing all-pairs shortest paths computed by Floyd-Warshall at startup, enabling O(1) instantaneous lookups.'
        },
        {
            title: '4. Dynamic Programming Bitmasks:',
            desc: 'Compact integer bit representations used in Held-Karp TSP to track visited waypoint subsets in O(1) space during multi-stop tour optimization.'
        }
    ];

    curY = 2.4;
    dsItems.forEach(d => {
        slide.addText([
            { text: d.title + '\n', options: { bold: true, color: THEME.textWhite, fontSize: 11 } },
            { text: d.desc, options: { color: THEME.textSlate, fontSize: 10 } }
        ], {
            x: 7.05, y: curY, w: 5.15, h: 0.95,
            fontFace: 'Calibri', lineSpacing: 13, valign: 'top'
        });
        curY += 1.0;
    });

    addSlideNumber(slide, 4);
}

// ==========================================
// SLIDE 5: ALGORITHMS & CORE LOGIC
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'Design & Analysis of Algorithms', 'Algorithms and Core Pathfinding Logic', 'Comparative analysis of 6 graph algorithms and empirical benchmark results on campus data');

    // 4 Top Algorithm Cards
    const algos = [
        {
            name: 'Dijkstra\'s Algorithm',
            type: 'Greedy + Min-Heap',
            time: 'O((V + E) log V)',
            role: 'Standard optimal shortest path on non-negative weights; expands uniformly outward in all directions.'
        },
        {
            name: 'A* Heuristic Search',
            type: 'Greedy + Euclidean',
            time: 'O((V + E) log V)',
            role: 'Goal-directed point-to-point routing using Euclidean distance heuristic; dramatically prunes search space.'
        },
        {
            name: 'Floyd-Warshall',
            type: 'All-Pairs DP',
            time: 'O(V^3) precompute',
            role: 'Computes complete campus all-pairs distance matrix at startup; yields instant O(1) repeat query lookups.'
        },
        {
            name: 'Held-Karp & 2-Opt TSP',
            type: 'DP Bitmask / Local',
            time: 'O(n^2 2^n) / O(n^2)',
            role: 'Solves multi-stop waypoint itineraries exactly for n<=12 via bitmask DP; fast 2-Opt heuristic for larger tours.'
        }
    ];

    const startX = 0.85;
    const colW = 2.7;
    const gap = 0.23;

    algos.forEach((a, idx) => {
        const xPos = startX + idx * (colW + gap);
        slide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 1.75, w: colW, h: 2.3,
            fill: { color: THEME.bgCard },
            line: { color: THEME.borderSubtle, width: 1.2 },
            rectRadius: 0.12
        });

        slide.addText(a.name, {
            x: xPos + 0.12, y: 1.85, w: colW - 0.24, h: 0.32,
            fontSize: 12, fontFace: 'Arial', bold: true,
            color: THEME.primaryCyan, valign: 'middle'
        });

        slide.addText(`Technique: ${a.type}\nComplexity: ${a.time}`, {
            x: xPos + 0.12, y: 2.2, w: colW - 0.24, h: 0.42,
            fontSize: 9.5, fontFace: 'Calibri', bold: true,
            color: THEME.accentAmber
        });

        slide.addText(a.role, {
            x: xPos + 0.12, y: 2.65, w: colW - 0.24, h: 1.3,
            fontSize: 9.5, fontFace: 'Calibri',
            color: THEME.textLight, lineSpacing: 13, valign: 'top'
        });
    });

    // Bottom Section: Visual Example & Live Empirical Comparison Table
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 4.25, w: 11.6, h: 2.35,
        fill: { color: THEME.bgCardSubtle },
        line: { color: THEME.borderAccent, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('EMPIRICAL BENCHMARK: DIJKSTRA VS. A* (QUERY: DELHI METRO WEST -> LIBRARY)', {
        x: 1.05, y: 4.35, w: 11.2, h: 0.28,
        fontSize: 10.5, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan
    });

    // Table Header & Rows
    const tableData = [
        [
            { text: 'Algorithm', options: { bold: true, fill: '1E293B', color: THEME.textWhite, fontSize: 10 } },
            { text: 'Design Strategy', options: { bold: true, fill: '1E293B', color: THEME.textWhite, fontSize: 10 } },
            { text: 'Nodes Expanded', options: { bold: true, fill: '1E293B', color: THEME.textWhite, fontSize: 10 } },
            { text: 'Path Distance', options: { bold: true, fill: '1E293B', color: THEME.textWhite, fontSize: 10 } },
            { text: 'Measured Time', options: { bold: true, fill: '1E293B', color: THEME.textWhite, fontSize: 10 } },
            { text: 'Key Practical DAA Insight', options: { bold: true, fill: '1E293B', color: THEME.textWhite, fontSize: 10 } }
        ],
        [
            { text: 'Dijkstra', options: { bold: true, color: THEME.textWhite } },
            { text: 'Greedy (Uniform)', options: { color: THEME.textLight } },
            { text: '22 nodes', options: { color: 'F87171', bold: true } },
            { text: '63.1 m (Optimal)', options: { color: THEME.accentGreen, bold: true } },
            { text: '0.490 ms', options: { color: THEME.textLight } },
            { text: 'Explores radially in all directions like an expanding ripple.', options: { color: THEME.textSlate } }
        ],
        [
            { text: 'A* (Euclidean)', options: { bold: true, color: THEME.primaryCyan } },
            { text: 'Heuristic Search', options: { color: THEME.textLight } },
            { text: '7 nodes (-68%)', options: { color: THEME.primaryCyan, bold: true } },
            { text: '63.1 m (Optimal)', options: { color: THEME.accentGreen, bold: true } },
            { text: '0.111 ms', options: { color: THEME.accentGreen, bold: true } },
            { text: 'Directs search towards goal; cuts explored state space by 68%!', options: { color: THEME.accentGreen } }
        ],
        [
            { text: 'Floyd-Warshall', options: { bold: true, color: THEME.accentAmber } },
            { text: 'Dynamic Prog.', options: { color: THEME.textLight } },
            { text: 'Precomputed', options: { color: THEME.textLight } },
            { text: '63.1 m (Optimal)', options: { color: THEME.accentGreen, bold: true } },
            { text: '<0.050 ms', options: { color: THEME.accentGreen, bold: true } },
            { text: 'Instant O(1) table lookup once startup matrix is computed.', options: { color: THEME.textSlate } }
        ]
    ];

    slide.addTable(tableData, {
        x: 1.05, y: 4.7, w: 11.2, h: 1.75,
        fontSize: 9.5, fontFace: 'Calibri',
        colW: [1.6, 1.8, 1.6, 1.6, 1.4, 3.2],
        border: { pt: 0.5, color: THEME.borderSubtle }
    });

    addSlideNumber(slide, 5);
}

// ==========================================
// SLIDE 6: SYSTEM WORKFLOW
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'Operational Flow', 'System Navigation Workflow', 'Step-by-step route request lifecycle from user input to animated trajectory execution');

    // 5-Stage Step Flow Cards
    const steps = [
        {
            num: 'STAGE 1',
            title: 'Query Selection',
            desc: 'User selects Departure and Destination via:\n• Search bar autocomplete\n• Places Directory drawer (36 POIs)\n• Direct 3D raycaster map clicks'
        },
        {
            num: 'STAGE 2',
            title: 'Validation & Dispatch',
            desc: 'Reactive State Store validates inputs:\n• Verifies vertex IDs in graph\n• Checks component connectivity\n• Dispatches solve event to engine'
        },
        {
            num: 'STAGE 3',
            title: 'Algorithm Execution',
            desc: 'Pathfinder engine computes optimal route:\n• Traverses in-memory Adjacency List\n• Logs node visit order & frontier size\n• Returns PathResult in <0.5 ms'
        },
        {
            num: 'STAGE 4',
            title: 'Guidance Synthesis',
            desc: 'Turn-by-turn guidance engine generates:\n• Exact path distance in meters\n• Compass bearings (N, NE, SE...)\n• Walking ETA, bike ETA, step counts'
        },
        {
            num: 'STAGE 5',
            title: 'Visual Execution',
            desc: '3D spatial scene renders the result:\n• Highlights active road ribbon\n• Avatar walks route at 24 units/sec\n• Smooth corner easing & camera track'
        }
    ];

    const startX = 0.85;
    const colW = 2.14;
    const gap = 0.22;

    steps.forEach((s, idx) => {
        const xPos = startX + idx * (colW + gap);
        slide.addShape(pres.ShapeType.roundRect, {
            x: xPos, y: 1.75, w: colW, h: 3.45,
            fill: { color: THEME.bgCard },
            line: { color: THEME.borderSubtle, width: 1.2 },
            rectRadius: 0.12
        });

        // Stage Pill
        slide.addShape(pres.ShapeType.roundRect, {
            x: xPos + 0.12, y: 1.95, w: colW - 0.24, h: 0.26,
            fill: { color: '0284C7', transparency: 85 },
            line: { color: '38BDF8', width: 1 },
            rectRadius: 0.08
        });
        slide.addText(s.num, {
            x: xPos + 0.12, y: 1.95, w: colW - 0.24, h: 0.26,
            fontSize: 8.5, fontFace: 'Arial', bold: true,
            color: THEME.primaryCyan, align: 'center', valign: 'middle'
        });

        slide.addText(s.title, {
            x: xPos + 0.12, y: 2.32, w: colW - 0.24, h: 0.42,
            fontSize: 12.5, fontFace: 'Arial', bold: true,
            color: THEME.textWhite, valign: 'middle'
        });

        slide.addText(s.desc, {
            x: xPos + 0.12, y: 2.82, w: colW - 0.24, h: 2.25,
            fontSize: 9.5, fontFace: 'Calibri',
            color: THEME.textLight, lineSpacing: 13, valign: 'top'
        });

        // Down/Right Arrow for Flow
        if (idx < 4) {
            slide.addShape(pres.ShapeType.rightArrow, {
                x: xPos + colW + 0.04, y: 3.2, w: 0.14, h: 0.2,
                fill: { color: THEME.primaryCyan },
                line: { color: THEME.primaryCyan, width: 0 }
            });
        }
    });

    // Bottom Detailed Explanation Box: Mathematical Kinematic Motion
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 5.35, w: 11.6, h: 1.35,
        fill: { color: THEME.bgCardSubtle },
        line: { color: THEME.borderAccent, width: 1.2 },
        rectRadius: 0.12
    });

    slide.addText('HOW THE 3D AVATAR TRAVERSES THE GRAPH NETWORK (CONTINUOUS KINEMATIC TRAJECTORY):', {
        x: 1.05, y: 5.45, w: 11.2, h: 0.25,
        fontSize: 10, fontFace: 'Arial', bold: true,
        color: THEME.accentAmber
    });

    const locomotionDetails = [
        { text: '1. Discrete Path to Road Spline: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'The discrete path node list [v0, v1, ..., vk] is mapped into continuous 3D world coordinates.\n', options: { color: THEME.textSlate } },
        { text: '2. Parametric Lerp Motion: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Position interpolates along segment (p_i -> p_i+1) via p(t) = (1-t)p_i + t*p_i+1 at a calibrated walking speed of 24 units/sec.\n', options: { color: THEME.textSlate } },
        { text: '3. Smooth Turning & Kinematics: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Body heading angle smoothly interpolates toward atan2(dx, dz) while procedural sine-wave arm/leg swings simulate natural human walking.', options: { color: THEME.textSlate } }
    ];
    slide.addText(locomotionDetails, {
        x: 1.05, y: 5.75, w: 11.2, h: 0.85,
        fontSize: 9.8, fontFace: 'Calibri', lineSpacing: 13, valign: 'top'
    });

    addSlideNumber(slide, 6);
}

// ==========================================
// SLIDE 7: IMPLEMENTATION AND RESULTS
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'System Demonstration', 'Implementation and Experimental Results', 'Live system execution, actual 3D navigation interface, and verified backend benchmark outputs');

    const screenshotPath = path.join(__dirname, '..', 'screenshot_3d_nav.png');

    // Left Side: Actual Screenshot Showcase
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 1.75, w: 6.1, h: 4.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderAccent, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('ACTUAL PROJECT EXECUTION SCREENSHOT', {
        x: 1.05, y: 1.9, w: 5.7, h: 0.28,
        fontSize: 10.5, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan
    });

    // Embed Screenshot Image
    slide.addImage({
        path: screenshotPath,
        x: 1.05, y: 2.25, w: 5.7, h: 3.7
    });

    slide.addText('3D scene displaying extruded campus landmarks, active path corridor, permanent floating badges, and live telemetry.', {
        x: 1.05, y: 6.05, w: 5.7, h: 0.45,
        fontSize: 9, fontFace: 'Calibri', italic: true,
        color: THEME.textSlate, align: 'center', valign: 'middle'
    });

    // Right Side: Verified Backend & Algorithmic Outputs (Ends at 12.45")
    slide.addShape(pres.ShapeType.roundRect, {
        x: 7.2, y: 1.75, w: 5.25, h: 4.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderSubtle, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('SYSTEM RESULTS & BENCHMARK METRICS', {
        x: 7.45, y: 1.9, w: 4.75, h: 0.28,
        fontSize: 10.5, fontFace: 'Arial', bold: true,
        color: THEME.accentAmber
    });

    const metricCards = [
        {
            label: 'Campus Cartography Digitization',
            val: '36 Nodes  |  73 Edges',
            desc: 'Digitized from official IIT Delhi master map covering all academic blocks, hostels, and gates.'
        },
        {
            label: 'Algorithm Execution Speed',
            val: '< 0.5 Milliseconds',
            desc: 'Dijkstra: ~0.49 ms | A*: ~0.11 ms | Floyd-Warshall lookup: <0.05 ms with zero server roundtrip latency.'
        },
        {
            label: 'Search Space Pruning (A* vs Dijkstra)',
            val: '68% Node Reduction',
            desc: 'A* reaches the exact same 63.1 m optimal distance while visiting only 7 nodes vs Dijkstra\'s 22 nodes.'
        },
        {
            label: 'Automated Headless Test Verification',
            val: '100% Pass (9/9 Suites)',
            desc: 'All pathfinders verified against ground-truth shortest paths and topological connectivity.'
        }
    ];

    let mY = 2.28;
    metricCards.forEach(m => {
        slide.addShape(pres.ShapeType.roundRect, {
            x: 7.45, y: mY, w: 4.75, h: 0.98,
            fill: { color: THEME.bgCardSubtle },
            line: { color: THEME.borderSubtle, width: 1 },
            rectRadius: 0.08
        });

        slide.addText(m.label.toUpperCase(), {
            x: 7.6, y: mY + 0.06, w: 4.45, h: 0.2,
            fontSize: 8.5, fontFace: 'Arial', bold: true,
            color: THEME.textSlate
        });

        slide.addText(m.val, {
            x: 7.6, y: mY + 0.26, w: 4.45, h: 0.3,
            fontSize: 12.5, fontFace: 'Arial', bold: true,
            color: THEME.primaryCyan
        });

        slide.addText(m.desc, {
            x: 7.6, y: mY + 0.58, w: 4.45, h: 0.34,
            fontSize: 9, fontFace: 'Calibri',
            color: THEME.textLight
        });

        mY += 1.08;
    });

    addSlideNumber(slide, 7);
}

// ==========================================
// SLIDE 8: CONCLUSION AND FUTURE SCOPE
// ==========================================
{
    const slide = pres.addSlide();
    slide.background = { color: THEME.bgDark };
    addSlideHeader(slide, 'Project Conclusion', 'Conclusion and Future Scope', 'Summary of key project milestones and practical avenues for scalable expansion');

    // Left Column: Key Achievements
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 1.75, w: 5.65, h: 3.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderSubtle, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('KEY PROJECT ACHIEVEMENTS', {
        x: 1.1, y: 1.95, w: 5.15, h: 0.32,
        fontSize: 12.5, fontFace: 'Arial', bold: true,
        color: THEME.accentGreen
    });

    const achievements = [
        { text: '• End-to-End Integrated System: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Engineered a fully functional campus digital twin combining data ingestion, backend services, DAA algorithms, and 3D simulation.\n\n', options: { color: THEME.textSlate } },
        { text: '• Theoretical DAA to Applied Software: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Demonstrated why theoretical Big-O guarantees matter in real applications through empirical benchmark telemetry (A* expanding 68% fewer nodes).\n\n', options: { color: THEME.textSlate } },
        { text: '• Robust Architecture: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Modular Strategy design pattern enables plugging in new algorithms with zero changes to the underlying graph model or UI.', options: { color: THEME.textSlate } }
    ];
    slide.addText(achievements, {
        x: 1.1, y: 2.38, w: 5.15, h: 3.0,
        fontSize: 10.8, fontFace: 'Calibri', lineSpacing: 15, valign: 'top'
    });

    // Right Column: Realistic Future Scope (Ends at 12.45")
    slide.addShape(pres.ShapeType.roundRect, {
        x: 6.8, y: 1.75, w: 5.65, h: 3.85,
        fill: { color: THEME.bgCard },
        line: { color: THEME.borderSubtle, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('REALISTIC FUTURE ENHANCEMENTS', {
        x: 7.05, y: 1.95, w: 5.15, h: 0.32,
        fontSize: 12.5, fontFace: 'Arial', bold: true,
        color: THEME.accentAmber
    });

    const futureScope = [
        { text: '• Dynamic Congestion Weights: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Incorporate live class schedules and sensor data to dynamically adjust edge weights, routing users away from congested corridors during peak hours.\n\n', options: { color: THEME.textSlate } },
        { text: '• Multi-Story Indoor Navigation: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Extend the graph into 3D multi-level vertical floorplans for large academic complexes (Lecture Hall Complex, Central Library).\n\n', options: { color: THEME.textSlate } },
        { text: '• Mobile PWA & AR Walking Guidance: ', options: { bold: true, color: THEME.textWhite } },
        { text: 'Deploy as a mobile Progressive Web App with GPS positioning and camera-based Augmented Reality directional arrows on screen.', options: { color: THEME.textSlate } }
    ];
    slide.addText(futureScope, {
        x: 7.05, y: 2.38, w: 5.15, h: 3.0,
        fontSize: 10.8, fontFace: 'Calibri', lineSpacing: 15, valign: 'top'
    });

    // Bottom Banner: Thank You & Student Credentials
    slide.addShape(pres.ShapeType.roundRect, {
        x: 0.85, y: 5.75, w: 11.6, h: 0.95,
        fill: { color: THEME.bgCardSubtle },
        line: { color: THEME.borderAccent, width: 1.2 },
        rectRadius: 0.15
    });

    slide.addText('THANK YOU!  |  QUESTIONS & ANSWERS WELCOME', {
        x: 1.1, y: 5.85, w: 7.0, h: 0.35,
        fontSize: 13.5, fontFace: 'Arial', bold: true,
        color: THEME.primaryCyan, valign: 'middle'
    });

    slide.addText('Presenter: Kanishk Sinha  |  ID: AP25110080048  |  Section: CSE BDA \'A\'', {
        x: 1.1, y: 6.22, w: 7.0, h: 0.32,
        fontSize: 10.5, fontFace: 'Calibri',
        color: THEME.textLight, valign: 'middle'
    });

    slide.addText('CAMPUS NAVIGATION SYSTEM', {
        x: 8.5, y: 5.92, w: 3.7, h: 0.6,
        fontSize: 12.5, fontFace: 'Arial', bold: true,
        color: THEME.accentAmber, align: 'right', valign: 'middle'
    });

    addSlideNumber(slide, 8);
}

// Generate Presentation File in Root
const outputPath = path.join(__dirname, '..', 'Campus_Navigation_System_Kanishk_Sinha.pptx');
console.log('Writing presentation to:', outputPath);

pres.writeFile({ fileName: outputPath }).then(() => {
    console.log('Presentation generated successfully at:', outputPath);
}).catch(err => {
    console.error('Failed to generate presentation:', err);
    process.exit(1);
});
