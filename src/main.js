import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { Capacitor } from "@capacitor/core";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.config.globalProperties.backendPath = `${import.meta.env.VITE_backendPath}`;
app.config.globalProperties.frontendPath = `${
  import.meta.env.VITE_frontendPath
}`;
app.config.globalProperties.isMobile = Capacitor.isNativePlatform()
app.mount("#app");
