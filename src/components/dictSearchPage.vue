<template>
  <div class="search-page">
    <div class="dict-search-page__search-bar">
      <input type="text" name="" id="" :placeholder="placeholder" v-model="searchText" class="dict-search-page__search-input" @keyup.enter="search(searchText)">
      <span class="material-symbols-outlined" @click="search(searchText)" >
        search
      </span>
    </div>

      <section class="dict-search-page__section">
        <ul class="dict-search-page__bookmark-item">
          <li
            v-for="word in words"
            style="flex-grow: 1; list-style-type: none"
          >
            <BookmarkItem
              :bookmark="word"
              :translation="word"
              style="margin-bottom: 2rem"
            ></BookmarkItem>
          </li>
        </ul>
      </section>

  </div>

</template>
<script>
import BookmarkItem from "./bookmarkItem.vue";
export default {
  components: { BookmarkItem },
  props: {

  },
  data() {
    return { 
      placeholder: "Type the word here",
      words: [],
      searchText: ""
    };
  },
  methods: {
   async search(text) {
    try {
      if(!text) {
        return;
      } 
        const res = await fetch(
          `${this.backendPath}/searchDict?text=${text}`,
          {
            method: "GET",
            // params: { paragraphId: this.paragraphId },
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: localStorage.getItem("login"),
            },
          }
        );
        const result = JSON.parse(await res.text());
        this.words = result.results.map((i) => {
          return { ...i, open: false };
        });
        
      } catch (error) {
        console.log("🚀 ~ file: dictSearchPage.vue:59 ~ search ~ error:", error)

      }
    }
  }
}
</script>

<style>
.search-page {
  width: 100%;
  min-height: min-content;
}
.dict-search-page__search-bar {
  display: flex;
  align-items: center;
}
.dict-search-page__section {
  background-color: var(--color-background-soft);
  padding: 0.75rem;
}
.dict-search-page__bookmark-item {
  padding: 0;
}

.dict-search-page__search-input {
  flex-grow: 1;
  background: var(--color-background-soft);
    border-radius: 0.2rem;
    font-size: 1rem;
    padding: 0.2rem;
    color: var(--color-text);
    border-color: white;
    border-style: solid;
}

</style>