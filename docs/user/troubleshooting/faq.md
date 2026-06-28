# FAQ — Frequently Asked Questions

::: info Community-Supported Guide
This guide is **community-maintained** and not an official OpenSteamTool resource.
:::

Common issues organized by category. If you don't find your issue here, check the [GitHub issues](https://github.com/OpenSteam001/OpenSteamTool/issues) or the [Debug Logging](/guide/advanced/debug-logging) guide.

## Installation Issues

### Antivirus is blocking OpenSteamTool

OpenSteamTool uses DLL proxy techniques that may trigger **false positives** from antivirus software.

**Solutions:**

1. **Add an exception** — Add your Steam folder (`C:\Program Files (x86)\Steam\`) to your antivirus exclusion list
2. **Try the Debug build** — Download the Debug variant of the release — the debug build has different binary signatures and may bypass overly aggressive heuristics
3. **Verify the source** — OST is fully open source on [GitHub](https://github.com/OpenSteam001/OpenSteamTool). You can inspect the code or build it yourself

After making changes, re-extract all files from the release ZIP and copy them again.

### OST doesn't seem to load / games still show as owned

1. Verify that the DLL files (`dwmapi.dll`, `xinput1_4.dll`, `OpenSteamTool.dll`) are in your **Steam root directory** (where `steam.exe` is)
2. Check that your `.lua` files are in `config\lua\` — **not** `config\stplug-in\`
3. **Close Steam completely** (Exit from system tray) and relaunch
4. Try the Debug build and check `main.log` in `<Steam>/opensteamtool/` for errors
5. Make sure you're launching Steam normally (not as Administrator — unless required)

### Play button shows "Purchase" instead of "Play"

If the button in your Steam Library says **Purchase** for a game you configured with a `.lua` file, it means OpenSteamTool is not loaded. This is most commonly caused by antivirus software removing or quarantining the DLL files.

**Fix:**

1. Check your antivirus quarantine — restore any OST DLLs that were removed (`dwmapi.dll`, `xinput1_4.dll`, `OpenSteamTool.dll`)
2. Add your Steam folder (`C:\Program Files (x86)\Steam\`) to your antivirus exclusion list
3. Re-extract all files from the OST release ZIP into your Steam folder
4. Close and reopen Steam

See [Antivirus is blocking OpenSteamTool](#antivirus-is-blocking-opensteamtool) for more detailed steps.

### Steam crashes immediately after launching

This is rare but can happen if the DLLs are corrupted or incompatible with your Steam version.

1. Remove the OST DLLs (`dwmapi.dll`, `xinput1_4.dll`, `OpenSteamTool.dll`) from your Steam folder
2. Launch Steam — it should work normally
3. Download a fresh copy of the OST release ZIP
4. Re-extract and re-copy the files


## Game Launch Issues

### Ubisoft games fail to launch (click "Start Game" but nothing happens)

Some Ubisoft titles (e.g., Assassin's Creed Shadows) may not launch properly — clicking "Start Game" briefly reverts without launching.

**Check:**
- Verify the `.lua` file contains correct depot IDs and decryption keys for the specific game version
- Try closing Steam fully and relaunching
- If the issue persists, check the GitHub issues for known Ubisoft-specific workarounds

### Denuvo error 88500005

Denuvo verification has a **30-minute validity window**. After that, the ticket expires and Denuvo throws this error.

**Fix:**

1. Close the game
2. Get fresh AppTicket and ETicket data (download a new `.lua` file from HubCup or Ryuu)
3. Try launching again

If the issue persists, the game may need extra Lua configuration (like `forcedenuvo` or `addprocess`) — the Lua file provider typically handles this.

### Denuvo error 88500012 / 88500051

These errors mean the Denuvo authorization path never engaged — usually because:
- The protection scan didn't detect Denuvo in the game's executable
- The game is launched through a third-party launcher (env-less)
- A fresh per-launch nonce-based ticket is required

This is handled by the Lua file provider. Get an updated `.lua` file from your source. If the issue persists on multiple sources, check the [GitHub issues](https://github.com/OpenSteam001/OpenSteamTool/issues).

### Denuvo error E12 on launch

Some Denuvo titles (NBA 2K26, F1 24, and other recent 2K Games titles) may report an E12 error when launching.

**Possible causes:**
- The game is launched through a third-party launcher that doesn't pass Steam environment variables
- ProtectionScan fails to detect the Denuvo protection in the executable
- A fresh per-launch nonce-based ticket is required for strict Denuvo titles

**Fix:**
1. Get an updated `.lua` file from your source with fresh ticket data
2. Check if the game's executable has known issues with ProtectionScan (the `.exe` may be too small or obfuscated)
3. This error is actively being worked on — check GitHub for the latest fixes

These errors are being addressed in PR #148 (adds `addprocess()`, `forcedenuvo()`, and `seteticketurl()` Lua functions) — once merged, Lua file providers will update their configs accordingly.

### Application load error 5:0000065434

Some older SteamStub-protected games (like **Fallout: New Vegas**) may need manual SteamStub removal. This is game-specific and not something OpenSteamTool can fix.

**Check:**
- The Lua file provider's notes for the specific game
- Whether the game has been reported on the [GitHub issues](https://github.com/OpenSteam001/OpenSteamTool/issues)

### Game crashes on launch

1. Disable DLL injection if you have it enabled — set `[inject] enabled = false` in `opensteamtool.toml`
2. Remove `-onlinefix` from launch options if you're using it
3. Check if the game uses Denuvo — you may need refreshed tickets
4. Try the Debug build and check `pipe.log` for Denuvo authorization issues

### I own a legitimate copy of a game, but OST is interfering

If you own a Denuvo-protected game and OST is interfering with your legitimate copy:

1. Remove the `.lua` files for that specific game from `config\lua\`
2. If issues persist, temporarily remove the OST DLLs when playing your owned games
3. You can have separate Steam shortcuts with/without OST by keeping copies of the DLLs elsewhere


## Steam Compatibility Issues

### "Unsupported Steam version" error

Your Steam client updated to a version that OpenSteamTool doesn't have patterns for yet.

**Options (in order of recommendation):**

1. **Wait** — The upstream `steam-monitor` bot usually publishes patterns within hours of a Steam update. Just restart Steam later and it should work.
2. **Check for a new OST release** — A newer version may already support your Steam build
3. **Downgrade Steam** (advanced, not recommended) — waiting is far easier

### "No pattern found" popup on launch

This means the upstream pattern database hasn't been updated for your Steam build yet.

- This typically **resolves automatically within a few hours** of a Steam client update
- The game should still launch — only some advanced hooks may be temporarily disabled
- No action needed on your part; just wait and try again later

### OST worked before but stopped after a Steam update

Steam auto-updates can break compatibility temporarily. This is normal.

1. The upstream `steam-monitor` bot detects the new Steam version and publishes patterns
2. Restart Steam — OST downloads the new patterns on launch
3. If it still doesn't work after a few hours, check for a new OST release


## Download Issues

### License error / "application load error" after placing .lua file

A license error usually means Steam hasn't picked up the new configuration yet.

**Fix:**

1. **Close Steam** fully (Exit from system tray — not just minimize)
2. Open your `config\lua\` folder and confirm the `.lua` file is there
3. **Launch Steam again**
4. Try downloading / launching the game in your Library

This refreshes Steam's license cache. If it still doesn't work, try getting a fresh `.lua` file from a different source.

### Game shows in library but won't install / download

1. Make sure your `.lua` file is in the correct folder: `config\lua\` (not `config\stplug-in\`)
2. **Close Steam** fully and reopen it
3. If still not working, try a fresh `.lua` file from a different source (HubCup vs Ryuu)
4. Check if the manifest API is blocked (see [Download Issues](#download-issues) below)

### Manifest download fails / "no internet" / HTTP 403

If downloads fail, the default manifest API (`manifest.opensteamtool.com`) may be:
- Blocked in your region
- Returning 403 for your IP range (datacenter/VPN IPs are sometimes blocked)
- Temporarily down

**Fix — Switch manifest API:**

Create or edit `opensteamtool.toml` in your Steam root directory:

```toml
[manifest]
url = "steamrun"
```

Other options:
- `"wudrm"` — Recommended for users in China
- `"opensteamtool"` — The default, try switching back later

### Game downloads are very slow

1. Configure HTTP timeouts in `opensteamtool.toml` if the connection is unstable:

```toml
[manifest]
timeout_recv_ms = 30000
timeout_connect_ms = 10000
```

2. Try a different manifest API (`steamrun` or `wudrm`)

### Games don't decrypt in Offline Mode

After downloading games in Online mode, switching Steam to Offline Mode may prevent the games from decrypting and launching.

**Fix:** Run Steam in Online mode when launching unlocked games. OST needs to communicate with manifest APIs and Steam's servers for depot decryption. This is a known limitation (issue #137).

### Download starts but never finishes / gets stuck

1. Check your internet connection
2. Try pausing and resuming the download in Steam
3. Switch to a different manifest API (see above)
4. Check `manifest.log` (Debug build) for specific error codes

### "Content still encrypted" error on Workshop downloads

When trying to download Workshop items, Steam may report the content is still encrypted or fails to create the Workshop folder.

**What's happening:** OST's Workshop support for certain games is still being refined. The depots decrypt correctly, but Workshop file routing may not complete for all titles.

**Workaround:**
- Check if the game has a specific Workshop Lua config from your source
- Some games with heavy Workshop reliance may have incomplete support
- This is a known area for improvement (tracked in issues #126, #110, #151)

### Changing setManifestid doesn't take effect until Steam restart

If you modify `setManifestid()` in a `.lua` file to pin or unpin a game version, the change may not apply until you fully restart Steam.

While OST supports hot reload for most Lua changes, manifest binding updates sometimes require a full Steam restart (`[package]` cache is not invalidated on hot reload).

Simply close Steam (Exit from system tray), then relaunch.

## Lua File Issues

### Where do I get .lua files?

You don't need to write them yourself. Use trusted community sources:

| Source | URL | Notes |
|---|---|---|
| **HubCup** | https://hubcapmanifest.com/ | Most popular, ~25 daily downloads |
| **Ryuu** | https://generator.ryuu.lol/ | Large collection, ~50 daily downloads |

Only take the `.lua` file from the download. **Do not** run any executables, installers, or tools that may be included.

### Can I have multiple .lua files?

Yes! You can have multiple `.lua` files in `config\lua\`. OST loads all of them. You can organize them by game, by type (games, tickets, stats), or any way you like.

### Do I need to restart Steam after changing .lua files?

**No** — OpenSteamTool supports **hot reload**. Just save the `.lua` file and changes take effect immediately. No restart needed.

### The .lua file from one source doesn't work — should I try another?

Yes. Different sources may have different configurations, ticket data, or manifest IDs. If one source's file doesn't work, try the other.

### Can I use a Lua file from one source with tickets from another?

Yes. Lua files are just text files — you can merge content from different sources. For example, use one source's game unlock config and another's ticket data. Just ensure you're not duplicating `addappid()` calls for the same game.


## Need More Help?

- **Debug Logging** — See the [Debug Logging guide](/guide/advanced/debug-logging) for how to enable detailed logs
- **GitHub Issues** — Search or report issues at [github.com/OpenSteam001/OpenSteamTool/issues](https://github.com/OpenSteam001/OpenSteamTool/issues)
- **Developer Guide** — For advanced configuration and Lua scripting, check the [Developer Guide](/guide/lua/api)
