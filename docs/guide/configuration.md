# Configuration File (TOML)

OpenSteamTool supports an optional `opensteamtool.toml` configuration file for advanced settings. If no file is found, built-in defaults are used.

## Location

Place the file in your Steam root directory (next to `steam.exe`):

```
C:\Program Files (x86)\Steam\opensteamtool.toml
```

## Getting Started

Start with the example file included in the release:

1. Download `opensteamtool.example.toml` from the [GitHub repository](https://github.com/OpenSteam001/OpenSteamTool/blob/main/opensteamtool.example.toml)
2. Rename it to `opensteamtool.toml`
3. Place it in your Steam root directory

The file is **watched** while Steam is running — valid changes are hot-reloaded without restarting Steam.

## Full Reference

```toml
[log]
# Log verbosity for all log files (Debug build only).
# Valid: trace, debug, info, warn, error
level = "info"

[manifest]
# Which upstream API to query for depot manifest request codes.
#   "opensteamtool" → https://manifest.opensteamtool.com/{gid}   (default)
#   "wudrm"         → http://gmrc.wudrm.com/manifest/{gid} (recommended for China users)
#   "steamrun"      → https://manifest.steam.run/api/manifest/{gid}
# If a Lua script defines fetch_manifest_code() or
# fetch_manifest_code_ex(), those take priority over this setting.
url = "opensteamtool"

# HTTP timeouts for manifest requests (milliseconds)
timeout_resolve_ms = 5000
timeout_connect_ms = 5000
timeout_send_ms    = 10000
timeout_recv_ms    = 10000

[stats]
# Query https://stats.opensteamtool.com/{appid} when no Lua setStat override exists.
# Priority: setStat > stats API (when enabled and valid) > hardcoded preset SteamID.
enable_api = true

[lua]
# Additional Lua config directories (optional).
# Files are loaded after the default <Steam>/config/lua folder.
# The default folder is always loaded last so user files take priority.
# paths = ["D:/my-steam-config/lua"]

[inject]
# Optional DLL injection into game processes.
# The injected library must match the target process architecture.
enabled = false
# library_x64 = "OpenSteamTool.GameHook.x64.dll"
# library_x86 = "OpenSteamTool.GameHook.x86.dll"

[cloud]
# Optional Steam Cloud save redirection for unlocked ("lua") games,
# powered by CloudRedirect (https://github.com/Selectively11/CloudRedirect).
# When enabled, OpenSteamTool loads cloud_redirect.dll, registers every
# addappid() game as a redirected app, and routes Steam Cloud RPCs through
# CloudRedirect's cloud-save engine.
# Provider sign-in is done through CloudRedirect's own companion app.
enabled = false
# library = "cloud_redirect.dll"

[remote]
# Optional metadata mirror. Leave unset to use GitHub with jsDelivr CDN fallback.
# A custom mirror replaces the built-in remote sources and must include all
# three placeholders: {channel}, {component}, and {sha256}.
# url_template = "https://your.server/{channel}/{component}/{sha256}.toml"
```

## Section Details

### `[log]`

Controls logging verbosity. **Only effective in Debug builds.** The Release build has logging compiled out.

| Key | Type | Default | Description |
|---|---|---|---|
| `level` | string | `"info"` | Log level: `trace`, `debug`, `info`, `warn`, `error` |

### `[manifest]`

Controls how depot manifest request codes are obtained.

| Key | Type | Default | Description |
|---|---|---|---|
| `url` | string | `"opensteamtool"` | Upstream API: `"opensteamtool"`, `"steamrun"`, or `"wudrm"` |
| `timeout_resolve_ms` | integer | `5000` | DNS resolution timeout |
| `timeout_connect_ms` | integer | `5000` | TCP connection timeout |
| `timeout_send_ms` | integer | `10000` | Request send timeout |
| `timeout_recv_ms` | integer | `10000` | Response receive timeout |

#### Logic Precedence

The `url` setting is a **fallback**. The `ManifestClient::FetchManifestRequestCode` function first checks if a Lua callback (`fetch_manifest_code_ex` or `fetch_manifest_code`) is defined in your scripts. If Lua returns a valid code, the upstream URL is ignored entirely.

### `[stats]`

Controls the stats/achievements API.

| Key | Type | Default | Description |
|---|---|---|---|
| `enable_api` | boolean | `true` | Query `https://stats.opensteamtool.com/{appid}` for SteamID recommendations |

### `[lua]`

| Key | Type | Default | Description |
|---|---|---|---|
| `paths` | string[] | `[]` | Additional Lua config directories loaded before the default folder |

### `[inject]`

Controls optional DLL injection into game processes.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Enable game-process injection |
| `library_x64` | string | — | Path to x64 library (absolute or relative to Steam root) |
| `library_x86` | string | — | Path to x86 library (absolute or relative to Steam root) |

See [Advanced Topics](/guide/advanced/injection) for details on the current API, and the [Upcoming Features](/guide/upcoming/injection-rules) page for the new `[[inject]]` array syntax in development.

### `[cloud]`

Controls Steam Cloud save redirection via CloudRedirect.

::: info Not Yet Released
CloudRedirect integration has been committed to the main repository but is **not yet available in any release**. These config keys exist in the code but have not been shipped.
:::

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | boolean | `false` | Enable CloudRedirect integration |
| `library` | string | `"cloud_redirect.dll"` | Path to `cloud_redirect.dll` |

### `[remote]`

Controls the pattern/IPC metadata mirror for Steam compatibility.

| Key | Type | Default | Description |
|---|---|---|---|
| `url_template` | string | — | Custom mirror URL with `{channel}`, `{component}`, `{sha256}` placeholders |

See [Advanced Topics](/guide/advanced/steam-compat) for details.
