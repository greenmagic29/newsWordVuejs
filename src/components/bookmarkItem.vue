<template>
  <div>
    <div class="bookmark-dialog__word-container">
      <span class="bookmark-dialog__word">{{ bookmark.word }}</span>
      <span class="material-symbols-outlined" @click="speak(bookmark.word)">
        headphones
      </span>
      <span class="material-symbols-outlined" @click="getTranslateDetails()">
        zoom_in
      </span>
    </div>
    <ul class="meaning__translate" v-if="openedTranslate && translateDetails">
      <li
        style="
          list-style-position: inside;
          border-top: 1px solid #80808054;
          margin: 1rem;
        "
      >
        <span>{{ translateDetails.phonetic }}</span>
        <p>{{ translateDetails.definition }}</p>
        <p>{{ translateDetails.translation }}</p>

        <p v-for="exch in translateDetails.exchange">
          {{ exch }}
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
import textToVoice from "../utils/textToVoice.js";
export default {
  props: {
    bookmark: {
      type: Object,
      default: () => {
        word: "";
      },
    },
  },
  data() {
    return { count: 0, openedTranslate: false, translateDetails: null };
  },
  methods: {
    async speak(word) {
      try {
        await textToVoice(word);
      } catch (error) {
        console.log("🚀 ~ file: bookmarkItem.js:18 ~ speak ~ error:", error);
      }
    },
    async getTranslateDetails() {
      //if it is closed and no translate details, get the defination
      if (this.openedTranslate === false && this.translateDetails === null) {
        await this.getDefination();
      }
      this.openedTranslate = !this.openedTranslate;
    },
    async getDefination() {
      try {
        const res = await fetch(`${this.backendPath}/word?text=${this.word}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
        });
        const resBody = JSON.parse(await res.text());
        this.translateDetails = resBody.def;
      } catch (error) {
        console.log(
          "🚀 ~ file: bookmarkItem.js:43 ~ getDefination ~ error:",
          error
        );
      }
    },
  },
  computed: {
    word() {
      if (this.bookmark.word) {
        return this.bookmark.word;
      }
    },
  },
};
</script>

<style scoped>
.bookmark-dialog__word-container {
  display: flex;
  position: sticky;
  top: 0;

}
.bookmark-dialog__word {
  flex-grow: 1;
}
</style>
