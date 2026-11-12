#include <catch2/catch_test_macros.hpp>
#include <catch2/catch_approx.hpp>
#include "graph/Graph.h"

TEST_CASE("Graph: basic node/edge operations", "[graph]") {
    Graph g;

    Node n0; n0.id = 0; n0.name = "Node0"; n0.category = Category::Academic; n0.x = 0; n0.y = 0; n0.z = 0;
    Node n1; n1.id = 1; n1.name = "Node1"; n1.category = Category::Hostel;   n1.x = 10; n1.y = 0; n1.z = 0;
    Node n2; n2.id = 2; n2.name = "Node2"; n2.category = Category::Food;     n2.x = 20; n2.y = 0; n2.z = 0;

    g.addNode(n0);
    g.addNode(n1);
    g.addNode(n2);
    g.addEdge(0, 1, 10.0f);
    g.addEdge(1, 2, 20.0f);

    SECTION("nodeCount is correct") {
        REQUIRE(g.nodeCount() == 3);
    }

    SECTION("edgeCount counts undirected edges once") {
        REQUIRE(g.edgeCount() == 2);
    }

    SECTION("getNode returns correct node") {
        auto node = g.getNode(1);
        REQUIRE(node.has_value());
        REQUIRE(node->name == "Node1");
        REQUIRE(node->category == Category::Hostel);
    }

    SECTION("getNode returns nullopt for missing id") {
        REQUIRE(!g.getNode(99).has_value());
    }

    SECTION("getNeighbors of node 0 has one neighbor") {
        const auto& neighbors = g.getNeighbors(0);
        REQUIRE(neighbors.size() == 1);
        REQUIRE(neighbors[0].to == 1);
        REQUIRE(neighbors[0].weight == Catch::Approx(10.0f));
    }

    SECTION("graph is undirected: node 1 has two neighbors") {
        const auto& neighbors = g.getNeighbors(1);
        REQUIRE(neighbors.size() == 2);

        bool has0 = false, has2 = false;
        for (const auto& e : neighbors) {
            if (e.to == 0 && e.weight == Catch::Approx(10.0f)) has0 = true;
            if (e.to == 2 && e.weight == Catch::Approx(20.0f)) has2 = true;
        }
        REQUIRE(has0);
        REQUIRE(has2);
    }

    SECTION("getAllNodes returns all nodes in insertion order") {
        auto nodes = g.getAllNodes();
        REQUIRE(nodes.size() == 3);
        REQUIRE(nodes[0].id == 0);
        REQUIRE(nodes[1].id == 1);
        REQUIRE(nodes[2].id == 2);
    }

    SECTION("getAllEdges returns each undirected edge once") {
        auto edges = g.getAllEdges();
        REQUIRE(edges.size() == 2);
    }

    SECTION("hasNode works correctly") {
        REQUIRE(g.hasNode(0));
        REQUIRE(g.hasNode(2));
        REQUIRE(!g.hasNode(99));
    }
}
