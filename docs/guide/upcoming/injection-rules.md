# Upcoming: Per-DLL Injection Rules

A new `[[inject]]` array syntax is in development ([PR #146](https://github.com/OpenSteam001/OpenSteamTool/pull/146) — Draft) that allows injecting arbitrary DLLs into game processes based on command-line conditions. Unlike the flat `[inject]` section which configures a single game hook library, this lets you define multiple injection rules, each targeting a different DLL.

::: info Status
This feature is **still in draft** and not yet available in any release. Once merged, it will be fully documented on the main [DLL Injection](/guide/advanced/injection) page.
:::

## Configuration

```toml
[[inject]]
path = "OnlineFix.dll"
when_cmdline = "-onlinefix"
```

| Key | Type | Description |
|---|---|---|
| `path` | string | Path to the DLL (relative to Steam root or absolute) |
| `when_cmdline` | string | Only inject when the game's command line contains this string |

## OnlineFix Companion DLL

The [OnlineFix](https://github.com/Ran-Mewo/OnlineFix) companion DLL is a real-world example of this injection API in action. It fixes online play for games whose matchmaking runs outside Steam.

See the **[Companion DLL (Early)](/guide/upcoming/companion-dll)** page for full details on usage, build instructions, and how it relates to the built-in `-onlinefix` feature.

## OnlineFix for Owned Games (PR #146)

The same pending PR also adds the ability to use `-onlinefix` even when you own the game. This is useful when you want to queue with friends who are using `-onlinefix` for the same title.

Currently, if you own a game and try to use `-onlinefix`, the owned-game check prevents it from engaging. The PR changes this behaviour so owned games can also participate in `-onlinefix` lobbies.

## OnlineFix Achievements (PR #54 — Work in Progress)

Another PR fixes achievement support for games launched with `-onlinefix`. Currently, achievements are processed against AppID 480 (Spacewar) instead of the actual game. This PR scopes achievement calls to the configured game app while keeping multiplayer traffic on 480.

**PR:** [#54](https://github.com/OpenSteam001/OpenSteamTool/pull/54)
#54)

## Back to Main Pages

- [DLL Injection](/guide/advanced/injection) — current injection API (`[inject]` section)
- [Online Fix](/guide/online/online-fix) — current `-onlinefix` feature
