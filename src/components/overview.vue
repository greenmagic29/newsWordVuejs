<template>
  <div>
    <div class="top-news-container">
      <header class="top-news-container__header">Top News</header>
      <topNewsItem
        v-for="(topNew, index) in topNews"
        :key="index"
        @doc-edit="createParagraphFromNewsEvent"
        :topNew="topNew"
        :newsIndex="index"
        :modes="paragraphModes"
      ></topNewsItem>
    </div>
    <div class="home-container">
      <header class="home-container__header">Paragraph</header>
      <div
        v-for="item in items"
        :key="item"
        class="doc"
        @click="toDocEdit(item)"
      >
        <div class="doc__desc">
          <span class="material-symbols-outlined"> description </span>
          <span :title="item.title" class="doc__title"
            >({{ item.mode_name }}) {{ item.title }}</span
          >
        </div>
        <div style="display: flex; justify-content: center">
          <span class="doc-date">{{ timeFormat(item.modified_on) }}</span>
        </div>
      </div>
    </div>
    <!-- <a class="home-add-btn" @click="createParagraph()">+</a> -->
  </div>
</template>

<script>
import topNewsItem from "./topNewsItem.vue";
import dayjs from 'dayjs';
export default {
  components: { topNewsItem },
  data() {
    return {
      items: [],
      count: 0,
      topNews: [],
      paragraphModes: [],
    };
  },
  methods: {
    async getParagraphs() {
      console.log(
        "🚀 ~ file: home.js:47 ~ getParagraphs ~ getParagraphs starts"
      );
      try {
        const res = await fetch(`${this.backendPath}/paragraph`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
        });
        const result = JSON.parse(await res.text());
        this.items = result.row;
        this.count = result.count;
      } catch (error) {
        console.log("🚀 ~ file: home.js:34 ~ getParagraphs ~ error:", error);
      }
    },
    async getNews() {
      try {
        const res = await fetch(`${this.backendPath}/news/topNews`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
        });
        const result = JSON.parse(await res.text());
        this.topNews = result.topNews;
      } catch (error) {
        console.log("home.js, fail to get the topNews", error);
      }
    },
    async getParagraphModes() {
      try {
        const res = await fetch(`${this.backendPath}/paragraphModes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
        });
        const result = JSON.parse(await res.text());
        this.paragraphModes = result.modes;
      } catch (error) {
        console.log("home.js, fail to get paragraphModes", error);
      }
    },
    async toDocEdit(item) {
      this.$router.push(`/docEdit/${item.id}`);
    },
    async createParagraph() {
      try {
        const res = await fetch(`${this.backendPath}/paragraph`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
        });
        const result = JSON.parse(await res.text());
        console.log("🚀 ~ file: home.js:45 ~ createParagraph ~ result", result);
        await this.toDocEdit(result);
      } catch (error) {}
    },
    async createParagraphFromNewsEvent(result) {
      try {
        await this.toDocEdit(result);
      } catch (error) {
        console.log(
          "🚀 ~ file: home.js:66 ~ createParagraphFromNewsEvent ~ error",
          error
        );
      }
    },
    timeFormat(value) {
      if (!value) return "";
      try {
        const format = "YYYY-MM-DD [at] HH:mm";
        const day = dayjs(value);
        console.log("🚀 ~ file: home.js:55 ~ timeFormat ~ value", value);
        return day.format(format);
      } catch (e) {
        console.log("🚀 ~ file: home.js:63 ~ time ~ e", e);
        return "";
      }
    },
  },
  async mounted() {
    await this.getParagraphModes();
    await this.getNews();
    await this.getParagraphs();
  },
};
</script>

<style scoped>
.top-news-container {
  border-bottom: solid 1px rgba(242, 242, 242, 1);
  background-color: var(--color-background-soft);
}

.top-new-container__news {
  margin: 0.5rem;
  
}

.top-news-container__header {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: var(--color-heading);
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--color-background-soft);
}

.home-container {
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
}
.home-container__header {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: var(--color-heading);
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--color-background-soft);
}
.doc {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
}

.doc__desc {
  display: flex;
  align-items: center;
}
.doc__title {
  width: 16rem;
  white-space: pre-wrap;
  text-align: center;
  flex-grow: 1;
  text-transform: capitalize;
}
.doc-date {
  text-indent: 1.5rem;
  font-size: 1rem;
  text-align: center;
}
</style>
