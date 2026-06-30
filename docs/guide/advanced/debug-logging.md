# Debug Logging

Debug builds of OpenSteamTool write detailed per-module log files under `<Steam>/opensteamtool/`. These are invaluable for troubleshooting.

::: info Zero-Cost in Release Builds
Logging is **completely compiled out** in Release builds — all logging macros are stubbed to `((void)0)` via preprocessor guards. This means zero runtime overhead for everyday use. Only the Debug variant writes log files.
:::

## Enabling Debug Logging

Download the **Debug** variant of the release (e.g. `OpenSteamTool-x.x.x-Debug.zip`).

Then copy the DLLs as usual. The log level is controlled by `[log] level` in `opensteamtool.toml`:

```toml
[log]
level = "debug"
```

Valid levels: `trace`, `debug`, `info`, `warn`, `error`

## Log File Reference

All logs are written to `<Steam>/opensteamtool/`:

| File | Source | Content |
|---|---|---|
| `main.log` | General | Init, config loading, Lua parsing, utilities |
| `ipc.log` | `LOG_IPC_*` | IPC commands, InterfaceCall dispatch, spoofing |
| `netpacket.log` | `LOG_NETPACKET_*` | Network packet send/recv, eMsg dispatch |
| `manifest.log` | `LOG_MANIFEST_*` | Manifest download, `fetch_manifest_code`, manifest binding |
| `decryptionkey.log` | `LOG_DECRYPTIONKEY_*` | Depot decryption key injection |
| `keyvalue.log` | `LOG_KEYVALUE_*` | KeyValues patching (manifest binding) |
| `misc.log` | `LOG_MISC_*` | Engine pointer capture, AppId hints |
| `achievement.log` | `LOG_ACHIEVEMENT_*` | UserStats requests/responses, steamid spoofing |
| `pics.log` | `LOG_PICS_*` | PICS access token injection |
| `package.log` | `LOG_PACKAGE_*` | Package injection, FileWatcher events |
| `onlinefix.log` | `LOG_ONLINEFIX_*` | Online fix (480 AppId spoofing) |
| `richpresence.log` | `LOG_RICHPRESENCE_*` | Rich Presence packet construction and injection |
| `winhttp.log` | `LOG_WINHTTP_*` | HTTP requests for manifest codes via WinHttp |
| `steamui.log` | `LOG_STEAMUI_*` | SteamUI hook diagnostics |
| `pipe.log` | `LOG_PIPE_*` | Pipe handshakes, process inspection, Denuvo authorization, library injection |
| `platform.log` | `LOG_PLATFORM_*` | Platform helper diagnostics, remote-process operations |

## Common Issues & Solutions

### OST doesn't seem to load

1. Verify the DLL files are in the Steam root directory
2. Check that `config/lua/` exists (not `config/stplug-in/`)
3. Try the Debug build and check `main.log` for initialization errors
4. Make sure you're launching Steam normally (not as administrator unless needed)

### Games not appearing in library

1. Check your Lua scripts are in the correct directory
2. Verify the AppIds are correct
3. Check `main.log` for Lua parsing errors
4. Try adding a simple `print()` or test value in your Lua script

### Denuvo error 88500005

The 30-minute Denuvo authorization window has expired. Refresh your ticket data and restart the game.

### "No pattern found" popup on launch

This means the upstream `steam-monitor` bot hasn't published patterns for your Steam build yet. This typically resolves automatically within a few hours of a Steam client update.

### Manifest download failures

1. Check your internet connection
2. Try a different manifest API (`steamrun` or `wudrm`)
3. Configure HTTP timeouts in `opensteamtool.toml` if downloads are slow
4. Check `manifest.log` for specific error codes

### Game crashes on launch

1. Disable DLL injection if enabled (`[inject] enabled = false`)
2. Try without `-onlinefix` if using the online fix
3. Check `pipe.log` for Denuvo authorization issues
4. Verify your tickets are from an account that owns the game
game

## Still Having Issues?

Check the **[FAQ page](/user/troubleshooting/faq)** for solutions to common problems, or visit the [GitHub issues](https://github.com/OpenSteam001/OpenSteamTool/issues) for known bugs and feature requests.
