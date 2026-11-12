# CMake generated Testfile for 
# Source directory: C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/tests
# Build directory: C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/build/tests
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test("GraphTests" "C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/build/bin/test_graph.exe")
set_tests_properties("GraphTests" PROPERTIES  _BACKTRACE_TRIPLES "C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/tests/CMakeLists.txt;25;add_test;C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/tests/CMakeLists.txt;0;")
add_test("AlgorithmTests" "C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/build/bin/test_algorithms.exe")
set_tests_properties("AlgorithmTests" PROPERTIES  _BACKTRACE_TRIPLES "C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/tests/CMakeLists.txt;26;add_test;C:/Users/Kanishk Sinha/OneDrive/Documents/CampusNav3D/tests/CMakeLists.txt;0;")
subdirs("../catch2")
