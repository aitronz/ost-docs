---
layout: home

hero:
  name: "OST Docs"
  text: "OpenSteamTool Documentation"
  tagline: Community documentation for installing, configuring, and extending OpenSteamTool
  image:
    src: /logo-animated.svg
    alt: OpenSteamTool Logo
  actions:
    - theme: brand
      text: User Guide
      link: /user/getting-started
    - theme: alt
      text: Developer Guide
      link: /guide/lua/api
    - theme: alt
      text: View Docs Repo
      link: https://github.com/aitronz/ost-docs

features:
  - title: For Users
    details: Simple installation — download, extract, copy DLLs, get Lua files from trusted sources, and play.
    link: /user/getting-started
  - title: For Developers
    details: Full Lua API reference, TOML configuration, Denuvo ticket management, DLL injection, and building from source.
    link: /guide/lua/api
  - title: Core Unlocks
    details: Unlock unlimited unowned games and all their DLCs with auto depot decryption.
    link: /guide/features
  - title: Denuvo Support
    details: Automatic Denuvo authorization sharing, SteamStub bypass, ticket management.
    link: /guide/drm/denuvo-tickets
  - title: Hot Reload
    details: Add or modify .lua files without restarting Steam — changes take effect instantly.
    link: /guide/lua/api
  - title: Online Fix
    details: Enable 480-based online play in lobby-based games with -onlinefix.
    link: /guide/online/online-fix
---

::: info Community-Supported Guide
This guide is **community-maintained** and not an official OpenSteamTool resource. It is provided as a helpful reference for users and developers. For the official source, visit the [GitHub repository](https://github.com/OpenSteam001/OpenSteamTool).
:::

## What is OpenSteamTool?

**OpenSteamTool (OST)** is an open-source Steam unlock tool that runs as a DLL proxy inside the Steam client process. It hooks into Steam's internal APIs to unlock games and DLCs, handle Denuvo authorization, manage depot decryption keys, and much more — all without modifying game files or injecting into every game process.

### Quick Overview

| Capability | Description |
|---|---|
| **Game Unlocking** | Unlock any number of unowned games and DLCs |
| **Depot Decryption** | Auto-load decryption keys from Lua scripts |
| **Denuvo Support** | Automatic ticket management and authorization sharing |
| **SteamStub Bypass** | Forge AppId tickets without game process injection |
| **Hot Reload** | Lua config changes take effect immediately |
| **Family Sharing** | Bypass sharing restrictions for Lua-configured games |
| **Stats & Achievements** | Enable achievements for unowned games |
| **Online Fix** | `-onlinefix` for lobby-based multiplayer |
| **DLL Injection** | Optional game-process library injection |

### Latest Release

Check the [releases page](https://github.com/OpenSteam001/OpenSteamTool/releases) for the latest version and release notes. Always download the most recent release.
