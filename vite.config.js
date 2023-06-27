import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dns from "dns";
dns.setDefaultResultOrder("verbatim");

import vuetify from "vite-plugin-vuetify";

export default () => {
  const baseURL =
    process.env.APP_ENV === "development" ? "/" : "/courier_service_frontend/";

  return defineConfig({
    plugins: [vue(), vuetify({ autoImport: true })],

    server: {
      host: "localhost",
      port: 8081,
    },
    base: baseURL,
  });
};

