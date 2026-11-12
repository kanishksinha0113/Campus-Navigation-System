#include "graph/Graph.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include <iostream>
#include <algorithm>

// ─── Static member ────────────────────────────────────────────────────────────
const std::vector<Edge> Graph::_emptyEdges;

// ─── Graph ────────────────────────────────────────────────────────────────────

void Graph::addNode(const Node& node) {
    if (_nodes.count(node.id) == 0)
        _nodeOrder.push_back(node.id);
    _nodes[node.id] = node;
    if (_adj.count(node.id) == 0)
        _adj[node.id] = {};
}

void Graph::addEdge(int from, int to, float weight) {
    _adj[from].push_back({from, to, weight});
    _adj[to].push_back({to, from, weight});
}

std::optional<Node> Graph::getNode(int id) const {
    auto it = _nodes.find(id);
    if (it == _nodes.end()) return std::nullopt;
    return it->second;
}

const std::vector<Edge>& Graph::getNeighbors(int id) const {
    auto it = _adj.find(id);
    if (it == _adj.end()) return _emptyEdges;
    return it->second;
}

std::vector<Node> Graph::getAllNodes() const {
    std::vector<Node> result;
    result.reserve(_nodeOrder.size());
    for (int id : _nodeOrder) {
        auto it = _nodes.find(id);
        if (it != _nodes.end()) result.push_back(it->second);
    }
    return result;
}

std::vector<Edge> Graph::getAllEdges() const {
    std::vector<Edge> result;
    for (int id : _nodeOrder) {
        auto it = _adj.find(id);
        if (it == _adj.end()) continue;
        for (const Edge& e : it->second) {
            if (e.from < e.to) // only include each undirected edge once
                result.push_back(e);
        }
    }
    return result;
}

int Graph::edgeCount() const {
    int total = 0;
    for (const auto& kv : _adj)
        total += static_cast<int>(kv.second.size());
    return total / 2;
}

// ─── GraphLoader helpers ──────────────────────────────────────────────────────

std::string GraphLoader::readFile(const std::string& path) {
    std::ifstream f(path);
    if (!f.is_open())
        throw std::runtime_error("Cannot open file: " + path);
    std::ostringstream ss;
    ss << f.rdbuf();
    return ss.str();
}

// Extract value of a quoted string field: "key": "value"
std::string GraphLoader::extractStringField(const std::string& obj, const std::string& key) {
    std::string needle = "\"" + key + "\"";
    auto pos = obj.find(needle);
    if (pos == std::string::npos) return "";
    pos = obj.find(':', pos);
    if (pos == std::string::npos) return "";
    pos = obj.find('"', pos);
    if (pos == std::string::npos) return "";
    auto end = obj.find('"', pos + 1);
    if (end == std::string::npos) return "";
    return obj.substr(pos + 1, end - pos - 1);
}

// Extract numeric value of field: "key": 42.5
float GraphLoader::extractFloatField(const std::string& obj, const std::string& key) {
    std::string needle = "\"" + key + "\"";
    auto pos = obj.find(needle);
    if (pos == std::string::npos) return 0.0f;
    pos = obj.find(':', pos);
    if (pos == std::string::npos) return 0.0f;
    ++pos;
    while (pos < obj.size() && (obj[pos] == ' ' || obj[pos] == '\t')) ++pos;
    std::string numStr;
    while (pos < obj.size() && (std::isdigit(obj[pos]) || obj[pos] == '.' || obj[pos] == '-'))
        numStr += obj[pos++];
    return numStr.empty() ? 0.0f : std::stof(numStr);
}

int GraphLoader::extractIntField(const std::string& obj, const std::string& key) {
    return static_cast<int>(extractFloatField(obj, key));
}

// Split a JSON array body into individual {...} object strings
std::vector<std::string> GraphLoader::splitObjects(const std::string& content) {
    std::vector<std::string> objects;
    auto startBracket = content.find('[');
    auto endBracket   = content.rfind(']');
    if (startBracket == std::string::npos || endBracket == std::string::npos)
        return objects;

    int depth = 0;
    size_t start = std::string::npos;
    for (size_t i = startBracket + 1; i < endBracket; ++i) {
        if (content[i] == '{') {
            if (depth == 0) start = i;
            ++depth;
        } else if (content[i] == '}') {
            --depth;
            if (depth == 0 && start != std::string::npos) {
                objects.push_back(content.substr(start, i - start + 1));
                start = std::string::npos;
            }
        }
    }
    return objects;
}

// ─── GraphLoader::loadFromJSON ────────────────────────────────────────────────

Graph GraphLoader::loadFromJSON(const std::string& nodesFile, const std::string& edgesFile) {
    Graph g;

    // ── Nodes ──
    std::string nodesContent = readFile(nodesFile);
    auto nodeObjects = splitObjects(nodesContent);
    for (const auto& obj : nodeObjects) {
        Node n;
        n.id       = extractIntField(obj, "id");
        n.name     = extractStringField(obj, "name");
        n.category = categoryFromString(extractStringField(obj, "category"));
        n.x        = extractFloatField(obj, "x");
        n.y        = extractFloatField(obj, "y");
        n.z        = extractFloatField(obj, "z");
        g.addNode(n);
    }

    // ── Edges ──
    std::string edgesContent = readFile(edgesFile);
    auto edgeObjects = splitObjects(edgesContent);
    for (const auto& obj : edgeObjects) {
        int   from   = extractIntField(obj, "from");
        int   to     = extractIntField(obj, "to");
        float weight = extractFloatField(obj, "weight");
        g.addEdge(from, to, weight);
    }

    return g;
}

// ─── Debug ────────────────────────────────────────────────────────────────────

void printGraph(const Graph& g) {
    std::cout << "=== Campus Graph ===" << std::endl;
    std::cout << "Nodes: " << g.nodeCount() << "  Edges: " << g.edgeCount() << std::endl;
    std::cout << std::endl;
    for (const auto& node : g.getAllNodes()) {
        std::cout << "[" << node.id << "] "
                  << node.name
                  << " (" << categoryToString(node.category) << ")"
                  << " @ (" << node.x << ", " << node.y << ")" << std::endl;
        for (const auto& e : g.getNeighbors(node.id)) {
            auto nb = g.getNode(e.to);
            std::cout << "    -> [" << e.to << "] "
                      << (nb ? nb->name : "?")
                      << " w=" << e.weight << std::endl;
        }
    }
    std::cout << "====================" << std::endl;
}
