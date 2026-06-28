# Core Features

## Game & DLC Unlocking

OpenSteamTool can unlock an unlimited number of unowned games and all their DLCs. This is the primary feature, configured through simple Lua scripts.

```lua
addappid(480)    -- Unlock "Spacewar" (Steam's test app)
addappid(730)    -- Unlock "Counter-Strike 2"
addappid(570)    -- Unlock "Dota 2"
```

### Depot Decryption Keys

For games that require depot decryption, you can provide the key directly in the `addappid` call:

```lua
addappid(1361511, 0, "5954562e7f5260400040a818bc29b60b335bb690066ff767e20d145a3b6b4af0")
```

The key is loaded automatically from the Lua config — no separate key file needed.

### Protected Content (Access Tokens)

Some protected games or DLCs require an access token to download. Use `addtoken()`:

```lua
addtoken(1361510, "2764735786934684318")
```

### Manifest Download

OpenSteamTool can automatically download depot manifests via upstream APIs:

| API | URL | Notes |
|---|---|---|
| `opensteamtool` | `https://manifest.opensteamtool.com/{gid}` | Default |
| `steamrun` | `https://manifest.steam.run/api/manifest/{gid}` | Alternative |
| `wudrm` | `http://gmrc.wudrm.com/manifest/{gid}` | Recommended for China users |

Configure the API in `opensteamtool.toml`:

```toml
[manifest]
url = "opensteamtool"
```

### Manifest Binding (Prevent Updates)

Use `setManifestid()` to pin a specific depot manifest, preventing a game from being updated:

```lua
setManifestid(1361511, "5656605350306673283")
setManifestid(1361511, "5656605350306673283", 12345678) -- with explicit size
```

## Hot Reload

One of the most convenient features: you can add, modify, delete, or overwrite `.lua` files in any watched directory and OpenSteamTool automatically reloads them. **No restart needed**, no toggling offline/online mode.

This applies to:
- `<Steam>/config/lua/` (default directory)
- Any additional paths configured in `[lua] paths`
- The `opensteamtool.toml` config file itself

## Denuvo Compatibility

OpenSteamTool supports both **SteamStub-only** games (automatic, no configuration needed) and **Denuvo-protected** games (requires ticket data). As of v1.4.8, most common save-data and SteamID mismatch issues in Denuvo games have been resolved, and **automatic authorization sharing** allows legitimate accounts to share their Denuvo authorization with other OST users.

See the **[Denuvo & Tickets guide](/guide/drm/denuvo-tickets)** for full details.

## Optional DLL Injection

OpenSteamTool supports optional DLL injection into game processes through the `[inject]` configuration section. Supports separate x64 and x86 library paths, with automatic architecture matching. Injection is performed once per detected game process.

See the **[DLL Injection guide](/guide/advanced/injection)** for configuration and use cases.

## Family Sharing Bypass

OpenSteamTool can bypass Steam Family Sharing restrictions for games that have been added to the library with `addappid()`.

::: info
All accounts in the Steam Family that participate in sharing must use OpenSteamTool for this to work.
:::

### Rich Presence

The status shown to your Steam friends (e.g., "Playing Counter-Strike 2"). Normally, Steam won't broadcast the correct game name for unlocked games. OST can spoof it so friends see what you're actually playing instead of just "Online."

#### How it works

OST intercepts the outbound network packet (`CMsgClientGamesPlayed`) and rewrites the game entry to AppID 480 (Spacewar, owned by every account) while preserving the real game title in `game_extra_info`. Steam's server sees 480 as owned and broadcasts the persona state, while friends see the correct title.

#### Current status

- Standard onlinefix games (with `-onlinefix`) already broadcast correctly
- Non-onlinefix Rich Presence broadcasting for unlocked games is pending (PR #144)

## Stats & Achievements

Enable stats and achievements for unowned games. You can configure which SteamID's achievement data to pull:

```lua
setStat(1361510, "76561197960287930")
```

### Priority Order

1. **`setStat(appid, steamid)`** — explicit Lua configuration (highest priority)
2. **Stats API** — `https://stats.opensteamtool.com/{appid}` (when `[stats] enable_api = true`)
3. **Hardcoded preset** — SteamID `76561198028121353` (fallback)

```toml
[stats]
enable_api = true
```

Future:
- Steam Cloud synchronization support (planned, large project)

## Cloud Redirect

::: info Not Yet Released
CloudRedirect integration has been committed to the main repository but is **not yet available in any release**. The configuration options exist in the code but the feature has not been shipped. This section is a preview for developers tracking the repository.
:::

OST supports [CloudRedirect](https://github.com/Selectively11/CloudRedirect) integration for Steam Cloud save redirection on unlocked games. This allows you to sync saves to Google Drive, OneDrive, or a local folder instead of Steam Cloud.

### Enabling

Configure in `opensteamtool.toml`:

```toml
[cloud]
enabled = true
library = "cloud_redirect.dll"
```

When enabled, OST loads `cloud_redirect.dll` inside Steam, registers every `addappid()` game as a redirected app, and routes Steam Cloud RPCs through CloudRedirect's cloud-save engine.

Provider sign-in (Google Drive / OneDrive) is done through CloudRedirect's own companion app — OST only hosts the DLL.

### Requirements

- Download `cloud_redirect.dll` from the [CloudRedirect releases](https://github.com/Selectively11/CloudRedirect/releases) page
- Place it in your Steam root directory (or specify the path in config)
- OST handles loading and app registration automatically
