#pragma once
#include "graph/Node.h"
#include <string>
#include <vector>
#include <unordered_map>
#include <optional>

class Graph {
public:
    void addNode(const Node& node);
    void addEdge(int from, int to, float weight); // adds both directions (undirected)

    std::optional<Node>        getNode(int id) const;
    const std::vector<Edge>&   getNeighbors(int id) const;
    std::vector<Node>          getAllNodes() const;
    std::vector<Edge>          getAllEdges() const; // each undirected edge returned once

    int  nodeCount() const { return static_cast<int>(_nodes.size()); }
    int  edgeCount() const; // half of total directed edges
    bool hasNode(int id)  const { return _nodes.count(id) > 0; }

    // Returns all node IDs in insertion order
    const std::vector<int>& nodeIds() const { return _nodeOrder; }

private:
    std::unordered_map<int, Node>         _nodes;
    std::unordered_map<int, std::vector<Edge>> _adj;
    std::vector<int>                      _nodeOrder;
    static const std::vector<Edge>        _emptyEdges;
};

class GraphLoader {
public:
    static Graph loadFromJSON(const std::string& nodesFile, const std::string& edgesFile);

private:
    // Simple hand-rolled JSON field parsers
    static std::string  readFile(const std::string& path);
    static std::string  extractStringField(const std::string& obj, const std::string& key);
    static float        extractFloatField (const std::string& obj, const std::string& key);
    static int          extractIntField   (const std::string& obj, const std::string& key);
    // Returns each {...} object in a JSON array
    static std::vector<std::string> splitObjects(const std::string& arrayContent);
};

// Debug utility
void printGraph(const Graph& g);
