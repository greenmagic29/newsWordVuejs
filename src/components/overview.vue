<template>
  <div>
    <div class="top-news-container">
      <header class="top-news-container__header">Top News</header>
      <topNewsItem v-for="(topNew, index) in topNews" :key="index" @doc-edit="createParagraphFromNewsEvent" :topNew="topNew" :newsIndex="index" :modes="paragraphModes"></topNewsItem>
    </div>
    <div class="home-container">
      <header class="home-container__header">Paragraph</header>
      <div v-for="item in items" :key="item" class="doc" @click="toDocEdit(item)">
        <div class="doc__desc">
          <span class="material-symbols-outlined">
            description
          </span>
          <span :title="item.title" class="doc__title">({{ item.mode_name }}) {{ item.title }}</span>
        </div>
        <div style="display: flex; justify-content: center;">
          <span class="doc-date">{{ timeFormat(item.modified_on) }}</span>
  
        </div>
      </div>
    </div>
    <a class="home-add-btn" @click="createParagraph()">+</a>
  </div>
  </template>

  <script>

import topNewsItem from "./topNewsItem.vue";
export default {
  components:{topNewsItem},
  data() {
    return { 
      items: [
 
    
    ],
      count: 0,
      topNews: [],
      paragraphModes: []
    }
    
  },
  methods: {
    async getParagraphs() {
      console.log("🚀 ~ file: home.js:47 ~ getParagraphs ~ getParagraphs starts")
      try {
        const res = await fetch(`${this.backendPath}/paragraph`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('login')
          },
        });
        const result = JSON.parse(await res.text());
        this.items = result.row;
        this.count = result.count;
        
      }
      catch(error) {
        console.log("🚀 ~ file: home.js:34 ~ getParagraphs ~ error:", error)
        
      }
    },
    async getNews() {
      try {
        const res = await fetch(`${this.backendPath}/news/topNews`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('login')
          },
        });
        const result = JSON.parse(await res.text());
        this.topNews = result.topNews
      }
      catch(error) {
        console.log("home.js, fail to get the topNews", error)
        
      }
    },
    async getParagraphModes() {
      try {
        const res = await fetch(`${this.backendPath}/paragraphModes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('login')
          },
        });
        const result = JSON.parse(await res.text());
        this.paragraphModes = result.modes
      } catch (error) {
        console.log("home.js, fail to get paragraphModes", error)
      }
    },
    async toDocEdit(item) {
      this.$router.push(`/docEdit/${item.id}`)
    },
    async createParagraph() {
      try {
        const res = await fetch(`${this.backendPath}/paragraph`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': localStorage.getItem('login')
          },
        });
        const result = JSON.parse(await res.text());
        console.log("🚀 ~ file: home.js:45 ~ createParagraph ~ result", result)
        await this.toDocEdit(result)
      }
      catch(error) {}
    },
    async createParagraphFromNewsEvent(result) {
      try {        
        await this.toDocEdit(result)
      }
      catch(error) {
        console.log("🚀 ~ file: home.js:66 ~ createParagraphFromNewsEvent ~ error", error)
      }
    },
    timeFormat(value) {
      if(!value) return '';
      try {
        const format  = 'YYYY-MM-DD [at] HH:mm'
        const day = dayjs(value);
        console.log("🚀 ~ file: home.js:55 ~ timeFormat ~ value", value)
        return day.format(format);
      }
      catch(e) {
        console.log("🚀 ~ file: home.js:63 ~ time ~ e", e)
        return ""
      }
    }
  },
  async mounted() {
    await this.getParagraphModes();
    await this.getNews();
    await this.getParagraphs();
    
  },


}
  </script>