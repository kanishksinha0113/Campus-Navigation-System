add_library(graph STATIC Graph.cpp)
target_include_directories(graph PUBLIC ${CMAKE_SOURCE_DIR}/src)
target_compile_features(graph PUBLIC cxx_std_17)
