# Building from Source

::: tip Download Instead
You don't need to build OpenSteamTool. Pre-built binaries are available from the [releases page](https://github.com/OpenSteam001/OpenSteamTool/releases). Only build from source if you want to modify the code or develop features.
:::

## Prerequisites

- **OS:** Windows 10/11 (64-bit)
- **Visual Studio 2022** with the **Desktop development with C++** workload (MSVC x64 toolchain)
- **CMake** 3.20+ (the `build.bat` script auto-detects Ninja or falls back to Visual Studio)

### Verifying Your Setup

```powershell
# Check CMake version
cmake --version

# Check Visual Studio (should list 2022)
"%ProgramFiles%\Microsoft Visual Studio\Installer\vswhere.exe" -latest -property catalog_productLineVersion

# Check MSVC compiler
cl
```

## Getting the Source

Clone the repository recursively (the build fetches dependencies via CMake FetchContent, so no submodules are needed):

```powershell
git clone https://github.com/OpenSteam001/OpenSteamTool.git
cd OpenSteamTool
```

## Quick Build

From the project root:

```powershell
build.bat
```

This builds both **Debug** and **Release** configurations. The first build takes longer because CMake downloads and compiles dependencies (Lua, Protobuf, spdlog, tomlplusplus, Microsoft Detours).

### What build.bat Does

1. Detects the best CMake generator — **Ninja Multi-Config** (if `ninja` is on PATH) or **Visual Studio 17 2022**
2. Configures the project: `cmake -S src -B build`
3. Builds both configurations: `cmake --build build --config Release` then `--config Debug`
4. Builds the `extract_tickets` tool for each configuration

### Building Only One Configuration

```powershell
set CONFIGS=Release
build.bat
```

Or manually:

```powershell
cmake -S src -B build
cmake --build build --config Release
cmake --build build --config Release --target extract_tickets
```

## Output

After building, the DLLs are in:

| Configuration | Path |
|---|---|
| **Debug** | `build/Debug/OpenSteamTool.dll` |
| | `build/Debug/dwmapi.dll` |
| | `build/Debug/xinput1_4.dll` |
| **Release** | `build/Release/OpenSteamTool.dll` |
| | `build/Release/dwmapi.dll` |
| | `build/Release/xinput1_4.dll` |

The `extract_tickets` tool lands separately at `build/tools/Release/extract_tickets.exe` (it's marked `EXCLUDE_FROM_ALL` so it doesn't pollute the main output directory).

## Installing a Custom Build

1. **Close Steam** fully (system tray → Exit)
2. Copy `OpenSteamTool.dll`, `dwmapi.dll`, and `xinput1_4.dll` from your build output into your Steam root directory (where `steam.exe` lives)
3. Create `config\lua\` inside the Steam directory if it doesn't exist
4. Launch Steam — your build runs automatically

To revert to an official release, just replace those three DLLs with the ones from the release ZIP.

## Project Structure

```
OpenSteamTool/
├── src/
│   ├── CMakeLists.txt           -- Top-level CMake build definition
│   ├── dllmain.cpp              -- DLL entry point (DllMain)
│   ├── Hook/                    -- Steam API hook modules (one per subsystem)
│   ├── OSTPlatform/             -- OS-specific backends (Windows registry, processes)
│   ├── Pipe/                    -- Inter-process communication with Steam
│   │   └── Features/            -- Self-contained features (Denuvo auth, injection)
│   ├── Steam/                   -- Steam client interface definitions (IPC messages)
│   ├── Utils/                   -- Shared utilities
│   │   ├── Config/              -- TOML config loader, Lua config loader, file watchers
│   │   ├── Logging/             -- Per-module debug logging
│   │   ├── SteamMetadata/       -- Pattern downloading, manifest fetching, diagnostics
│   │   └── Tickets/             -- AppTicket parsing
│   ├── cmake/                   -- CMake dependency recipes (FindLua.cmake, etc.)
│   ├── dwmapi/                  -- dwmapi.dll proxy loader
│   ├── proto/                   -- Protocol Buffer definitions (Steam messages)
│   └── xinput1_4/               -- xinput1_4.dll proxy loader
├── tools/
│   ├── extract_tickets/         -- Ticket dumper (run on an account that owns the game)
│   └── ipc_codegen/             -- IPC message struct code generator
├── build.bat                    -- One-click build script
├── opensteamtool.example.toml   -- Example config with all options documented
└── docs/                        -- Project assets (logos)
```

### Key Source Directories

| Directory | Purpose |
|---|---|
| `Hook/` | Contains one file per Steam subsystem being hooked (IPC, net packets, decryption keys, manifests, packages, SteamUI, etc.) |
| `Pipe/` | Manages the named-pipe handshake between OST and Steam processes. Features that run inside the game process (Denuvo authorization, library injection) live under `Pipe/Features/` |
| `OSTPlatform/` | Abstracts platform-specific operations: Windows Registry access, process enumeration, remote memory operations |
| `Utils/Config/` | Parses `opensteamtool.toml` and `.lua` files, watches them for changes (hot reload) |
| `Utils/SteamMetadata/` | Downloads pattern files from `steam-monitor`, fetches manifests, and reports Steam diagnostics |
| `dwmapi/` and `xinput1_4/` | Small proxy DLLs that Steam loads instead of the real Windows DLLs. They locate and load `OpenSteamTool.dll` |

## Build System Internals

### Static MSVC Runtime

The project enforces the **static MSVC runtime** (`/MT` for Release, `/MTd` for Debug) via `CMAKE_MSVC_RUNTIME_LIBRARY`. This is set before any dependencies are included so they inherit the same configuration. This ensures `OpenSteamTool.dll` has **no external runtime dependencies** — it works on any Windows 10/11 system without requiring specific MSVC Redistributables.

### FetchCache Mechanism

Dependencies are managed via CMake's `FetchContent` and cached locally in `<repo>/.deps/`. A custom `FetchCache.cmake` module:

1. Checks if a dependency source directory already exists in `.deps/`
2. If so, sets `FETCHCONTENT_SOURCE_DIR_<NAME>` to bypass download and subbuild
3. Sets `FETCHCONTENT_UPDATES_DISCONNECTED` to `ON` after the initial populate

To clean and re-fetch all dependencies, delete the `.deps/` directory and rebuild.

### Protobuf Dual-Variant Strategy

OpenSteamTool generates **two different** sets of C++ classes from the same `steam_messages.proto` file:

| Variant | Build | Protoc Flag | Linked Library | Features |
|---------|-------|-------------|----------------|----------|
| **Full** | Debug | `--cpp_out` | `libprotobuf` | `DebugString()`, reflection, descriptors |
| **Lite** | Release | `--cpp_out=lite:` | `libprotobuf-lite` | Smaller binary, no reflection |

This significantly reduces the Release DLL footprint while keeping full debugging capability in the Debug build.

### IPC Code Generation

The project includes a host-side `ipc_codegen` tool (in `tools/ipc_codegen/`) that parses `IPCMessages.steamd` to generate C++ structures for the IPC hook layer. It runs automatically during the CMake build. Output is isolated to a per-config directory (`${CMAKE_CURRENT_BINARY_DIR}/generated/$<CONFIG>`) to prevent conflicts between Debug and Release builds in multi-config generators.

### Log Macro Generation

The `LogMacros.cmake` script reads the X-macro registry in `ost_log_modules.h` and auto-generates `LOG_<MODULE>_LEVEL(...)` macros. This ensures adding a new log module only requires a single line change in the registry.

## Development Workflow

### Edit-Compile-Test Loop

1. Edit source files in `src/`
2. Run `build.bat` (builds both configs) or `cmake --build build --config Debug` (faster)
3. Copy the three DLLs to your Steam folder
4. Launch Steam and test
5. Check `<Steam>\opensteamtool\*.log` for debug output (Debug build only)

### Debug Build vs Release Build

| | Debug | Release |
|---|---|---|
| **Logging** | Full per-module logging to `<Steam>/opensteamtool/*.log` | Logging compiled out (no-ops) |
| **Protobuf** | Links full `libprotobuf` | Links `libprotobuf-lite` (smaller) |
| **Optimization** | None (easier to step through) | Full optimizations |
| **Use case** | Development, troubleshooting | Daily use |

### Using the Debug Build

The Debug build writes detailed logs. Set the log level in `opensteamtool.toml`:

```toml
[log]
level = "debug"  # Options: trace, debug, info, warn, error
```

See the **[Debug Logging guide](/guide/advanced/debug-logging)** for a full list of log files and what each one contains.

### Dependency Management

Dependencies are fetched automatically by CMake's **FetchContent** and cached in `<repo-root>/.deps/`:

| Dependency | Used for |
|---|---|
| **Lua** (5.4) | Lua config loading and execution |
| **Protobuf** | Steam message serialization/deserialization |
| **spdlog** | Debug logging (Debug build only) |
| **tomlplusplus** | TOML config parsing |
| **Microsoft Detours** | API hooking (not directly fetched — included in-source) |

To clean and re-fetch dependencies, delete the `.deps/` directory and rebuild.

## Building Tools

### extract_tickets

Built automatically by `build.bat`. The binary ends up at:

```
build/tools/Release/extract_tickets.exe
```

Run it on a machine where Steam is logged into an account that **owns** the target game:

```powershell
extract_tickets.exe 1361510
```

Output is written to an `<appid>/` folder next to the executable. See the **[extract_tickets](#)** section for full usage.

### IPC Code Generator

The `ipc_codegen` tool generates C++ structs from IPC message definitions (`IPCMessages.steamd`). It runs automatically during the CMake build — you only need to interact with it if you're modifying the IPC protocol.

## Troubleshooting Build Issues

### CMake fails with "Could not find compiler"

Make sure you ran **Developer Command Prompt for VS 2022** or have run `vcvarsall.bat x64` before building. The `build.bat` script can also be run from a regular PowerShell if Visual Studio is detected via `vswhere`.

### FetchContent fails to download dependencies

- Check your internet connection
- If behind a proxy, configure `HTTP_PROXY` and `HTTPS_PROXY` environment variables
- Delete `.deps/` and try again — corrupted cache can cause failures

### Linker errors (LNK2019/LNK2001)

- Clean and rebuild: delete `build/` and `.deps/`, then run `build.bat` again
- Make sure you're using the x64 toolchain (the project does not support x86 builds)

### "No pattern found" after building

Your custom build still needs to download pattern files from `steam-monitor` for your Steam version. This is normal — it happens on every first launch after a Steam update regardless of whether you built from source or used a release.
