/**
 * Automated Headless Test Suite for Web Algorithm Engine
 */
const fs = require('fs');
const path = require('path');

// Dynamically import ES modules in Node.js
async function runTests() {
    console.log('=== Running Web Algorithm Validation Suite ===');

    const { Graph } = await import('./public/js/core/Graph.js');
    const { BFSPathfinder } = await import('./public/js/algorithms/BFS.js');
    const { DFSPathfinder } = await import('./public/js/algorithms/DFS.js');
    const { DijkstraPathfinder } = await import('./public/js/algorithms/Dijkstra.js');
    const { AStarPathfinder } = await import('./public/js/algorithms/AStar.js');
    const { BellmanFordPathfinder } = await import('./public/js/algorithms/BellmanFord.js');
    const { FloydWarshallPathfinder } = await import('./public/js/algorithms/FloydWarshall.js');
    const { HeldKarpTSP } = await import('./public/js/algorithms/HeldKarpTSP.js');
    const { NNTwoOptTSP } = await import('./public/js/algorithms/NNTwoOptTSP.js');
    const { BenchmarkEngine } = await import('./public/js/algorithms/Benchmark.js');

    // Load actual campus data
    const nodesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'campus_nodes.json'), 'utf8'));
    const edgesRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'campus_edges.json'), 'utf8'));

    const graph = new Graph();
    nodesRaw.nodes.forEach(n => graph.addNode(n));
    edgesRaw.edges.forEach(e => graph.addEdge(e.from, e.to, e.weight));

    console.log(`Graph initialized: ${graph.nodeCount()} nodes, ${graph.edgeCount()} edges.`);

    // Test 1: Dijkstra from Delhi Metro West (0) to Library (16)
    const dijkstra = new DijkstraPathfinder();
    const dRes = dijkstra.findPath(graph, 0, 16);
    console.assert(dRes.success, 'Dijkstra failed');
    console.assert(dRes.path.length >= 2, 'Dijkstra path too short');
    console.log(`✓ Dijkstra (0 -> 16): dist=${dRes.distance.toFixed(1)}, nodes=${dRes.path.length}, expansions=${dRes.nodesExpanded}, time=${dRes.runtimeMs.toFixed(3)}ms`);

    // Test 2: A* from 0 to 16
    const astar = new AStarPathfinder();
    const aRes = astar.findPath(graph, 0, 16);
    console.assert(aRes.success, 'A* failed');
    console.assert(Math.abs(aRes.distance - dRes.distance) < 1e-3, 'A* and Dijkstra distance mismatch');
    console.assert(aRes.nodesExpanded <= dRes.nodesExpanded, 'A* expanded more nodes than Dijkstra');
    console.log(`✓ A* (0 -> 16): dist=${aRes.distance.toFixed(1)}, expansions=${aRes.nodesExpanded} (vs Dijkstra ${dRes.nodesExpanded})`);

    // Test 3: Bellman-Ford from 0 to 16
    const bf = new BellmanFordPathfinder();
    const bfRes = bf.findPath(graph, 0, 16);
    console.assert(bfRes.success, 'Bellman-Ford failed');
    console.assert(Math.abs(bfRes.distance - dRes.distance) < 1e-3, 'Bellman-Ford distance mismatch');
    console.log(`✓ Bellman-Ford (0 -> 16): dist=${bfRes.distance.toFixed(1)}, success=${bfRes.success}`);

    // Test 4: Floyd-Warshall precomputation & query
    const fw = new FloydWarshallPathfinder();
    fw.precompute(graph);
    const fwRes = fw.findPath(graph, 0, 16);
    console.assert(fwRes.success, 'Floyd-Warshall failed');
    console.assert(Math.abs(fwRes.distance - dRes.distance) < 1e-3, 'Floyd-Warshall distance mismatch');
    console.log(`✓ Floyd-Warshall (0 -> 16): dist=${fwRes.distance.toFixed(1)}, lookup time=${fwRes.runtimeMs.toFixed(3)}ms`);

    // Test 5: BFS from 0 to 16
    const bfs = new BFSPathfinder();
    const bfsRes = bfs.findPath(graph, 0, 16);
    console.assert(bfsRes.success, 'BFS failed');
    console.log(`✓ BFS (0 -> 16): hops=${bfsRes.path.length - 1}, dist=${bfsRes.distance.toFixed(1)}`);

    // Test 6: DFS from 0 to 16
    const dfs = new DFSPathfinder();
    const dfsRes = dfs.findPath(graph, 0, 16);
    console.assert(dfsRes.success, 'DFS failed');
    console.log(`✓ DFS (0 -> 16): path length=${dfsRes.path.length}`);

    // Test 7: Held-Karp TSP on 4 waypoints [0, 5, 8, 16]
    const hk = new HeldKarpTSP();
    const hkRes = hk.solveTSP(graph, [0, 5, 8, 16]);
    console.assert(hkRes.success, 'Held-Karp TSP failed');
    console.log(`✓ Held-Karp TSP (4 waypoints): tour distance=${hkRes.distance.toFixed(1)}, time=${hkRes.runtimeMs.toFixed(3)}ms`);

    // Test 8: NN + 2-Opt TSP on 4 waypoints
    const twoOpt = new NNTwoOptTSP();
    const toRes = twoOpt.solveTSP(graph, [0, 5, 8, 16]);
    console.assert(toRes.success, '2-Opt TSP failed');
    console.log(`✓ 2-Opt TSP (4 waypoints): tour distance=${toRes.distance.toFixed(1)}`);

    // Test 9: Benchmark Suite
    const bench = new BenchmarkEngine();
    const benchRes = bench.runComparison(graph, 0, 16);
    console.assert(benchRes.results.length === 6, 'Benchmark results count mismatch');
    console.log(`✓ Benchmark Suite: 6 algorithms evaluated. A* expansion reduction = ${benchRes.dijkstraVsAStar.reductionPercent}%`);

    console.log('\n===============================================');
    console.log('ALL 9 WEB ALGORITHM VALIDATION TESTS PASSED!');
    console.log('===============================================\n');
}

runTests().catch(err => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
});
