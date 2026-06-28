import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
    defineConfig({
        base: "/ost-docs/",

        title: "OST Docs",
        description:
            "OpenSteamTool documentation — community guide and developer reference",

        head: [
            [
                "style",
                {},
                `
                    .mermaid {
                        display: flex;
                        justify-content: center;
                    }
                `,
            ],
        ],

        themeConfig: {
            // https://vitepress.dev/reference/default-theme-config
            logo: {
                light: "/logo-animated.svg",
                dark: "/logo-animated.svg",
                alt: "OST Logo",
            },
            siteTitle: "OST Docs",
            nav: [
                { text: "Home", link: "/" },
                { text: "User Guide", link: "/user/getting-started" },
                { text: "Advanced Guide", link: "/guide/" },
                {
                    text: "Docs Repo",
                    link: "https://github.com/aitronz/ost-docs",
                },
                {
                    text: "OST Repo",
                    link: "https://github.com/OpenSteam001/OpenSteamTool",
                },
            ],

            sidebar: [
                {
                    text: "User Guide",
                    items: [
                        {
                            text: "Getting Started",
                            link: "/user/getting-started",
                        },
                        {
                            text: "Concepts & Glossary",
                            link: "/user/concepts",
                        },
                        {
                            text: "Troubleshooting & FAQ",
                            link: "/user/troubleshooting/faq",
                        },
                        {
                            text: "Lua Sources",
                            link: "/user/lua-sources",
                        },
                        {
                            text: "Playing Online",
                            link: "/user/online-play",
                        },
                    ],
                },
                {
                    text: "Advanced Guide",
                    items: [
                        {
                            text: "Overview",
                            link: "/guide/",
                        },

                        {
                            text: "Lua Scripting API",
                            link: "/guide/lua/api",
                        },
                        {
                            text: "Configuration (TOML)",
                            link: "/guide/configuration",
                        },
                        {
                            text: "Core Features",
                            link: "/guide/features",
                        },
                        {
                            text: "Denuvo & Tickets",
                            link: "/guide/drm/denuvo-tickets",
                        },
                        {
                            text: "Online Play",
                            collapsed: true,
                            items: [
                                {
                                    text: "Online Fix",
                                    link: "/guide/online/online-fix",
                                },
                            ],
                        },
                        {
                            text: "Advanced Topics",
                            collapsed: true,
                            items: [
                                {
                                    text: "Building from Source",
                                    link: "/guide/advanced/build",
                                },
                                {
                                    text: "DLL Injection",
                                    link: "/guide/advanced/injection",
                                },
                                {
                                    text: "Steam Compatibility",
                                    link: "/guide/advanced/steam-compat",
                                },
                                {
                                    text: "Debug Logging",
                                    link: "/guide/advanced/debug-logging",
                                },
                            ],
                        },
                        {
                            text: "Upcoming Features",
                            collapsed: true,
                            items: [
                                {
                                    text: "Lua Functions in Dev",
                                    link: "/guide/upcoming/lua-functions",
                                },
                                {
                                    text: "Companion DLL (Early)",
                                    link: "/guide/upcoming/companion-dll",
                                },
                                {
                                    text: "Injection & Online Improvements",
                                    link: "/guide/upcoming/injection-rules",
                                },
                            ],
                        },
                    ],
                },
            ],

            socialLinks: [
                {
                    icon: "github",
                    link: "https://github.com/aitronz/ost-docs",
                },
            ],

            footer: {
                message:
                    "OpenSteamTool is provided for research and educational purposes only.",
                copyright: "MIT License",
            },
        },
    }),
);
