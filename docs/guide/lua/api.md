# Lua Scripting

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

Unlock a game and optionally provide a depot decryption key. This is the primary function for telling OST which games to unlock.

```lua
-- Basic: unlock game with AppID 1361510 (no depot key)
addappid(1361510)

-- With depot decryption key (third argument)
addappid(1361511, 0, "5954562e7f5260400040a818bc29b60b335bb690066ff767e20d145a3b6b4af0")

-- Multiple games
addappid(480)
addappid(730)
addappid(570)
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `appid` | integer | Steam AppID or depot ID. Used for both ownership tracking and depot key lookup. |
| `depotid` | integer | **Currently unused** — reserved parameter. Pass `0`. |
| `depotKey` | string (optional) | 64-character hex AES-256 depot decryption key. Required for most games. |

#### Do I Need a Depot Key?

OST does not fetch keys from Steam's servers automatically — it only injects keys you explicitly provide. **Most games require a depot key**. See the **[Depot Keys & Steam Downloads](/guide/advanced/depot-keys)** guide for a full technical deep-dive into Steam's encryption, preloads, and how OST handles decryption.

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

You can override the upstream manifest API by defining a Lua function in your scripts. When Steam needs a manifest request code, the C++ runtime checks for these Lua callbacks **before** falling back to the configured HTTP provider.

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

#### ⚠️ Important: 64-Bit Precision

Manifest request codes and GIDs are **64-bit unsigned integers**. Standard Lua uses double-precision floats for numbers, which can only represent integers up to 2⁵³ (~9 quadrillion) accurately. Values above this threshold will silently lose precision if returned as a `number`.

**Always return manifest codes as strings** containing decimal digits:

```lua
-- ✅ Correct: return as string
function fetch_manifest_code(gid)
    local body, st = http_get("https://your-api.com/manifest/" .. gid)
    if st == 200 and body then
        return tostring(body)  -- ensure it's a string
    end
    return nil
end
```

The C++ runtime uses a custom `ParseUInt64Decimal` helper (backed by `std::stoull`) to safely convert the returned string back to a `uint64_t`.

### Built-in HTTP Helpers

The C++ runtime provides two Lua helper functions backed by the `WinHttp` utility:

| Function | Signature | Returns |
|---|---|---|
| `http_get` | `http_get(url [, headers])` | `body, status_code` |
| `http_post` | `http_post(url, body [, headers])` | `body, status_code` |

`headers` is an optional table in the format `{["Key"]="Value", ...}`. The Lua table is converted to Windows HTTP headers via a `LuaHeadersToWstr` helper that constructs `Key: Value\r\n` pairs.

**Example — trying multiple manifest APIs with fallback:**

```lua
function fetch_manifest_code(gid)
    -- Try wudrm (returns plain-text uint64)
    local body, st = http_get("http://gmrc.wudrm.com/manifest/" .. gid)
    if st == 200 and body then return tostring(body) end

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
