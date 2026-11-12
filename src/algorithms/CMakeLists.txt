add_library(algorithms STATIC
    IPathfinder.cpp
    BFSPathfinder.cpp DFSPathfinder.cpp
    DijkstraPathfinder.cpp AStarPathfinder.cpp
    BellmanFordPathfinder.cpp FloydWarshallPathfinder.cpp
    HeldKarpTSP.cpp NNTwoOptTSP.cpp
    Benchmark.cpp
)
target_include_directories(algorithms PUBLIC ${CMAKE_SOURCE_DIR}/src)
target_link_libraries(algorithms PUBLIC graph)
target_compile_features(algorithms PUBLIC cxx_std_17)
