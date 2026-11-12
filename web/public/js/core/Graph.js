/**
 * CampusNav3D — Spatial Graph Core
 * Enterprise GIS Model for IIT Delhi Campus Digital Twin
 */

export const CATEGORY_META = {
    Academic:   { label: 'Academic',   color: '#f59e0b', lightColor: '#d97706', height: 26, icon: '🏛️',  desc: 'Lecture Halls & Departments' },
    Hostel:     { label: 'Hostel',     color: '#3b82f6', lightColor: '#2563eb', height: 22, icon: '🏢',  desc: 'Student Residences & Dining' },
    Food:       { label: 'Dining',     color: '#f97316', lightColor: '#ea580c', height: 10, icon: '☕',  desc: 'Cafes & Student Eateries' },
    Shopping:   { label: 'Shopping',   color: '#a855f7', lightColor: '#9333ea', height: 12, icon: '🛍️',  desc: 'SAC & Campus Essentials' },
    ATM:        { label: 'ATM / Bank', color: '#ef4444', lightColor: '#dc2626', height: 8,  icon: '💳',  desc: 'Financial Services' },
    Medical:    { label: 'Medical',    color: '#10b981', lightColor: '#059669', height: 16, icon: '🏥',  desc: 'IITD Health Hospital' },
    Sports:     { label: 'Sports',     color: '#06b6d4', lightColor: '#0891b2', height: 6,  icon: '⚽',  desc: 'Courts, OAT & Stadiums' },
    Market:     { label: 'Market',     color: '#ec4899', lightColor: '#db2777', height: 12, icon: '🛒',  desc: 'IITD Main Bazaar' },
    Residence:  { label: 'Faculty',    color: '#d4d4d8', lightColor: '#a1a1aa', height: 14, icon: '🏡',  desc: 'Staff & Old Campus Homes' },
    Gate:       { label: 'Transit Gate', color: '#84cc16', lightColor: '#65a30d', height: 7, icon: '🚇',  desc: 'Metro & City Boundary Gates' },
    Guesthouse: { label: 'Guest House', color: '#f43f5e', lightColor: '#e11d48', height: 14, icon: '🏨', desc: 'Main Campus Visiting Suites' }
};

export class Graph {
    constructor() {
        this.nodes = new Map();     // id -> Node
        this.adj = new Map();       // id -> Edge[]
        this.nodeOrder = [];
        this.edges = [];            // all unique undirected edges
    }

    // Normalized grid (0-100) to World 3D (meters, origin centered at campus center (50, 50))
    static gridToWorld(gx, gy, scale = 12.0) {
        // x goes West -> East
        // z goes South -> North (inverted for 3D coordinate space)
        const wx = (gx - 50.0) * scale;
        const wz = (50.0 - gy) * scale;
        return { x: wx, y: 0, z: wz };
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

    addEdge(from, to, weight) {
        const n1 = this.nodes.get(from);
        const n2 = this.nodes.get(to);
        const distMeters = Math.round(weight * 20.0); // 1 grid unit ≈ 20 meters

        // Classify road tier
        let roadTier = 'arterial';
        if (n1 && n2) {
            const isPerimeter = (n1.category === 'Gate' || n2.category === 'Gate');
            if (isPerimeter && (n1.x <= 10 || n1.x >= 90 || n1.y <= 15 || n1.y >= 85)) {
                roadTier = 'highway';
            } else if (weight > 18.0) {
                roadTier = 'avenue';
            }
        }

        const edge1 = { from, to, weight, distMeters, roadTier };
        const edge2 = { from: to, to: from, weight, distMeters, roadTier };

        this.adj.get(from).push(edge1);
        this.adj.get(to).push(edge2);

        if (from < to) {
            this.edges.push(edge1);
        }
    }

    getNode(id) {
        return this.nodes.get(id);
    }

    getNeighbors(id) {
        return this.adj.get(id) || [];
    }

    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    getAllEdges() {
        return this.edges;
    }

    nodeCount() {
        return this.nodes.size;
    }

    edgeCount() {
        return this.edges.length;
    }

    // Compass bearing between two nodes in degrees (0 = North, 90 = East, 180 = South, 270 = West)
    static calculateBearing(n1, n2) {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        let deg = (Math.atan2(dx, dy) * 180.0) / Math.PI;
        if (deg < 0) deg += 360.0;
        return deg;
    }

    static bearingToCompass(deg) {
        const points = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const idx = Math.round(deg / 22.5) % 16;
        return points[idx];
    }

    // Generate turn instruction ("Turn left", "Bear right", "Continue straight")
    static getTurnInstruction(prevNode, currNode, nextNode) {
        const bearingIn  = Graph.calculateBearing(prevNode, currNode);
        const bearingOut = Graph.calculateBearing(currNode, nextNode);
        let turnAngle = bearingOut - bearingIn;
        if (turnAngle > 180) turnAngle -= 360;
        if (turnAngle < -180) turnAngle += 360;

        if (Math.abs(turnAngle) < 25) return { type: 'straight', text: 'Continue straight' };
        if (turnAngle > 25 && turnAngle < 65) return { type: 'slight-right', text: 'Bear right' };
        if (turnAngle >= 65 && turnAngle < 125) return { type: 'right', text: 'Turn right' };
        if (turnAngle >= 125) return { type: 'sharp-right', text: 'Sharp right turn' };
        if (turnAngle < -25 && turnAngle > -65) return { type: 'slight-left', text: 'Bear left' };
        if (turnAngle <= -65 && turnAngle > -125) return { type: 'left', text: 'Turn left' };
        return { type: 'sharp-left', text: 'Sharp left turn' };
    }

    // Generate full enterprise turn-by-turn guidance sheet
    generateTurnByTurn(pathIds) {
        if (!pathIds || pathIds.length < 2) return [];

        const steps = [];
        let totalDist = 0;

        for (let i = 0; i < pathIds.length - 1; ++i) {
            const curr = this.getNode(pathIds[i]);
            const next = this.getNode(pathIds[i + 1]);
            const edge = this.getNeighbors(curr.id).find(e => e.to === next.id);
            const dist = edge ? edge.distMeters : Math.round(Math.hypot(next.x - curr.x, next.y - curr.y) * 20.0);
            totalDist += dist;

            let instruction = '';
            let icon = 'straight';

            if (i === 0) {
                const bearing = Graph.calculateBearing(curr, next);
                const compass = Graph.bearingToCompass(bearing);
                instruction = `Depart ${curr.name} heading ${compass} toward ${next.name}`;
                icon = 'depart';
            } else {
                const prev = this.getNode(pathIds[i - 1]);
                const turn = Graph.getTurnInstruction(prev, curr, next);
                icon = turn.type;
                instruction = `${turn.text} at ${curr.name} toward ${next.name}`;
            }

            steps.push({
                stepIndex: i + 1,
                fromNode: curr,
                toNode: next,
                instruction,
                distanceMeters: dist,
                cumulativeDistance: totalDist,
                icon
            });
        }

        const lastNode = this.getNode(pathIds[pathIds.length - 1]);
        steps.push({
            stepIndex: steps.length + 1,
            fromNode: lastNode,
            toNode: null,
            instruction: `Arrive at destination: ${lastNode.name}`,
            distanceMeters: 0,
            cumulativeDistance: totalDist,
            icon: 'arrive'
        });

        return steps;
    }

    // Load from remote JSON endpoints
    static async loadFromAPI(nodesUrl = '/data/campus_nodes.json', edgesUrl = '/data/campus_edges.json') {
        const [nodesRes, edgesRes] = await Promise.all([
            fetch(nodesUrl),
            fetch(edgesUrl)
        ]);

        if (!nodesRes.ok || !edgesRes.ok) {
            throw new Error(`Failed to load campus graph data: ${nodesRes.status} / ${edgesRes.status}`);
        }

        const nodesData = await nodesRes.json();
        const edgesData = await edgesRes.json();

        const graph = new Graph();
        for (const n of nodesData.nodes) {
            graph.addNode(n);
        }
        for (const e of edgesData.edges) {
            graph.addEdge(e.from, e.to, e.weight);
        }

        return graph;
    }
}
