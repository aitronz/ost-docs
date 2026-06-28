# Denuvo & Tickets

OpenSteamTool has extensive support for games protected by **Denuvo** and **SteamStub** DRM.

## SteamStub-Only Games

For games protected only by SteamStub (no Denuvo), **no AppTicket configuration is needed**. OpenSteamTool can:

- Reuse Steam's local ConfigStore ticket
- Forge the requested AppId through a SteamDRMP off-by-four ticket parsing vulnerability
- Do all of this **without injecting into the game process**

## Denuvo-Protected Games

Denuvo-protected games require explicit ticket data. OpenSteamTool stores `AppTicket` and `ETicket` through the platform credential store.

### ProtectionScan Detection

OST automatically detects Denuvo protection in game executables through a combination of three heuristics:

1. **OEP bytecode pattern** — scans the OEP section of the executable for Denuvo's characteristic code
2. **Legacy DENUVO string** — looks for the literal "DENUVO" ASCII string in known Denuvo sections
3. **Structural RWX section** — detects large (>=4MB) writable+executable sections with entropy >=6.0

If all three miss, the authorization window never opens and the game fails with `88500012`. Known cases include executables smaller than 80MB (skipped by the size floor — fixed in PR #121), and certain Denuvo builds that obfuscate their signatures (addressed in PR #148).

### Forcing Denuvo Detection

A `forcedenuvo(appid)` Lua function is in development to bypass ProtectionScan entirely for games whose executables evade all three detection heuristics. See the **[Upcoming Lua Functions](/guide/upcoming/lua-functions)** page for details.

### Configuring Tickets in Lua

```lua
setAppTicket(1361510, "0100000000000000...")
setETicket(1361510, "0100000000000000...")
```

These functions write the ticket values to the platform credential store. On Windows, this is stored at:

```
HKCU\Software\Valve\Steam\Apps\<AppId>\AppTicket
HKCU\Software\Valve\Steam\Apps\<AppId>\ETicket
```

### Denuvo 30-Minute Validity Window

Denuvo verification has a **30-minute validity window**. After this window expires, authorization may fail with:

**Denuvo error code `88500005`**

If you encounter this error, refresh the ticket data and retry.

### Automatic Denuvo Authorization Sharing

OpenSteamTool supports **Automatic Denuvo Authorization Sharing for Legitimate Accounts**. This allows accounts that genuinely own a game to share their Denuvo authorization with other accounts using OpenSteamTool.

### Ticket Priority

The system uses the following priority when determining which AppTicket to use:

1. **Explicit tickets** (highest priority)
   - Tickets configured via `setAppTicket()`
   - Existing cached `AppTicket` credential values
2. **Forged local ConfigStore ticket** (fallback)
   - OpenSteamTool falls back to forging a ticket from Steam's local ConfigStore

### SteamID Priority

1. Cached `SteamID` (read first)
2. Parsed from explicit `AppTicket` (if no cached SteamID)
3. Windows backend: `HKCU\Software\Valve\Steam\Apps\<AppId>`
4. Linux backend: **not yet implemented**

## Extracting Tickets with `extract_tickets`

The `extract_tickets` tool dumps the `AppTicket` and `ETicket` hex strings you need for `setAppTicket` / `setETicket`.

### Prerequisites

- A machine where Steam is running
- Logged into an account that **owns** the target game
- The `extract_tickets.exe` binary (built from source — see [Building](/guide/advanced/build))

### Usage

```powershell
extract_tickets.exe 1361510
```

Or run without arguments and type the AppId when prompted.

### Output

The tool reads the Steam install path from the registry, loads `steamclient64.dll`, and writes everything into an `<appid>/` folder next to the executable:

| File | Description |
|---|---|
| `appticket.bin` | Raw app ownership ticket (binary) |
| `eticket.bin` | Raw encrypted app ticket (binary) |
| `tickets.txt` | Plain-text summary with hex strings |

### Example Output (`tickets.txt`)

```
appid:1361510
appticket(184 bytes):14000000...
eticket(143 bytes):...
```

A ticket that could not be obtained is reported as `appticket:null` / `eticket:null`.

### Applying the Tickets

Paste the hex strings from `tickets.txt` into your Lua config:

```lua
setAppTicket(1361510, "14000000...")
setETicket(1361510, "...")
```

::: warning Important
Tickets are only valid when extracted from an account that **genuinely owns** the game. Tickets extracted from non-owning accounts will not work.
:::

## Known Issues & Fixes

These open issues affect certain Denuvo titles and are being tracked in pull requests:

| Issue | PR | Description |
|---|---|---|
| **SteamID offset in newer eTickets** | [#128](https://github.com/OpenSteam001/OpenSteamTool/pull/128) | Newer Denuvo games use offset 12 instead of 8 for SteamID in eTickets |
| **ProtectionScan size floor** | [#121](https://github.com/OpenSteam001/OpenSteamTool/pull/121) | Executables under 80MB are skipped by ProtectionScan |
| **Nonce-bound tickets** | [#148](https://github.com/OpenSteam001/OpenSteamTool/pull/148) | Strict titles require per-launch nonce-based tickets via `seteticketurl()` |

See the **[Upcoming Lua Functions](/guide/upcoming/lua-functions)** page for details on the fixes and workarounds being developed for these issues.
issues.

## Having Issues with Denuvo Games?

Check the **[FAQ page](/user/troubleshooting/faq)** for solutions to common Denuvo errors like `88500005` and `88500012`.
