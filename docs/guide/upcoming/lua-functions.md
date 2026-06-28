# Upcoming Lua Functions

The following Lua functions are in open pull requests and will be available in a future release. Lua file providers may already be preparing configs that use them.

::: info Prerequisites
These functions are **not yet available** in any release. They are tracked in open PRs against the [OpenSteamTool repository](https://github.com/OpenSteam001/OpenSteamTool). Check the PR links below for status updates.
:::

## `addprocess(appid, exeName)`

Maps a specific executable name to an AppID for games launched through third-party launchers (Ubisoft Connect, EA App, etc.) where Steam doesn't inject the AppID into the process environment.

```lua
addappid(315210) -- Suicide Squad: Kill the Justice League
addprocess(315210, "SuicideSquad_KTJL.exe")
```

The executable name is case-insensitive. This is a no-op for games that already resolve via environment variables.

**PR:** [#148](https://github.com/OpenSteam001/OpenSteamTool/pull/148)

## `forcedenuvo(appid)`

Forces Denuvo authorization to engage for a specific AppID, bypassing the ProtectionScan detection. Use this when a Denuvo-protected game fails to launch with error `88500012` because the scanner didn't detect Denuvo in the executable.

```lua
forcedenuvo(315210)
```

The Denuvo authorization window is normally opened only when ProtectionScan detects Denuvo. Some builds evade all three scan heuristics (OEP pattern, legacy DENUVO string, structural RWX section). This function skips the scan entirely.

**PR:** [#148](https://github.com/OpenSteam001/OpenSteamTool/pull/148)

## `seteticketurl(url)`

Configures a backend URL that mints fresh nonce-bound Encrypted App Tickets and App Ownership Tickets on-demand. Required for strict Denuvo titles that pass a per-launch random nonce.

```lua
seteticketurl("http://your-backend/eticket")
```

The backend receives `POST {app_id, nonce(hex)}` and returns `{eticket, appticket}` as JSON. Leave unset (default) for standard Denuvo titles — only needed for titles with strict nonce verification.

**PR:** [#148](https://github.com/OpenSteam001/OpenSteamTool/pull/148)

## Related Issues

| Issue / PR | Description | Status |
|---|---|---|
| [#148](https://github.com/OpenSteam001/OpenSteamTool/pull/148) | Adds `addprocess()`, `forcedenuvo()`, and `seteticketurl()` Lua functions | Open |
| [#121](https://github.com/OpenSteam001/OpenSteamTool/pull/121) | Fixes ProtectionScan size floor — exempts the main executable from the 80MB size threshold so smaller Denuvo executables are scanned properly | Open |
| [#128](https://github.com/OpenSteam001/OpenSteamTool/pull/128) | Fixes SteamID offset in newer eTickets — newer Denuvo games use offset 12 instead of 8 for the SteamID field | Open |
Open |

## Back to Main Pages

- [Lua Scripting API](/guide/lua/api) — core stable API
- [DRM & Tickets](/guide/drm/denuvo-tickets) — current Denuvo ticket management
