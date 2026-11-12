#pragma once
#include "raylib.h"
#include "raymath.h"
#include "graph/Graph.h"
#include <unordered_map>
#include <vector>

struct BuildingMesh { Model model; Color color; Vector3 position; float scale; };
struct RoadMesh     { Model model; Vector3 position; float rotation; float length; };
struct MarkerMesh   { Vector3 position; Color color; float radius; int nodeId; };

class CampusRenderer {
public:
    void init(const Graph& g);     // call once after graph loaded — bakes all geometry
    void unload();                  // free GPU resources
    void draw(const Camera3D& cam, const std::vector<int>& highlightPath, int revealCount, bool themeLight = false);
    
    // Returns nodeId of the node whose marker sphere the ray hits, or -1
    int pickNode(Ray ray) const;
    
    // coordinate conversion: graph grid 0-100 -> world 3D (scale x10, z mirrored)
    static Vector3 graphToWorld(float gx, float gy);

private:
    std::unordered_map<int, BuildingMesh> _buildings;
    std::vector<RoadMesh> _roads;
    std::vector<MarkerMesh> _markers;
    std::vector<std::pair<int,int>> _edgeList; // for road index -> (from,to)
    const Graph* _graph = nullptr;
    
    Color categoryColor(Category cat) const;
    float categoryHeight(Category cat) const;
};
