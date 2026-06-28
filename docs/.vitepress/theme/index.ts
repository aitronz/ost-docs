import { h, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import mediumZoom from "medium-zoom";
import {
    NolebaseEnhancedReadabilitiesMenu,
    NolebaseEnhancedReadabilitiesScreenMenu,
} from "@nolebase/vitepress-plugin-enhanced-readabilities/client";
import "@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css";
import "./custom.css";

export default {
    extends: DefaultTheme,
    Layout: () =>
        h(DefaultTheme.Layout, null, {
            "nav-bar-content-after": () => h(NolebaseEnhancedReadabilitiesMenu),
            "nav-screen-content-after": () =>
                h(NolebaseEnhancedReadabilitiesScreenMenu),
        }),
    enhanceApp() {},
    setup() {
        const route = useRoute();
        const initZoom = () => {
            mediumZoom(".vp-doc img", {
                background: "var(--vp-c-bg)",
            });
        };
        onMounted(() => initZoom());
        watch(
            () => route.path,
            () => nextTick(() => initZoom()),
        );
    },
};
