// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ["@/assets/main.css"],
  modules: ["@nuxt/fonts", "@nuxt/icon", "@nuxt/scripts", "@nuxt/ui"],
});
