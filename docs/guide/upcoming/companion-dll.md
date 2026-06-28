# Companion DLL: OnlineFix

::: danger Early / Unfinished Implementation
The companion DLL feature is **still in early development**. The `[[inject]]` array syntax is part of a draft pull request (PR #146) that has not been merged. The OnlineFix companion DLL itself must be built from source with no pre-built releases available. This page is provided for developers who want to experiment with the feature.

This page is located in the **Upcoming Features** section for a reason — expect breaking changes and incomplete functionality.
:::

For games whose matchmaking runs outside Steam (e.g., Epic Online Services, custom P2P networking), the built-in `-onlinefix` alone may not be sufficient. The [OnlineFix](https://github.com/Ran-Mewo/OnlineFix) companion DLL (by [@Ran-Mewo](https://github.com/Ran-Mewo/OnlineFix)) fills this gap.

## What It Does

While OST's built-in `-onlinefix` spoofs AppID 480 at the Steam client level (enabling Steamworks lobby matchmaking), some games handle matchmaking in-process without going through Steam APIs. The OnlineFix companion DLL is injected directly into the game process to intercept and redirect those calls.

## How to Use

1. **Build** `OnlineFix.dll` from source (see build instructions below). No pre-built releases are published yet.
2. **Place** the DLL in your Steam root directory
3. **Configure** in `opensteamtool.toml`:

```toml
[[inject]]
path = "OnlineFix.dll"
when_cmdline = "-onlinefix"
```

4. **Launch** the game with `-onlinefix` in its Steam launch options

::: info Note
The `[[inject]]` array syntax is part of a pending pull request (PR #146) and is still in draft. See [Upcoming Features](/guide/upcoming/injection-rules) for details.
:::

## Build Instructions

The OnlineFix repo requires:

- **CMake** 3.20+
- **Visual Studio 2022** (MSVC x64) — Windows primary build
- Or **mingw-w64** (`x86_64-w64-mingw32-*`) for cross-compilation on Linux/macOS

```powershell
cmake -B build -A x64
cmake --build build --config Release
```

Output: `build/Release/OnlineFix.dll`

## Relationship to Built-in Online Fix

| Layer | What it handles |
|---|---|
| **OST built-in** | Steam client level — AppID 480 spoofing for Steamworks P2P |
| **OnlineFix DLL** | Process level — in-game matchmaking that bypasses Steam (EOS, custom P2P, etc.) |

Most games will work with the built-in feature alone. The companion DLL is only needed for titles whose multiplayer implementation does not use Steam APIs.

## Related Pages

- [Online Fix](/guide/online/online-fix) — the built-in `-onlinefix` feature
- [Upcoming Features](/guide/upcoming/injection-rules) — `[[inject]]` array syntax and online fix improvements
