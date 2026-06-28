# Playing Online

If you want to play online (multiplayer) with unlocked games, there are two approaches:

## Method 1: OST Online Fix (Simpler)

OpenSteamTool has a built-in **online fix** feature that enables lobby-based multiplayer for some games. To use it:

1. Right-click the game in your Steam library
2. Select **Properties**
3. Under **Launch Options**, add: `-onlinefix`
4. Launch the game

This works by spoofing Steam's test app (Spacewar) for network features. It works best with games that use Steam lobby matchmaking, but not all games support it.

See the **[Online Fix guide](/guide/online/online-fix)** for full details, limitations, and troubleshooting.

## Method 2: Online-Fix.me (Broader Compatibility)

For games that don't work with the built-in `-onlinefix`, you can download ready-made online patches from [online-fix.me](https://online-fix.me/). This website provides pre-packaged fixes that enable multiplayer for many games.

1. Go to [online-fix.me](https://online-fix.me/)
2. Search for your game
3. Download the online fix
4. Extract the downloaded files
5. Find your game's installation folder:
   - Right-click the game in your Steam library
   - Click **Manage** > **Browse Local Files** (or click the cog icon on the right side, then **Manage** > **Browse Local Files**)
6. Copy the extracted fix files into your game folder, overwriting when prompted
7. Launch the game normally through Steam

::: danger Disclaimer
Online-fix.me is a **third-party website** not affiliated with OpenSteamTool. Only download fixes for games you own or have unlocked through OST. Use at your own risk.
:::

---

See the **[Getting Started guide](/user/getting-started)** if you haven't installed OST yet.
