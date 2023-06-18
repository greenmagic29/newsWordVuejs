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
import { LocalNotifications } from "@capacitor/local-notifications";
import { createConnection, openDB, queryWordByLimit, queryWordCount, insertWord } from "../utils/sqlitedb";
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

    async getLatestWords() {
      try {
        const res = await fetch(`${this.backendPath}/bookmark/latest`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
        });
        const resBody = JSON.parse(await res.text());
        return resBody;
      } catch (error) {
        console.log("🚀 ~ file: mobileRequestNotificationBanner.vue:41 ~ getLatestWords ~ error:", error)
        
      }
    },
    async enableNotification() {
      const backendWords = await this.getLatestWords();
      await createConnection();
      await openDB();
      for (let bdWord of backendWords.row) {
        await insertWord(bdWord.word, bdWord.def.definition)
      }
      

      const words = await queryWordByLimit();
      for (let j = 0; j < 12; j++) {
        const wordString = words[j].word;
        const wordDefString = words[j].definition;
        const hour = j + 9;
        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Reminder of OneNews",
              body: `OneNews: ${wordString}`,
              largeBody: `${wordDefString}`,
              id: 0,
              schedule: {
                allowWhileIdle: true,
                on: {
                  hour: hour,
                  //minute: 8
                },
              },
            },
          ],
        });
      }


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
