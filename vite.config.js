import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";

/** 專案建置設定，base: './' 使用相對路徑，適用 GitHub Pages 任意倉庫名稱 */
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar(),
  ],
  base: "./",
});
