<template>
  <div class="top-new-container__news">
    <div style="display: flex; align-items: center" @click="togglePanel()">
      <span style="flex-grow: 1">{{ topNew.name }}</span>
      <a v-show="!showPanel">+</a>
      <a v-show="showPanel">-</a>
    </div>
    <section class="top-new-expand-panel" v-show="showPanel">
      <a
        v-for="mode in modes"
        :key="mode"
        href="#"
        @click="createParagraphFromNews(mode.id)"
        class="top-new-select-icon"
      >
        <span class="material-symbols-outlined">
          {{ mode.icon }}
        </span>
        <span class="top-new-title">{{ mode.name }}</span>
      </a>
      <!-- <a href="#" @click="createParagraphFromNews('min')" class="top-new-select-icon">
      <span class="material-symbols-outlined">
        mood
      </span>
      <span>Minimal</span>
    </a>
    <a href="#" @click="createParagraphFromNews('med')" class="top-new-select-icon">
      <span class="material-symbols-outlined">
        emoji_objects
      </span>
      <span>Medium</span>
    </a>
    <a href="#" @click="createParagraphFromNews('pri')" class="top-new-select-icon">
      <span class="material-symbols-outlined">
        diamond
      </span>
      <span>Prime</span>
    </a> -->
    </section>
  </div>
</template>
<script>
export default {
  props: {
    topNew: {
      type: Object,
      default: () => {
        name: "";
        id: "";
      },
    },
    newsIndex: Number,
    modes: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return { count: 0, showPanel: false };
  },
  methods: {
    async createParagraphFromNews(mode = "prime") {
      try {
        const payload = { mode };
        const res = await fetch(
          `${this.backendPath}/news/topNews/createTopNews/${this.topNew.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: localStorage.getItem("login"),
            },
            body: JSON.stringify(payload),
          }
        );
        const result = JSON.parse(await res.text());
        console.log(
          "🚀 ~ file: home.js:61 ~ createParagraphFromNews ~ result",
          result
        );
        this.$emit("doc-edit", result);
        await this.toDocEdit(result);
      } catch (error) {
        console.log(
          "🚀 ~ file: home.js:66 ~ createParagraphFromNews ~ error",
          error
        );
      }
    },
    async toDocEdit(item) {
      this.$router.push(`/docEdit/${item.id}`);
    },
    togglePanel() {
      this.showPanel = !this.showPanel;
    },
  },
};
</script>

<style>
.top-new-container__news {
  margin: 0.5rem;
  
}

.top-news-container__header {
  margin: 0.5rem 0;
  font-size: 1rem;
  color: var(--color-heading);
}

.top-new-expand-panel {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  margin: 1rem;
}

.top-new-select-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}

.top-new-title {
  text-transform: capitalize;
}
</style>
