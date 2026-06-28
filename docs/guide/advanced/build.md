# Building from Source

::: tip Download Instead
You don't need to build OpenSteamTool. Pre-built binaries are available from the [releases page](https://github.com/OpenSteam001/OpenSteamTool/releases). Only build from source if you want to modify the code or develop features.
:::

## Requirements

- **OS:** Windows 10/11
- **CMake** 3.20+
- **Visual Studio 2022** with MSVC (x64 toolchain)

## Runtime Requirements

- Outbound HTTPS access to `raw.githubusercontent.com` on first launch after a Steam update (for pattern downloading). After the first successful fetch, patterns are cached.

## Quick Build

From the project root directory:

```powershell
build.bat
```

This will compile both Debug and Release configurations.

## Output

After building, you'll find the DLLs in:

| Configuration | Path |
|---|---|
| **Debug** | `build/Debug/OpenSteamTool.dll` |
| | `build/Debug/dwmapi.dll` |
| | `build/Debug/xinput1_4.dll` |
| **Release** | `build/Release/OpenSteamTool.dll` |
| | `build/Release/dwmapi.dll` |
| | `build/Release/xinput1_4.dll` |

## Building Tools

The `extract_tickets` tool is built as part of the main build process. After building, the binary is located at:

```
build/tools/Release/extract_tickets.exe
```

## Project Structure

```
OpenSteamTool/
├── src/
│   ├── dllmain.cpp          -- Entry point
│   ├── dllmain.h
│   ├── Hook/                -- Steam API hooking
│   ├── OSTPlatform/         -- Platform-specific code
│   ├── Pipe/                -- IPC pipe handling
│   ├── Steam/               -- Steam client interaction
│   ├── Utils/               -- Utility functions
│   ├── cmake/               -- CMake configuration
│   ├── dwmapi/              -- dwmapi.dll proxy
│   ├── proto/               -- Protocol buffers
│   └── xinput1_4/           -- xinput1_4.dll proxy
├── tools/
│   ├── extract_tickets/     -- Ticket extraction tool
│   └── ipc_codegen/         -- IPC code generator
├── docs/                    -- Documentation assets
├── build.bat                -- Build script
└── CMakeLists.txt           -- Root CMake configuration
```

## After Building

1. Copy all files from the build output folder to your Steam root directory
2. Create `config/lua/` in the Steam directory
3. Write Lua scripts and launch Steam
