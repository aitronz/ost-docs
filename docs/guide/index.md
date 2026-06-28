# Advanced Guide

::: info Community-Supported Guide
This guide is **community-maintained** and not an official OpenSteamTool resource.
:::

Welcome to the advanced section of the OST documentation. This section covers developer-focused topics, technical details, and configuration reference.

## Getting Started

If you're new to OpenSteamTool, start with the **[User Guide](/user/getting-started)** for installation instructions.

## Download Options

Pre-built binaries are available from the **[GitHub releases page](https://github.com/OpenSteam001/OpenSteamTool/releases)**.

### Release Build

The **Release** build is optimized for everyday use. It is fully functional and does not write detailed logs. Recommended for most users.

| File | Description |
|-----|-------------|
| `OpenSteamTool-x.x.x-Release.zip` | Release build (recommended for daily use) |

### Debug Build

The **Debug** build writes detailed per-module log files to `<Steam>/opensteamtool/`. Useful for troubleshooting issues or understanding what OST is doing under the hood.

| File | Description |
|-----|-------------|
| `OpenSteamTool-x.x.x-Debug.zip` | Debug build with full logging |

### Verifying Downloads

Each release ZIP includes a SHA-256 checksum. Verify the integrity of your download:

```powershell
Get-FileHash OpenSteamTool-x.x.x-Release.zip -Algorithm SHA256
```

Compare the output with the checksum provided on the releases page.

## Building from Source

If you want to modify the code or develop features, see the full **[Building from Source](/guide/advanced/build)** guide. You'll need:

- **Windows 10/11**
- **Visual Studio 2022** with MSVC (x64 toolchain)
- **CMake 3.20+**

```powershell
git clone https://github.com/OpenSteam001/OpenSteamTool.git
cd OpenSteamTool
build.bat
```

## What's in This Section

| Page | Description |
|------|-------------|
| **[Building from Source](/guide/advanced/build)** | Full build instructions, project structure, development workflow |
| **[Lua Scripting API](/guide/lua/api)** | Complete Lua API reference for game configuration |
| **[Configuration (TOML)](/guide/configuration)** | `opensteamtool.toml` reference — manifest APIs, injection, logging |
| **[Core Features](/guide/features)** | Game unlocking, hot reload, Denuvo compatibility, DLL injection, stats |
| **[Denuvo & Tickets](/guide/drm/denuvo-tickets)** | Ticket management, Denuvo authorization, SteamStub bypass |
| **[Online Fix](/guide/online/online-fix)** | Enabling multiplayer with `-onlinefix` |
| **[DLL Injection](/guide/advanced/injection)** | Game-process library injection configuration |
| **[Steam Compatibility](/guide/advanced/steam-compat)** | Pattern system, version compatibility, remote mirrors |
| **[Debug Logging](/guide/advanced/debug-logging)** | Log file reference and troubleshooting |
| **[Upcoming Features](/guide/upcoming/lua-functions)** | In-development Lua functions and features |
