# OST Docs

Community-maintained documentation for [OpenSteamTool (OST)](https://github.com/OpenSteam001/OpenSteamTool) — the open-source Steam unlock tool.

## Structure

```
docs/
├── index.md                       # Home page
├── user/
│   ├── getting-started.md         # User installation guide
│   ├── concepts.md                # Glossary of terms
│   └── troubleshooting/
│       └── faq.md                 # FAQ
└── guide/
    ├── lua/api.md                 # Lua scripting API reference
    ├── configuration.md           # TOML config reference
    ├── features.md                # Core features
    ├── drm/denuvo-tickets.md      # Denuvo, SteamStub, tickets
    ├── online/
    │   └── online-fix.md          # -onlinefix feature
    ├── advanced/
    │   ├── injection.md           # DLL injection
    │   ├── steam-compat.md        # Steam version compatibility
    │   ├── debug-logging.md       # Debug logging reference
    │   └── build.md               # Building from source
    └── upcoming/
        ├── lua-functions.md       # addprocess, forcedenuvo, seteticketurl
        ├── companion-dll.md       # OnlineFix companion DLL (early)
        └── injection-rules.md     # Per-DLL injection rules
```

## Development

This site is built with [VitePress 2](https://vitepress.dev/).

```bash
npm install   # or: pnpm install
npm run docs:dev    # dev server at http://localhost:5173
npm run docs:build  # static build to docs/.vitepress/dist
npm run docs:preview
```

## Content Sections

- **User Guide** — Non-technical installation walkthrough, trusted Lua sources (HubCup, Ryuu), online play methods, and a concepts glossary
- **Developer Guide** — Full Lua API, TOML configuration, Denuvo ticket management, DLL injection, online fix, Steam compatibility, and building from source
- **Upcoming Features** — Early documentation for unmerged PRs and in-development features

## License

This documentation project is provided under the MIT License. OpenSteamTool itself is also MIT-licensed.
