# Concepts & Glossary

::: tip Read this first
If you're new to OpenSteamTool, **read this page before installing**. Understanding these concepts will help you know exactly what OST does and how it works.
:::

## What is OpenSteamTool?

OpenSteamTool (OST) is a tool that runs **inside Steam** to unlock games you don't own. It does this by intercepting Steam's internal functions — a technique called **hooking** — and telling Steam "this game is okay to play" as if you owned it.

**What OST is NOT:**
- ❌ It's not a cracked game launcher
- ❌ It's not a pirated copy of games
- ❌ It doesn't modify game files
- ❌ It doesn't give you multiplayer access to games that require servers

**How it works at a high level:**
1. OST places special **DLL files** inside your Steam folder
2. When Steam starts, it loads those DLLs without knowing (they act as proxies)
3. The DLLs intercept Steam's internal checks and tell it to unlock specific games
4. You configure which games to unlock through small **Lua script files**
5. Steam downloads the game normally — OST just removes the ownership check

## Before You Install — Foundational Concepts

These are the basic things you need to understand before installing OST.

### Steam Root Directory
The folder where Steam is installed. This is where `steam.exe` lives. Typically `C:\Program Files (x86)\Steam\`. This is where you copy OST's DLL files and where the `config\lua\` folder goes.

### DLL (Dynamic Link Library)
A file containing code that programs can load and use. Windows uses DLLs everywhere to share code between programs. OST provides custom DLLs that Steam loads instead of the real Windows ones.

### Proxy DLL
A DLL that has the same name as a system DLL but forwards most calls to the original while intercepting specific ones. OST uses `dwmapi.dll` and `xinput1_4.dll` as proxy DLLs — Steam loads them instead of the real Windows DLLs, giving OST control without Steam knowing.

### AppID
A unique number that identifies every game on Steam. For example:
- "Counter-Strike 2" is AppID `730`
- "Dota 2" is AppID `570`
- "Spacewar" (Steam's test app) is AppID `480`

You find the AppID in the URL of a Steam store page: `store.steampowered.com/app/730/`.

### Lua
A simple programming language used by OST for configuration. Lua files (`.lua`) are plain text files that tell OST which games to unlock. They look like:

```lua
addappid(730)
addappid(570)
```

You don't need to know how to program — you can download ready-made Lua files from community sources. See the **[Lua Sources guide](/user/lua-sources)** for details.

### Lua Sources
Websites that generate `.lua` configuration files for specific games. They provide the `addappid()` and `addtoken()` calls needed to unlock games. See the **[Lua Sources guide](/user/lua-sources)** for step-by-step instructions, ratings, and download limits.

### DLC (Downloadable Content)
Extra content for a game, like expansion packs, skins, or season passes. Each DLC has its own AppID. OST can unlock DLCs for games you've configured.

## How OST Works — Technical Concepts

These explain the mechanisms OST uses under the hood.

### Hook / Hooking
A programming technique where you intercept a function call to change its behavior. Think of it like tapping a phone line — the call still goes through, but you get to listen and modify what's said. OST hooks into Steam's functions to change what Steam thinks about game ownership.

### DLL Injection
A technique where code is inserted into a running process. While OST's proxy DLLs run inside Steam itself, it also supports optional injection into game processes to provide custom libraries. This is disabled by default and only needed for advanced use cases.

### ConfigStore
Steam's internal database where it stores settings, login data, and cached ownership information. OST can read and manipulate this to bypass certain checks, particularly for SteamStub-protected games.

### SHA-256
A cryptographic hash — essentially a unique fingerprint of a file. OST uses SHA-256 to identify your Steam DLLs (`steamclient64.dll`, `steamui.dll`) and find the correct pattern files for them.

### Pattern / Pattern File
A file that tells OST where to find specific functions in Steam's code. Since Steam updates frequently (sometimes weekly), OST cannot hardcode these locations. Instead, it downloads fresh patterns on each launch from the [steam-monitor](https://github.com/OpenSteam001/steam-monitor) repository. This is why you might see "No pattern found" after a Steam update — it just means the pattern database hasn't caught up yet.

## Configuration — What Goes in Your Lua Files

These are the functions and terms you'll encounter when setting up game unlocks.

### addappid()
The main Lua function you use to tell OST which games to unlock. Example: `addappid(1361510)` unlocks the game with AppID `1361510`. You can also provide a **depot decryption key** in the same call.

### Depot
A "depot" is a chunk of a game's files on Steam. A single game may have multiple depots for different purposes:
- Game files
- DLC files
- Language packs
- Redistributable packages (DirectX, Visual C++, etc.)

OST can unlock and decrypt individual depots. The depot system is why a single `addappid()` call can include a depot ID and a decryption key.

### Decryption Key (Depot Key)
A secret key needed to decrypt a game's depot files after downloading. Some games require this to be provided in the Lua configuration. It looks like a long hex string: `5954562e7f5260400040a818bc29b60b`.

### Access Token
A key that proves you're allowed to download certain protected games or DLCs. Some games require both an AppID and an access token. Configured with `addtoken()` in Lua.

### Manifest
A file that describes what files belong to a specific version of a game on Steam (like a table of contents). OST needs manifest data to know what to download. It gets this from online **manifest APIs**.

### Manifest API
An online service that provides manifest information. OST supports several:
- `opensteamtool` (default) — `https://manifest.opensteamtool.com/{gid}`
- `steamrun` — `https://manifest.steam.run/api/manifest/{gid}`
- `wudrm` — `http://gmrc.wudrm.com/manifest/{gid}` (recommended for China users)

If one doesn't work (e.g., HTTP 403 error), you can switch to another in `opensteamtool.toml`.

### Manifest Binding / Pinning
Locking a game to a specific version so it doesn't update. Useful if a game update breaks something or removes a feature. Done with `setManifestid()` in Lua. The old `pinApp()` function is no longer supported — use `setManifestid()` instead.

### TOML
A configuration file format used by OST's optional `opensteamtool.toml` file. It's designed to be easy to read and edit. Example:

```toml
[manifest]
url = "steamrun"
```

### Hot Reload
The ability to change configuration files while Steam is running, without restarting. When you add, modify, or delete a `.lua` file in `config\lua\` or edit `opensteamtool.toml`, OST detects the change and reloads it immediately.

## DRM & Protected Games

Many commercial games use DRM (Digital Rights Management) to prevent unauthorized copying. OST can handle several types.

### DRM (Digital Rights Management)
Technology that prevents unauthorized use of digital content. Steam itself is a form of DRM. Denuvo and SteamStub are additional DRM layers that some games use on top of Steam.

### SteamStub
An older DRM wrapper that Steam applies to game executables. Think of it as a lock on the game's .exe file. OST can bypass SteamStub without needing any tickets — it forges the ownership data through a technique called the "off-by-four ticket parsing vulnerability." Games protected only by SteamStub usually work with OST out of the box.

### Denuvo
A company that makes anti-tamper / DRM software used by many major game publishers (EA, Ubisoft, SEGA, 2K Games, etc.). Denuvo is more complex than SteamStub and requires special handling:
- **AppTicket and ETicket** data from an account that owns the game
- A **30-minute authorization window** — after that, the check expires and you get error `88500005`
- Sometimes extra Lua configuration for specific games

Alternatively, you can use a **Denuvo crack** (see below) to remove the protection entirely instead of relying on ticket authorization.

### Denuvo Fix (Denuvo Crack)
A set of files from third-party sources (e.g., **voices38**) that **removes Denuvo protection** from a game's executable entirely, bypassing the need for AppTicket/ETicket data and the 30-minute authorization window. Unlike the `.lua` files from Hubcap or Ryuu (which go in `config\lua\`), Denuvo crack files are placed in the **game's installation folder**.

### Ticket (AppTicket and ETicket)
A piece of encrypted data that proves game ownership. When you buy a game on Steam, Steam stores a ticket on your computer. OST can use tickets from accounts that genuinely own a game to unlock it for others.

- **AppTicket** — The main ownership ticket. Configured with `setAppTicket()` in Lua.
- **ETicket (Encrypted Ticket)** — An encrypted version used specifically for Denuvo verification. Configured with `setETicket()` in Lua.

### Credential Store / Windows Registry
Where Windows stores sensitive data like tickets. OST writes `AppTicket` and `ETicket` data here so Steam and Denuvo think the game is owned. On Windows, this is in the Registry at:

```
HKCU\Software\Valve\Steam\Apps\<AppId>
```

### extract_tickets
A tool that comes with OST that dumps AppTicket and ETicket data from a Steam account that genuinely owns a game. You run it on a machine where Steam is logged into an account that owns the game, and it outputs the hex strings you need for your Lua configuration.

## Features

These are optional features OST provides beyond basic game unlocking.

### Online Fix (`-onlinefix`)
A Steam launch option that enables lobby-based multiplayer for unlocked games. It works by spoofing AppID 480 (Spacewar — Steam's test app, which every account "owns") for network features, tricking Steam's matchmaking into working.

**Limitations:**
- Only one game at a time can use `-onlinefix`
- Works with games that use Steam lobby matchmaking
- Results vary depending on the game's networking

See the **[Lua Sources guide](/user/lua-sources)** for quick setup steps and the **[Online Fix guide](/guide/online/online-fix)** for full details.

### Rich Presence
The status shown to your Steam friends (e.g., "Playing Counter-Strike 2"). Normally, Steam won't broadcast the correct game name for unlocked games. OST can spoof it so friends see what you're actually playing instead of just "Online."

### Stats API
An online service (`https://stats.opensteamtool.com/{appid}`) that provides SteamID recommendations for stats and achievements. When you unlock a game, this API helps OST know which SteamID's achievement data to use so you can earn achievements.

### Family Sharing

Steam's feature that lets family members share games. OST can bypass certain Family Sharing restrictions for games configured in Lua, but **all accounts participating in sharing must use OST**.

## Builds & Versions

### Release Build / Release Version
The standard version of OST for everyday use. It's optimized for performance and does not write detailed logs.

### Debug Build / Debug Version
A special version of OST that writes detailed log files to `<Steam>/opensteamtool/`. Useful for troubleshooting when something doesn't work. It's slightly slower but tells you exactly what's happening behind the scenes.

The log level can be controlled in `opensteamtool.toml`:

```toml
[log]
level = "debug"  -- Options: trace, debug, info, warn, error
```

## Common Errors & Terms

### Antivirus False Positive
When your antivirus mistakenly flags a safe program as dangerous. OST's DLL proxy technique can trigger this because it looks similar to what some malware does (injecting DLLs into other processes). The DLLs are safe and fully open source — you can inspect the code on GitHub.

**Fix:** Add your Steam folder to your antivirus exclusion list, or try the Debug build which has different binary signatures.

### HTTP 403 (Forbidden)
An error code from a web server meaning access is denied. OST's manifest API (`manifest.opensteamtool.com`) may return 403 for certain IP addresses (especially datacenter or VPN IPs). You can switch to an alternative API if this happens.

### Unsupported Steam Version
An error that appears when Steam updates to a version OST doesn't recognize yet. The upstream pattern database at `steam-monitor` usually catches up within hours. Just wait and restart Steam later.

### API (Application Programming Interface)
A way for programs to talk to each other over the internet. OST uses several APIs to download game information (manifests, stats, patterns).

## Why This Matters

Understanding these terms helps you:

1. **Install correctly** — Know what files go where and why
2. **Troubleshoot issues** — Understand error messages and what they mean
3. **Stay safe** — Recognize when a source is asking you to do something risky (like running random executables)
4. **Get better help** — Describe problems accurately when asking for support

**Still confused?** That's okay. The [User Guide](/user/getting-started) walks you through installation step by step without needing to understand all of this. Come back to this page when you encounter a term you don't recognize.
