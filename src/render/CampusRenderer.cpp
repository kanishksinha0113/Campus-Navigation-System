#include "CampusRenderer.h"
#include <cmath>
#include <algorithm>

// ─── Coordinate conversion ───────────────────────────────────────────────────
// Graph grid 0-100 -> world coords: x maps 0..100 to 0..1000, y maps to z (flipped)
Vector3 CampusRenderer::graphToWorld(float gx, float gy) {
    return {gx * 10.0f, 0.0f, (100.0f - gy) * 10.0f};
}

Color CampusRenderer::categoryColor(Category cat) const {
    switch (cat) {
        case Category::Hostel:     return BLUE;
        case Category::Academic:   return GOLD;
        case Category::Food:       return ORANGE;
        case Category::Shopping:   return PURPLE;
        case Category::ATM:        return RED;
        case Category::Medical:    return GREEN;
        case Category::Sports:     return SKYBLUE;
        case Category::Market:     return VIOLET;
        case Category::Residence:  return BEIGE;
        case Category::Gate:       return LIME;
        case Category::Guesthouse: return PINK;
        default:                   return GRAY;
    }
}

float CampusRenderer::categoryHeight(Category cat) const {
    switch (cat) {
        case Category::Hostel:     return 20.0f;
        case Category::Academic:   return 25.0f;
        case Category::Food:       return 8.0f;
        case Category::Shopping:   return 8.0f;
        case Category::ATM:        return 6.0f;
        case Category::Medical:    return 12.0f;
        case Category::Sports:     return 4.0f;
        case Category::Market:     return 8.0f;
        case Category::Residence:  return 12.0f;
        case Category::Gate:       return 5.0f;
        case Category::Guesthouse: return 10.0f;
        default:                   return 10.0f;
    }
}

// ─── init: bake all geometry once ───────────────────────────────────────────
void CampusRenderer::init(const Graph& g) {
    _graph = &g;

    // ── Buildings + Markers ──
    for (const auto& node : g.getAllNodes()) {
        float h = categoryHeight(node.category);
        Mesh cubeMesh = GenMeshCube(8.0f, h, 8.0f);
        Model model   = LoadModelFromMesh(cubeMesh);

        Vector3 pos   = graphToWorld(node.x, node.y);

        BuildingMesh bm;
        bm.model    = model;
        bm.color    = categoryColor(node.category);
        bm.position = pos;
        bm.position.y += h * 0.5f;  // ground floor at y=0
        bm.scale    = 1.0f;
        _buildings[node.id] = bm;

        MarkerMesh mm;
        mm.position   = pos;
        mm.position.y = h + 4.0f;    // hover above building
        mm.color      = categoryColor(node.category);
        mm.radius     = 3.5f;
        mm.nodeId     = node.id;
        _markers.push_back(mm);
    }

    // ── Roads ── (each undirected edge drawn once)
    for (const auto& edge : g.getAllEdges()) {
        auto n1opt = g.getNode(edge.from);
        auto n2opt = g.getNode(edge.to);
        if (!n1opt || !n2opt) continue;

        Vector3 p1  = graphToWorld(n1opt->x, n1opt->y);
        Vector3 p2  = graphToWorld(n2opt->x, n2opt->y);
        float length = Vector3Distance(p1, p2);
        // Angle in XZ plane so the road cube aligns between the two nodes
        float angle  = atan2f(p1.x - p2.x, p1.z - p2.z) * RAD2DEG;

        Mesh  roadMesh = GenMeshCube(2.5f, 0.4f, length);
        Model rModel   = LoadModelFromMesh(roadMesh);

        RoadMesh rm;
        rm.model    = rModel;
        rm.position = {(p1.x + p2.x) * 0.5f, 0.2f, (p1.z + p2.z) * 0.5f};
        rm.rotation = angle;
        rm.length   = length;
        _roads.push_back(rm);
        _edgeList.push_back({edge.from, edge.to});
    }
}

// ─── unload ──────────────────────────────────────────────────────────────────
void CampusRenderer::unload() {
    for (auto& [id, bm] : _buildings) UnloadModel(bm.model);
    for (auto& rm : _roads)           UnloadModel(rm.model);
    _buildings.clear();
    _roads.clear();
    _markers.clear();
    _edgeList.clear();
    _graph = nullptr;
}

// ─── draw ────────────────────────────────────────────────────────────────────
void CampusRenderer::draw(const Camera3D& cam, const std::vector<int>& highlightPath, int revealCount, bool themeLight) {
    (void)cam;

    // Ground plane: dark night grass vs bright daylight green
    Color groundColor = themeLight ? Color{165, 205, 155, 255} : Color{25, 45, 30, 255};
    DrawPlane({500.0f, -0.1f, 500.0f}, {2000.0f, 2000.0f}, groundColor);

    // Roads: lighter asphalt in day vs dark asphalt at night
    Color roadColor = themeLight ? Color{110, 115, 125, 255} : Color{60, 60, 80, 255};
    for (const auto& rm : _roads) {
        DrawModelEx(rm.model, rm.position, {0.0f, 1.0f, 0.0f}, rm.rotation, {1, 1, 1}, roadColor);
    }

    // Buildings
    for (const auto& [id, bm] : _buildings) {
        DrawModel(bm.model, bm.position, bm.scale, bm.color);
        // Wireframe outline
        DrawModelWires(bm.model, bm.position, bm.scale, {0, 0, 0, 80});
    }

    // Marker spheres
    for (const auto& mm : _markers) {
        DrawSphere(mm.position, mm.radius, mm.color);
        DrawSphereWires(mm.position, mm.radius, 6, 6, {0, 0, 0, 100});
    }

    // Highlighted path trail
    if (_graph && !highlightPath.empty() && revealCount > 0) {
        int limit = std::min((int)highlightPath.size(), revealCount + 1);
        for (int i = 0; i + 1 < limit; ++i) {
            auto n1opt = _graph->getNode(highlightPath[i]);
            auto n2opt = _graph->getNode(highlightPath[i + 1]);
            if (!n1opt || !n2opt) continue;

            Vector3 p1 = graphToWorld(n1opt->x, n1opt->y);
            Vector3 p2 = graphToWorld(n2opt->x, n2opt->y);
            p1.y = 2.5f;
            p2.y = 2.5f;

            // Thick glowing amber cylinder
            DrawCylinderEx(p1, p2, 1.8f, 1.8f, 8, {255, 200, 50, 220});
        }
        // Pulse sphere on the newest revealed node
        if (revealCount > 0 && revealCount <= (int)highlightPath.size()) {
            int lastId = highlightPath[revealCount - 1];
            auto lastNode = _graph->getNode(lastId);
            if (lastNode) {
                Vector3 pPos = graphToWorld(lastNode->x, lastNode->y);
                float pulse  = 3.5f + sinf(GetTime() * 6.0f) * 1.5f;
                pPos.y = 2.5f;
                DrawSphere(pPos, pulse, {255, 255, 100, 200});
            }
        }
    }
}

// ─── pickNode: ray vs sphere AABB ────────────────────────────────────────────
int CampusRenderer::pickNode(Ray ray) const {
    int   closest     = -1;
    float closestDist = 1e9f;
    for (const auto& mm : _markers) {
        BoundingBox bbox;
        bbox.min = {mm.position.x - mm.radius, mm.position.y - mm.radius, mm.position.z - mm.radius};
        bbox.max = {mm.position.x + mm.radius, mm.position.y + mm.radius, mm.position.z + mm.radius};
        RayCollision hit = GetRayCollisionBox(ray, bbox);
        if (hit.hit && hit.distance < closestDist) {
            closestDist = hit.distance;
            closest     = mm.nodeId;
        }
    }
    return closest;
}
