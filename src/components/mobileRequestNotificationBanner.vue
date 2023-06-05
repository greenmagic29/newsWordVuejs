<template>
  <section
    class="webpush-banner__section"
    id="webpush-banner__section"
    v-if="show"
  >
    <p class="webpush-banner__p">
      Want to receive reminder everyday? Allow notification in your browser.
    </p>
    <footer class="webpush-banner__footer">
      <a @click="hideWebpuhsBanner">Cancel</a>
      <a @click="enableNotification">Confirm</a>
    </footer>
  </section>
</template>

<script>
import { LocalNotifications } from '@capacitor/local-notifications'
import {createConnection, openDB, initTable, insertData, queryData} from "../utils/sqlitedb"
export default {
  data() {
    return {
      show: true,
    };
  },

  methods: {
    hideWebpuhsBanner() {
      this.show = false;
    },
    async enableNotification() {
      await createConnection();
      await openDB()
      const words = await queryData();
      const wordString = words.map(word => {
        return `${word.word}`
      }).join(", ")
      const wordDefString = words.map(word => {
        return `${word.word}: ${word.definition}`
      }).join(", ")
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Reminder of OneNews",
            body: `OneNews: ${wordString}`,
            largeBody: `${wordDefString}`,
            id: 0,
            schedule:{
              allowWhileIdle: true,
              on: {
                //hour: 10
                minute: 8
              },
              
            }

          }
        ]
      }

      )
      this.show = false;
    },
  },
};
</script>
<style scoped>
.webpush-banner__section {
  display: flex;
  position: fixed;
  bottom: 0;
  background-color: var(--color-background-mute);
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  /* height: 17%; */
  left: 0;
z-index: 3;
  /* scroll-behavior: auto; */
}

.webpush-banner__p {
  padding: 1rem;
}

.webpush-banner__footer {
  align-self: end;
  margin: 1rem;

  margin-top: 0;
}
</style>
