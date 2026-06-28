# Lua Configuration Sources

OpenSteamTool needs `.lua` files to know which games to unlock. You can get these from two community sources — **no programming required**.

## Recommended Sources

| Source | Rating | Daily Limit | URL | Notes |
|--------|--------|-------------|-----|-------|
| **Hubcap** | ★★★★★ | ~25/day | https://hubcapmanifest.com/ | Most popular, requires Discord login |
| **Ryuu** | ★★★★☆ | ~50/day | https://generator.ryuu.lol/ | Large collection, requires Discord login |

## Hubcap

1. Join the [Hubcap Discord server](https://discord.gg/hubcapsmanifest) if you haven't already
2. Go to [https://hubcapmanifest.com/](https://hubcapmanifest.com/)
3. Click **"Continue with Discord"**, authenticate, then return to the main page
4. Use the search box to find your game by name or Steam App ID

   ![Hubcap search](/ost-docs/images/lua-guides/hubcap-search.png)

5. Click **"Check & Download"** to download the `.lua` file

   ![Hubcap download](/ost-docs/images/lua-guides/hubcap-download.png)

6. Extract the `.lua` file from the downloaded zip file (ignore any other files)
7. Place the `.lua` file in `config\lua\`

## Ryuu

1. Join the [Ryuu Discord server](https://discord.gg/ryuu) if you haven't already
2. Go to [https://generator.ryuu.lol/](https://generator.ryuu.lol/)
3. Click **"Login with Discord"**, authenticate, then return to the main page
4. Make sure the toggle is set to **.lua** mode (to only see `.lua` files) and use the search box to find your game by name or Steam App ID

   ![Ryuu search](/ost-docs/images/lua-guides/ryuu-search.png)

5. Click **"Download"** to download the `.lua` file

   ![Ryuu download](/ost-docs/images/lua-guides/ryuu-download.png)

6. Place the `.lua` file in `config\lua\`

::: warning Only take the .lua file
From the downloaded archive, take **only the `.lua` file**. Do not grab manifest files, executables, installers, or other files. Let OST download everything else it needs on its own.
:::

## Ratings

Configs are rated on how accurate and up-to-date their generated files are.

| Rating | Meaning |
|--------|---------|
| ★★★★★ | Always up-to-date, works immediately, good format |
| ★★★★☆ | Usually up-to-date, minor delays |
| ★★★☆☆ | Sometimes outdated, may need a newer download |
| ★★☆☆☆ | Frequently outdated, multiple attempts needed |
| ★☆☆☆☆ | Broken configs, avoid |

## What a Lua File Looks Like

This is the kind of file you'll get from those sources:

```lua
-- Example game configuration
addappid(1361510)
addappid(1361511, 0, "5954562e7f5260400040a818bc29b60b335bb690066ff767e20d145a3b6b4af0")
addtoken(1361510, "2764735786934684318")
```

You can have multiple `.lua` files in `config\lua\` — one per game or all in one. OST loads them all automatically.
