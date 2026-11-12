# Use locally vendored Catch2 (avoid FetchContent network dependency)
set(CATCH2_SOURCE_DIR "${CMAKE_SOURCE_DIR}/external/catch2/Catch2-3.4.0")

# Build Catch2 from source (only the minimal needed parts)
set(CATCH_BUILD_TESTING OFF CACHE BOOL "" FORCE)
set(CATCH_INSTALL_DOCS  OFF CACHE BOOL "" FORCE)
set(CATCH_INSTALL_HELPERS OFF CACHE BOOL "" FORCE)
add_subdirectory(${CATCH2_SOURCE_DIR} "${CMAKE_BINARY_DIR}/catch2" EXCLUDE_FROM_ALL)

# ── Graph tests ──
add_executable(test_graph test_graph.cpp)
target_link_libraries(test_graph PRIVATE graph Catch2::Catch2WithMain)
target_include_directories(test_graph PRIVATE ${CMAKE_SOURCE_DIR}/src)
target_compile_features(test_graph PRIVATE cxx_std_17)

# ── Algorithm tests ──
add_executable(test_algorithms test_algorithms.cpp)
target_link_libraries(test_algorithms PRIVATE algorithms Catch2::Catch2WithMain)
target_include_directories(test_algorithms PRIVATE ${CMAKE_SOURCE_DIR}/src)
target_compile_features(test_algorithms PRIVATE cxx_std_17)

# ── Register with CTest ──
include(CTest)
include(${CATCH2_SOURCE_DIR}/extras/Catch.cmake)
add_test(NAME GraphTests      COMMAND test_graph)
add_test(NAME AlgorithmTests  COMMAND test_algorithms)
