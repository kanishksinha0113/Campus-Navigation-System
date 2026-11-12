@echo off
REM CampusNav3D — Windows build helper
REM Run this from the project root

SET CMAKE_EXE="C:\Program Files\CMake\bin\cmake.exe"
SET MINGW64="C:\msys64\mingw64\bin"
SET BUILD_DIR=build

echo === CampusNav3D Build ===

REM Add MSYS2 MinGW64 to PATH
SET PATH=%MINGW64%;%PATH%

REM Verify tools
%CMAKE_EXE% --version
gcc --version

REM Configure
%CMAKE_EXE% -S . -B %BUILD_DIR% -G "MinGW Makefiles" ^
    -DCMAKE_BUILD_TYPE=Release ^
    -DCMAKE_C_COMPILER=%MINGW64%\gcc.exe ^
    -DCMAKE_CXX_COMPILER=%MINGW64%\g++.exe

IF %ERRORLEVEL% NEQ 0 (
    echo [FAIL] CMake configure failed.
    exit /b 1
)

REM Build
%CMAKE_EXE% --build %BUILD_DIR% --parallel 4

IF %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Build failed.
    exit /b 1
)

echo.
echo === Build Successful! ===
echo Run: %BUILD_DIR%\bin\CampusNav3D.exe
