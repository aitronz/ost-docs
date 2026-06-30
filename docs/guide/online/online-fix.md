# Online Fix

The **Online Fix** feature enables 480-based online play in games that use lobby matchmaking, allowing multiplayer functionality for unlocked games.

## How It Works

When enabled, OpenSteamTool spoofs the AppId to `480` (Spacewar — Steam's test app used for Steamworks P2P networking) for network communication, enabling lobby-based matchmaking features.

### Why Some Games Work and Others Don't

`-onlinefix` works by intercepting game traffic at the **Steam client level** — it only affects calls that go through Steam's own networking APIs (Steamworks P2P / Steam lobbies). If a game's multiplayer runs through those APIs, spoofing AppID 480 is enough to enable online play.

However, many modern games use **external matchmaking services** that bypass Steam entirely:

- **EOS (Epic Online Services)** — Epic Games' multiplayer framework. Games using EOS for matchmaking, friends lists, or lobbies communicate directly with Epic's servers, not Steam's. `-onlinefix` cannot intercept this traffic because it never touches Steam APIs.
- **Custom dedicated servers** — Games that run their own server infrastructure (e.g., Ubisoft, EA, Rockstar titles) handle matchmaking outside Steam entirely.
- **Third-party P2P layers** — Some games implement their own peer-to-peer networking that doesn't use Steamworks at all.

For these games, a **companion DLL** injected directly into the game process can intercept and redirect the external matchmaking calls. A companion DLL implementation is in development as an upcoming feature.

## Enabling

Add `-onlinefix` to Steam's launch parameters for the target game:

1. Right-click the game in your Steam library
2. Select **Properties**
3. Under **Launch Options**, add:

```
-onlinefix
```

4. Launch the game

## Limitations

| Limitation | Description |
|---|---|
| **Single game only** | Only **one** game using `-onlinefix` can run at a time |
| **Steam lobby only** | Only works with games that use Steam lobby matchmaking (Steamworks P2P). Games using **EOS (Epic Online Services)**, dedicated servers, or custom P2P networking are **not** supported |
| **Not all games** | Even among Steamworks titles, results vary — some implement networking in non-standard ways |
| **Owned games** | If you own a game but want to queue with someone using `-onlinefix`, the current build may not enable online fix for owned games. A future update (PR #146) will fix this |

## Disabling

Simply remove `-onlinefix` from the launch parameters. Online play returns to normal on the next launch.

## Example

For a game with AppId `1361510`, the Steam launch parameters would look like:

```
-onlinefix %command%
```

This tells Steam to pass `-onlinefix` to the game process, which OST intercepts to apply the online fix.

## Technical Details

### How It Works

The OnlineFix intercepts two network packet hooks to enable multiplayer:

1. **`CMsgClientGamesPlayed` Patching (Outgoing)** — When OST detects the `-onlinefix` flag, it hooks the `BBuildAndAsyncSendFrame` function and intercepts `CMsgClientGamesPlayed` (eMsg 1003) packets. It clears the `games_played` list, preventing Steam from reporting the actual game being played to its servers. This is required for certain multiplayer bypasses.

2. **AppID 480 Spoofing** — For network packets related to Steam lobby matchmaking, the AppId is spoofed to 480 (Spacewar, owned by every account) while preserving the real game title in metadata. This allows Steamworks P2P networking to function for otherwise unowned titles.

### Limitations

- Only affects **Steamworks API calls** (lobbies, P2P networking)
- Games using EOS, dedicated servers, or custom P2P layers bypass Steam entirely and cannot be intercepted at this level
- A future **Companion DLL** (injected directly into game processes) will extend support to in-process matchmaking services

## Upcoming Improvements

A new `[[inject]]` array syntax is in development ([PR #146](https://github.com/OpenSteam001/OpenSteamTool/pull/146) — Draft) that enables injecting an **OnlineFix companion DLL** directly into game processes. This handles in-process matchmaking that bypasses Steam, complementing the built-in `-onlinefix` feature.

Other improvements in development:
- **OnlineFix for owned games** — allows using `-onlinefix` even when you own the game (useful for queuing with friends)
- **OnlineFix achievements** — scopes achievement calls to the actual game instead of AppID 480 (PR #54)

See the **[Companion DLL (Early)](/guide/upcoming/companion-dll)** and **[Upcoming Injection Rules](/guide/upcoming/injection-rules)** pages for details.

## Alternative: Online-Fix.me

For games that don't work with the built-in `-onlinefix` or the companion DLL, pre-packaged online patches are available at [online-fix.me](https://online-fix.me/). These are standalone fixes that you extract directly into your game folder — no OST configuration needed.

See the **[Playing Online guide](/user/online-play)** for step-by-step instructions.

## Community Tips

- Both players need `-onlinefix` for most lobby-based multiplayer games to work together
> The `-onlinefix` flag is only useful for games that use **Steam lobby matchmaking** (Steamworks P2P networking). Games using **EOS (Epic Online Services)**, dedicated servers, or custom P2P will **not** work — their networking bypasses Steam entirely
- If a game doesn't work with `-onlinefix`, try a pre-packaged fix from [online-fix.me](https://online-fix.me/) or check the upcoming [Companion DLL](/guide/upcoming/companion-dll) feature
