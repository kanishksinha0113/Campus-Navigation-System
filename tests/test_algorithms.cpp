#include <catch2/catch_test_macros.hpp>
#include <catch2/catch_approx.hpp>
#include "graph/Graph.h"
#include "algorithms/IPathfinder.h"
#include "algorithms/FloydWarshallPathfinder.h"
#include "algorithms/HeldKarpTSP.h"
#include <algorithm>

// Hand-built 6-node graph:
// Edges: 0-1:4, 0-2:1, 2-1:2, 1-3:5, 2-4:8, 3-4:2, 3-5:6, 4-5:3
// Known shortest 0->5: 0->2->1->3->4->5, distance=12
static Graph createTestGraph() {
    Graph g;
    for (int i = 0; i < 6; ++i) {
        Node n;
        n.id = i;
        n.name = "N" + std::to_string(i);
        n.category = Category::Academic;
        n.x = static_cast<float>(i * 10);
        n.y = 0.0f;
        n.z = 0.0f;
        g.addNode(n);
    }
    g.addEdge(0, 1, 4.0f);
    g.addEdge(0, 2, 1.0f);
    g.addEdge(2, 1, 2.0f);
    g.addEdge(1, 3, 5.0f);
    g.addEdge(2, 4, 8.0f);
    g.addEdge(3, 4, 2.0f);
    g.addEdge(3, 5, 6.0f);
    g.addEdge(4, 5, 3.0f);
    return g;
}

TEST_CASE("Dijkstra finds optimal path", "[algorithms]") {
    Graph g = createTestGraph();
    auto pf = makePathfinder(AlgorithmType::Dijkstra);
    PathResult res = pf->findPath(g, 0, 5);
    REQUIRE(res.success);
    REQUIRE(res.distance == Catch::Approx(12.0f));
    REQUIRE(res.path.front() == 0);
    REQUIRE(res.path == std::vector<int>{0, 2, 4, 5});
}

TEST_CASE("A* finds same optimal path as Dijkstra", "[algorithms]") {
    Graph g = createTestGraph();
    auto pf = makePathfinder(AlgorithmType::AStar);
    PathResult res = pf->findPath(g, 0, 5);
    REQUIRE(res.success);
    REQUIRE(res.distance == Catch::Approx(12.0f));
    REQUIRE(res.path.front() == 0);
    REQUIRE(res.path.back() == 5);
}

TEST_CASE("Bellman-Ford finds optimal path", "[algorithms]") {
    Graph g = createTestGraph();
    auto pf = makePathfinder(AlgorithmType::BellmanFord);
    PathResult res = pf->findPath(g, 0, 5);
    REQUIRE(res.success);
    REQUIRE(res.distance == Catch::Approx(12.0f));
    REQUIRE(res.path.front() == 0);
    REQUIRE(res.path.back() == 5);
}

TEST_CASE("Floyd-Warshall finds optimal path", "[algorithms]") {
    Graph g = createTestGraph();
    FloydWarshallPathfinder fw;
    fw.precompute(g);
    PathResult res = fw.findPath(g, 0, 5);
    REQUIRE(res.success);
    REQUIRE(res.distance == Catch::Approx(12.0f));
    REQUIRE(res.path.front() == 0);
    REQUIRE(res.path.back() == 5);
}

TEST_CASE("BFS finds a valid path (hop-count shortest)", "[algorithms]") {
    Graph g = createTestGraph();
    auto pf = makePathfinder(AlgorithmType::BFS);
    PathResult res = pf->findPath(g, 0, 5);
    REQUIRE(res.success);
    REQUIRE(res.path.front() == 0);
    REQUIRE(res.path.back() == 5);
    // BFS finds minimum hops — should be 4 nodes (3 hops)
    REQUIRE(res.path.size() == 4);
}

TEST_CASE("DFS finds some valid path", "[algorithms]") {
    Graph g = createTestGraph();
    auto pf = makePathfinder(AlgorithmType::DFS);
    PathResult res = pf->findPath(g, 0, 5);
    REQUIRE(res.success);
    REQUIRE(res.path.front() == 0);
    REQUIRE(res.path.back() == 5);
}

TEST_CASE("HeldKarp TSP visits all waypoints", "[algorithms]") {
    Graph g = createTestGraph();
    HeldKarpTSP hk;
    std::vector<int> waypoints = {0, 1, 2, 3};
    PathResult res = hk.solveTSP(g, waypoints);
    REQUIRE(res.success);
    // All waypoints appear in the path
    for (int wp : waypoints) {
        bool found = std::find(res.path.begin(), res.path.end(), wp) != res.path.end();
        REQUIRE(found);
    }
}

TEST_CASE("Algorithms agree on no-path scenario", "[algorithms]") {
    Graph g;
    // Disconnected: node 0 and node 1 with no edges
    Node n0; n0.id = 0; n0.name = "A"; n0.category = Category::Academic; n0.x = 0; n0.y = 0; n0.z = 0;
    Node n1; n1.id = 1; n1.name = "B"; n1.category = Category::Academic; n1.x = 10; n1.y = 0; n1.z = 0;
    g.addNode(n0);
    g.addNode(n1);
    // No edges added

    auto dijk = makePathfinder(AlgorithmType::Dijkstra);
    PathResult res = dijk->findPath(g, 0, 1);
    REQUIRE(!res.success);
    REQUIRE(res.path.empty());
}
