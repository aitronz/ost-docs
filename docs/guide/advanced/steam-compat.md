# Steam Version Compatibility

OpenSteamTool no longer ships byte-pattern signatures inside the DLL. Instead, it dynamically resolves Steam's internal API offsets at runtime using a pattern-matching system.

## How It Works

On each launch, OpenSteamTool:

1. **Computes SHA-256** of `steamclient64.dll` and `steamui.dll` on disk
2. **Looks up** a matching pattern file (TOML) from the upstream tracker
3. **Resolves** function addresses using the pattern data
4. **Applies** the resolved offsets to hook Steam's internal APIs

### Pattern Resolution

Each pattern TOML contains `PatternEntry` records with the following fields:

| Field | Description |
|-------|-------------|
| `name` | Human-readable function name (e.g., "BBuildAndAsyncSendFrame") |
| `rva` | Relative Virtual Address — if provided, the address is calculated by adding this offset to the module base, bypassing the need for a scan |
| `sig` | IDA-style hex byte pattern (e.g., `48 89 ? ? 57 48 81 ? ? ? ? ?`) used as a fallback if the RVA is absent or invalid |

The resolution order is:

1. **RVA lookup** — fastest, direct offset calculation
2. **Signature scan** — sliding-window comparison against the module's memory, with `??` as wildcards for bytes that change between builds

Function names are looked up using **FNV-1a hashing** for efficient map access.

### Error Handling

If a pattern TOML fails to download (e.g., HTTP 404), the module is added to `g_failedModules` and a popup informs the user. If specific functions within a successfully loaded module cannot be found, they're tracked in `g_missingFunctions` and reported after all hooks have attempted to install. OST continues working — only the hooks tied to missing functions are disabled.

## Lookup Order

Every launch, OST checks the following sources in order:

```
GitHub Raw ──> jsDelivr CDN ──> Local Cache
```

### 1. GitHub Raw (Canonical)

```
https://raw.githubusercontent.com/OpenSteam001/steam-monitor/pattern/...
```

This is the primary, canonical source. The repository is [`OpenSteam001/steam-monitor`](https://github.com/OpenSteam001/steam-monitor) (`pattern` branch).

### 2. jsDelivr CDN (Automatic Fallback)

If GitHub raw is unreachable (connection refused, timeout, or 5xx error), OST automatically falls back to the jsDelivr CDN. **No configuration required.**

This is especially useful in regions where `raw.githubusercontent.com` is blocked but jsDelivr is reachable (e.g., mainland China).

### 3. Local Cache (When Offline)

```
<Steam>/opensteamtool/pattern/<subdir>/<sha256>.toml
```

The local cache is used **only** when both remote sources are unreachable. It is overwritten after every successful remote fetch.

## Important Behaviors

| Behavior | Details |
|---|---|
| **Remote check every launch** | OST consults remote mirrors on every launch, so you automatically pick up upstream updates (new signatures, fixes) without clearing any cache |
| **404 stops the chain** | If any mirror returns HTTP 404, the lookup stops immediately — all mirrors serve the same content, so a 404 means the upstream bot hasn't published a TOML for this Steam build yet |
| **Graceful degradation** | If no pattern is found, only the hooks tied to that DLL are disabled. The rest of OST keeps working |
| **Minimal network impact** | Outbound HTTPS request per DLL (~10 KB each), runs on a worker thread — never blocks Steam's loader |

### 404 Fallback Behavior

When a 404 occurs:
1. OST falls back to the local cache (if one exists)
2. Otherwise, a **one-shot popup** appears with:
   - The unmatched DLL name
   - Its SHA-256 hash
   - The expected cache path
   - The upstream URL
3. Only the hooks for that DLL are disabled — OST continues working for everything else

### Manual Cache

You can drop a pattern TOML into the cache directory manually:

```
<Steam>/opensteamtool/pattern/<subdir>/<sha256>.toml
```

The file name **must** be `<sha256>.toml`. The cache fallback will pick it up the next time remote sources are unreachable.

## Using a Custom Mirror

For most users, the built-in **GitHub → jsDelivr** fallback is sufficient. To use a private mirror or intranet server, configure a full URL template in `opensteamtool.toml`:

```toml
[remote]
url_template = "https://your.server/{channel}/{component}/{sha256}.toml"
```

### Template Placeholders

| Placeholder | Description | Current Values |
|---|---|---|
| `{channel}` | Content channel | `pattern`, `ipc` |
| `{component}` | DLL component name | `steamclient64`, `steamui` |
| `{sha256}` | SHA-256 hash of the DLL | Hex string |

### Example: jsDelivr Template

```toml
[remote]
url_template = "https://fast.jsdelivr.net/gh/OpenSteam001/steam-monitor@{channel}/{component}/{sha256}.toml"
```

### Custom Mirror Behavior

- A custom mirror **replaces** the built-in remote sources (GitHub + jsDelivr)
- Local cache fallback **remains available**
- All three placeholders are required in the template

## Runtime Requirements

- **Outbound HTTPS access** to `raw.githubusercontent.com` on first launch after a Steam update
- After the first successful fetch, patterns are cached locally
- Subsequent launches are fast even without network access (cached patterns are used)
cached)

## Having Compatibility Issues?

Check the **[FAQ page](/user/troubleshooting/faq)** for solutions to "Unsupported Steam version" and "No pattern found" errors.
