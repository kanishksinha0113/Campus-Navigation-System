add_executable(CampusNav3D AppController.cpp)
target_include_directories(CampusNav3D PRIVATE ${CMAKE_SOURCE_DIR}/src)
target_link_libraries(CampusNav3D PRIVATE graph algorithms render ui imgui rlImGui raylib)
target_compile_features(CampusNav3D PRIVATE cxx_std_17)
# Copy data dir to build dir
add_custom_command(TARGET CampusNav3D POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
        ${CMAKE_SOURCE_DIR}/data
        $<TARGET_FILE_DIR:CampusNav3D>/data)
