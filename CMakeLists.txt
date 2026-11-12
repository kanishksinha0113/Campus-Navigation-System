cmake_minimum_required(VERSION 3.20)
project(CampusNav3D VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# ─────────────────────────────────────────────
# Output directories
# ─────────────────────────────────────────────
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

# ─────────────────────────────────────────────
# raylib — use pre-built binaries in external/raylib/
# ─────────────────────────────────────────────
set(RAYLIB_DIR "${CMAKE_SOURCE_DIR}/external/raylib/raylib-5.0_win64_mingw-w64")

# Create an imported target so modules can simply link against 'raylib'
add_library(raylib STATIC IMPORTED GLOBAL)
set_target_properties(raylib PROPERTIES
    IMPORTED_LOCATION "${RAYLIB_DIR}/lib/libraylib.a"
    INTERFACE_INCLUDE_DIRECTORIES "${RAYLIB_DIR}/include"
)
# raylib needs these system libs on Windows with MinGW
target_link_libraries(raylib INTERFACE
    opengl32 gdi32 winmm
)

# ─────────────────────────────────────────────
# Dear ImGui — bundled source (external/imgui/)
# ─────────────────────────────────────────────
set(IMGUI_DIR ${CMAKE_SOURCE_DIR}/external/imgui)
add_library(imgui STATIC
    ${IMGUI_DIR}/imgui.cpp
    ${IMGUI_DIR}/imgui_draw.cpp
    ${IMGUI_DIR}/imgui_tables.cpp
    ${IMGUI_DIR}/imgui_widgets.cpp
    ${IMGUI_DIR}/imgui_demo.cpp
)
target_include_directories(imgui PUBLIC ${IMGUI_DIR})
target_compile_features(imgui PUBLIC cxx_std_17)

# ─────────────────────────────────────────────
# rlImGui — raylib <-> ImGui backend (external/rlImGui/)
# ─────────────────────────────────────────────
set(RLIMGUI_DIR ${CMAKE_SOURCE_DIR}/external/rlImGui)
add_library(rlImGui STATIC ${RLIMGUI_DIR}/rlImGui.cpp)
target_include_directories(rlImGui PUBLIC ${RLIMGUI_DIR})
target_compile_definitions(rlImGui PUBLIC NO_FONT_AWESOME)
target_link_libraries(rlImGui PUBLIC imgui raylib)
target_compile_features(rlImGui PUBLIC cxx_std_17)

# ─────────────────────────────────────────────
# Source Modules
# ─────────────────────────────────────────────
add_subdirectory(src/graph)
add_subdirectory(src/algorithms)
add_subdirectory(src/render)
add_subdirectory(src/ui)
add_subdirectory(src/app)

# ─────────────────────────────────────────────
# Tests (Catch2 via FetchContent)
# ─────────────────────────────────────────────
enable_testing()
add_subdirectory(tests)
