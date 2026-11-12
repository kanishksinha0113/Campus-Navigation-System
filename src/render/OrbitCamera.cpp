#include "OrbitCamera.h"
#include "raymath.h"
#include <algorithm>

Camera3D OrbitCamera::getCamera() const {
    Camera3D cam = { 0 };
    
    // Convert spherical coordinates to cartesian for camera position
    // pitch is up/down (clamped later), yaw is left/right
    float pitchRad = pitch * DEG2RAD;
    float yawRad = yaw * DEG2RAD;
    
    cam.position.x = target.x + distance * cosf(pitchRad) * sinf(yawRad);
    cam.position.y = target.y + distance * sinf(pitchRad);
    cam.position.z = target.z + distance * cosf(pitchRad) * cosf(yawRad);
    
    cam.target = target;
    cam.up = { 0.0f, 1.0f, 0.0f }; // Y is up
    cam.fovy = fovy;
    cam.projection = CAMERA_PERSPECTIVE;
    
    return cam;
}

void OrbitCamera::update(float dt) {
    // Handle orbit (RMB drag)
    if (IsMouseButtonDown(MOUSE_BUTTON_RIGHT)) {
        Vector2 mouseDelta = GetMouseDelta();
        yaw -= mouseDelta.x * 0.5f;
        pitch += mouseDelta.y * 0.5f;
    }
    
    // Handle zoom (scroll)
    float wheelMove = GetMouseWheelMove();
    if (wheelMove != 0.0f) {
        distance -= wheelMove * 5.0f;
        distance = Clamp(distance, 10.0f, 200.0f);
    }
    
    // Clamp pitch to avoid gimbal lock and flipping
    pitch = Clamp(pitch, -89.0f, 89.0f);
    
    // Handle flying lerp
    if (_flying) {
        _flyProgress += dt; // 1 second duration
        if (_flyProgress >= 1.0f) {
            _flyProgress = 1.0f;
            _flying = false;
        }
        
        // Smooth step lerp
        float t = _flyProgress;
        t = t * t * (3.0f - 2.0f * t); // ease-in-out
        target = Vector3Lerp(target, _flyTarget, t);
    }
}

void OrbitCamera::flyTo(Vector3 newTarget, float dt) {
    (void)dt; // Not directly used since we base duration on 1 sec, but kept for signature match
    _flyTarget = newTarget;
    _flying = true;
    _flyProgress = 0.0f;
}
