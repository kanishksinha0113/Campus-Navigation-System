#include "PathAnimator.h"
#include "CampusRenderer.h"
#include <cmath>
#include <algorithm>

void PathAnimator::start(const PathResult& result, const Graph& g) {
    _pathPositions.clear();
    _visitPositions.clear();
    _timer = 0.0f;
    _finished = false;
    
    for (int nodeId : result.path) {
        auto nodeOpt = g.getNode(nodeId);
        if (!nodeOpt) continue;
        Vector3 pos = CampusRenderer::graphToWorld(nodeOpt->x, nodeOpt->y);
        pos.y = 2.5f; // Raise slightly above ground
        _pathPositions.push_back(pos);
    }

    for (int nodeId : result.visitOrder) {
        auto nodeOpt = g.getNode(nodeId);
        if (!nodeOpt) continue;
        Vector3 pos = CampusRenderer::graphToWorld(nodeOpt->x, nodeOpt->y);
        pos.y = 2.5f;
        _visitPositions.push_back(pos);
    }
    
    _pathLen = (int)_pathPositions.size();
    if (_pathLen == 0) {
        _finished = true;
    }
}

void PathAnimator::update(float dt) {
    if (_finished) return;
    
    _timer += dt;
    int rc = revealCount();
    if (rc >= _pathLen) {
        _finished = true;
    }
}

bool PathAnimator::isFinished() const {
    return _finished;
}

int PathAnimator::revealCount() const {
    return std::min((int)(_timer / STEP_SECONDS), _pathLen);
}

void PathAnimator::draw() const {
    if (_pathPositions.empty()) return;
    
    int rc = revealCount();
    int drawLimit = std::min(rc + 1, _pathLen);
    
    for (int i = 0; i < drawLimit - 1; ++i) {
        Vector3 p1 = _pathPositions[i];
        Vector3 p2 = _pathPositions[i+1];
        
        // Solid path segments
        DrawCylinderEx(p1, p2, 1.5f, 1.5f, 8, YELLOW);
    }
    
    // Draw pulsing sphere at the head of the path
    if (drawLimit > 0) {
        Vector3 headPos = _pathPositions[drawLimit - 1];
        float pulse = sinf(GetTime() * 4.0f) * 0.5f + 0.5f;
        Color headColor = YELLOW;
        headColor.a = (unsigned char)(pulse * 255.0f);
        float size = 2.0f + pulse * 1.5f;
        
        DrawSphere(headPos, size, headColor);
    }
}

void PathAnimator::reset() {
    _pathPositions.clear();
    _visitPositions.clear();
    _timer = 0.0f;
    _finished = false;
    _pathLen = 0;
}
