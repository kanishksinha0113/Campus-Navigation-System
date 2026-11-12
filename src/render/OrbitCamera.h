#pragma once
#include "raylib.h"
#include "raymath.h"

class OrbitCamera {
public:
    float yaw   = 45.0f;   // degrees
    float pitch = 30.0f;   // degrees
    float distance = 80.0f;
    Vector3 target = {50.0f, 0.0f, 50.0f}; // world-space look-at
    float fovy = 45.0f;
    
    Camera3D getCamera() const;
    void update(float dt);   // RMB drag = orbit, scroll = zoom
    void flyTo(Vector3 newTarget, float dt); // smooth lerp to new target
    
private:
    Vector3 _flyTarget = {50.0f, 0.0f, 50.0f};
    bool _flying = false;
    float _flyProgress = 0.0f;
};
