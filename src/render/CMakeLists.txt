add_library(render STATIC
    OrbitCamera.cpp
    CampusRenderer.cpp
    PathAnimator.cpp
)
target_include_directories(render PUBLIC ${CMAKE_SOURCE_DIR}/src)
target_link_libraries(render PUBLIC graph algorithms raylib)
target_compile_features(render PUBLIC cxx_std_17)
