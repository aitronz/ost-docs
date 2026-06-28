import { h, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import mediumZoom from "medium-zoom";
import "./custom.css";

export default {
    extends: DefaultTheme,
    Layout: () => h(DefaultTheme.Layout, null, {}),
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
