# DLL Injection

OpenSteamTool supports optional DLL injection into game processes. This is configured through the `[inject]` section of `opensteamtool.toml`.

## Configuration

```toml
[inject]
enabled = true
library_x64 = "OpenSteamTool.GameHook.x64.dll"
library_x86 = "OpenSteamTool.GameHook.x86.dll"
```

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Enable game-process injection |
| `library_x64` | string | — | Path to the x64 library to inject |
| `library_x86` | string | — | Path to the x86 library to inject |

### Path Resolution

Paths can be:
- **Absolute paths** — e.g. `C:\Tools\myhook_x64.dll`
- **Relative paths** — resolved from the Steam root directory (where `steam.exe` lives)

### Architecture Matching

The injection system automatically matches the target process architecture:
- x64 games get the `library_x64` DLL
- x86 (32-bit) games get the `library_x86` DLL

### Injection Behavior

- Injection is performed **once per detected game process**
- The DLL is injected when the game process starts
- Only one injection per process lifetime

## Use Cases

Possible uses for game-process injection include:

- Custom rendering overlays
- Input hooks
- Performance monitoring
- Game-specific patches
- Debugging tools

## Security Considerations

- Only inject DLLs from sources you trust
- Verify the integrity of any DLL you plan to inject
- Some anti-cheat systems may flag injected DLLs
- Game-process injection may violate terms of service for some games

## Example: Minimal Setup

```toml
[inject]
enabled = true
library_x64 = "OpenSteamTool.GameHook.x64.dll"
library_x86 = "OpenSteamTool.GameHook.x86.dll"
```

Place the DLL files in the Steam root directory alongside `opensteamtool.toml`.

## Upcoming Features

A new `[[inject]]` array syntax is in development ([PR #146](https://github.com/OpenSteam001/OpenSteamTool/pull/146) — Draft) that supports injecting arbitrary DLLs with per-rule command-line conditions. This also enables the **OnlineFix companion DLL** for games whose matchmaking runs outside Steam.

See the **[Upcoming Injection Rules](/guide/upcoming/injection-rules)** page for details.
