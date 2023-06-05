import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { Capacitor } from "@capacitor/core";
import {createConnection, openDB, initTable, insertData, queryData} from "./utils/sqlitedb"


const app = createApp(App);

app.use(createPinia());
app.use(router);

app.config.globalProperties.backendPath = `${import.meta.env.VITE_backendPath}`;
app.config.globalProperties.frontendPath = `${
  import.meta.env.VITE_frontendPath
}`;
app.config.globalProperties.isMobile = Capacitor.isNativePlatform();

window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform();

  try {
      console.log(`platform: ${platform}`);

      if(platform === "web") {
        //no need for web
        return;
        // // Create the 'jeep-sqlite' Stencil component
        // const jeepSqliteEl = document.createElement('jeep-sqlite');
        // document.body.appendChild(jeepSqliteEl);
        // await customElements.whenDefined('jeep-sqlite');
        // console.log(`after customElements.whenDefined`)

        // // Initialize the Web store
        // await sqlite.initWebStore();
        // console.log(`after initWebStore`)
      } 
      // here you can initialize some database schema if required

      // example: database creation with standard SQLite statements
      await createConnection();
      await openDB()
      await initTable();
      await insertData();
      await queryData();
      
      //await sqlite.closeConnection("db_vite",false);
      app.mount("#app");
      //createApp(App).mount('#app');
  } catch (err) {
      console.log(`Error: ${err}`);
      throw new Error(`Error: ${err}`)
  }
});




