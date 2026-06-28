# Lua Scripting

::: tip Are you a non-technical user?
You don't need to write Lua scripts! Get ready-made `.lua` files from [HubCup](https://hubcapmanifest.com/) or [Ryuu](https://generator.ryuu.lol/) — just place them in your `config\lua\` folder. See the [User Guide](/user/getting-started) for details.
:::

OpenSteamTool uses Lua scripts placed in `config\lua\` to control which games to unlock, configure tickets, and manage depot decryption keys. Scripts are automatically loaded and **hot-reloaded** — no Steam restart needed.

## Script Location

Place your `.lua` files in:

```
<Steam>\config\lua\
```

For example:

```
C:\Program Files (x86)\Steam\config\lua\games.lua
```

::: warning
Use `config\lua\`, **not** `config\stplug-in\`. The `stplug-in` folder is for a different system and won't work with OST.
:::

## Hot Reload

Any of the following actions trigger an automatic reload without restarting Steam or toggling offline/online mode:

- Adding a new `.lua` file
- Modifying an existing `.lua` file
- Deleting a `.lua` file
- Overwriting a `.lua` file

## Core Functions

### `addappid(appid [, depotid, depotKey])`

Unlock a game and optionally provide a depot decryption key.

```lua
-- Basic: unlock game with AppID 1361510
addappid(1361510)

-- With depot decryption key
addappid(1361511, 0, "5954562e7f5260400040a818bc29b60b335bb690066ff767e20d145a3b6b4af0")

-- Multiple games
addappid(480)
addappid(730)
addappid(570)
```

### `addtoken(appid, accessToken)`

Add an access token for downloading protected games or DLCs that require authorization.

```lua
addtoken(1361510, "2764735786934684318")
```

### `setManifestid(depotid, manifestGid [, size])`

Pin a specific depot manifest to prevent a game from being updated to a newer version.

```lua
-- Without explicit size
setManifestid(1361511, "5656605350306673283")

-- With explicit size
setManifestid(1361511, "5656605350306673283", 12345678)
```

### `setAppTicket(appid, hexString)`

Write an AppTicket to the credential store. On Windows, this is stored at:

```
HKCU\Software\Valve\Steam\Apps\<AppId>\AppTicket
```

Required for **Denuvo-protected** games. See [DRM & Protection](/guide/drm/denuvo-tickets) for how to extract tickets.

```lua
setAppTicket(1361510, "0100000000000000...")
```

### `setETicket(appid, hexString)`

Write an ETicket to the credential store. Used alongside `setAppTicket` for Denuvo games.

```lua
setETicket(1361510, "0100000000000000...")
```

### `setStat(appid, steamId)`

Configure which SteamID's achievement and stats data to use for a specific app. Useful for enabling achievements on unowned games.

```lua
-- Use a specific SteamID's achievement data
setStat(1361510, "76561197960287930")
```

If not configured, OpenSteamTool will try the [stats API](https://stats.opensteamtool.com/{appid}) when `[stats] enable_api = true` (default), and fall back to a hardcoded preset SteamID (`76561198028121353`).

### `pinApp(appid)`

::: danger Deprecated
`pinApp()` is no longer supported. Use `setManifestid()` instead.
:::

## Upcoming Functions

Functions like `addprocess()`, `forcedenuvo()`, and `seteticketurl()` are in development and tracked in open pull requests. Lua file providers may already be preparing configs that use them.

See the **[Upcoming Features](/guide/upcoming/lua-functions)** page for details on these and related Denuvo fixes.


## Case Insensitivity

All function names are **case-insensitive**. All of the following are equivalent:

```lua
setAppTicket(1361510, "...")
setappticket(1361510, "...")
SetAppticket(1361510, "...")
SETAPPTICKET(1361510, "...")
SETappTicket(1361510, "...")
```

This applies to every registered function (`addappid`, `addtoken`, `setManifestid`, `setStat`, etc.).

## Manifest via Lua

You can override the upstream manifest API by defining a Lua function in your scripts.

### `fetch_manifest_code(gid)`

Basic function that receives only the manifest GID:

```lua
function fetch_manifest_code(gid)
    local body, st = http_get("https://your-api.com/manifest/" .. gid)
    if st == 200 and body then
        return body
    end
    return nil
end
```

### `fetch_manifest_code_ex(app_id, depot_id, gid)` *(recommended)*

Extended function that includes app and depot IDs for more precise API endpoints:

```lua
function fetch_manifest_code_ex(app_id, depot_id, gid)
    local body, st = http_get("https://your-api.com/manifest-code/" .. app_id .. "/" .. gid)
    if st == 200 and body and body:match("^%d+$") then
        return body
    end
    return nil
end
```

### Built-in HTTP Helpers

The C++ runtime provides two Lua helper functions:

| Function | Signature | Returns |
|---|---|---|
| `http_get` | `http_get(url [, headers])` | `body, status_code` |
| `http_post` | `http_post(url, body [, headers])` | `body, status_code` |

`headers` is an optional table in the format `{["Key"]="Value", ...}`.

**Example — trying multiple manifest APIs with fallback:**

```lua
function fetch_manifest_code(gid)
    -- Try wudrm (returns plain-text uint64)
    local body, st = http_get("http://gmrc.wudrm.com/manifest/" .. gid)
    if st == 200 and body then return body end

    -- Fall back to steamrun (returns JSON)
    body, st = http_get("https://manifest.steam.run/api/manifest/" .. gid)
    if st == 200 and body then
        local code = body:match('"content":"(%d+)"')
        if code then return code end
    end
    return nil
end
```

## Multiple Lua Files

You can organize your configuration across multiple `.lua` files. They are all loaded and merged:

```
config\lua\
├── games.lua          -- just addappid() calls
├── tickets.lua        -- setAppTicket / setETicket calls
├── manifest.lua       -- fetch_manifest_code() overrides
└── stats.lua          -- setStat() calls
```

## Additional Lua Directories

You can specify extra Lua directories in `opensteamtool.toml`:

```toml
[lua]
paths = ["D:/my-steam-config/lua"]
```

Files from additional paths are loaded **before** the default `<Steam>/config/lua` folder, so the default folder always takes priority.
priority.

## Having Issues?

Check the **[Troubleshooting & FAQ](/user/troubleshooting/faq)** page for solutions to common problems like license errors, Denuvo issues, and manifest download failures.
