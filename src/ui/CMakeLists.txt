add_library(ui STATIC UIManager.cpp)
target_include_directories(ui PUBLIC ${CMAKE_SOURCE_DIR}/src)
target_link_libraries(ui PUBLIC graph algorithms imgui)
target_compile_features(ui PUBLIC cxx_std_17)
