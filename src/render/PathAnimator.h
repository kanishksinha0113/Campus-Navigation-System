#pragma once
#include "raylib.h"
#include "algorithms/IPathfinder.h"
#include "graph/Graph.h"
#include <vector>

class PathAnimator {
public:
    void start(const PathResult& result, const Graph& g);
    void update(float dt);
    bool isFinished() const;
    int  revealCount() const;  // how many path segments revealed so far
    void draw() const;         // draws the animated trail
    void reset();
    
    static constexpr float STEP_SECONDS = 0.4f; // time per node reveal

private:
    std::vector<Vector3> _pathPositions; // world positions of path nodes
    std::vector<Vector3> _visitPositions; // world positions of visit-order nodes
    float _timer = 0.0f;
    bool _finished = false;
    int _pathLen = 0;
};
