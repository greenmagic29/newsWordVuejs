<template>
  <div
  class="bookmark-dialog ">
  <div class="resizable-content" id="box">
    <header class="bookmark-dialog__header">
      <div class="bookmark-dialog__top_close" id="resize" @click="closeDialog()"></div>
    </header>
    <!-- <header class="bookmark-dialog__header">
      <span class="material-symbols-outlined"> library_books </span>
      <span class="bookmark-dialog__title"> Bookmarks</span>
      <span class="material-symbols-outlined" @click="closeDialog()">
        close
      </span>
    </header> -->
    <section>
      <ul class="bookmark-dialog__bookmark-item">
        <li
          v-for="meaning in meanings"
          style="flex-grow: 1; list-style-type: none"
        >
          <BookmarkItem
            :bookmark="meaning"
            style="margin-bottom: 2rem"
          ></BookmarkItem>
        </li>
      </ul>
    </section>
  </div>
</div>
</template>

<script>
import BookmarkItem from "./bookmarkItem.vue";

export default {
  components: { BookmarkItem },
  props: {
    paragraphId: {
      type: String,
    },
  },
  data() {
    return { meanings: [], count: 0 , scrollTop: 1};
  },
  methods: {
    // handledrag() {
    //   let resize = document.getElementById('resize');
    //   let box = document.getElementById('box')

    //   resize.onmousedown = function(e) {
    //     let startY = e.clientY;
    //     resize.top = resize.offsetTop;
    //     document.onmousemove  = function(e) {
    //       let endY = e.clientY;
    //       let moveLen = resize.clientTop + (endY - startY);
    //       console.log("🚀 ~ file: bookmarkDialog.vue:52 ~ handledrag ~ moveLen:", moveLen)
    //       let maxT = box.clientHeight - resize.offsetHeight;
    //       console.log("🚀 ~ file: bookmarkDialog.vue:54 ~ handledrag ~ maxT:", maxT)
    //        if (moveLen < 150) moveLen = 60;
    //         if(moveLen > maxT - 100) moveLen = maxT -200;
    //       resize.style.top = moveLen;
    //       box.style.height = moveLen + 'px'
    //       box.style.bottom = (box.clientHeight - moveLen -5) + 'px'
    //     }
    //     document.onmouseup = function() { 
    //       document.onmousemove = null;
    //       document.onmouseup = null;
    //       resize.releaseCapture && resize.releaseCapture()
    //     }
    //     resize.setCapture && resize.setCapture()
    //     return false;
    //   }
    // },
    async getBookmarks() {
      try {
        const res = await fetch(
          `${this.backendPath}/bookmark?paragraphId=${this.paragraphId}`,
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
        this.meanings = result.row.map((i) => {
          return { ...i, open: false };
        });
        this.count = result.count;
      } catch (error) {
        console.log(
          "🚀 ~ file: bookmarkDialog.vue:56 ~ getBookmarks ~ error:",
          error
        );
      }
    },
    closeDialog() {
      this.$emit("close");
    },
  },
  async mounted() {
    await this.getBookmarks();
  },
};
</script>

<style scoped>

.bookmark-dialog {
  position: fixed !important;
  background-color: var(--color-background-soft);

  bottom: 0;
  left: 0;
  height: 50%;
  max-height: 50%;
  width: 100%;
  border-radius: 15px;
  box-shadow: 1px 5px 18px #283618;

  min-height: min-content;
  overflow: auto;
  z-index: 2;
  font-size: 1.5rem;

} 

/* .bookmark-dialog {
  position: relative;
  background-color: var(--color-background-soft);

  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 15px;
  box-shadow: 1px 5px 18px #283618;


  overflow: auto;
  z-index: 2;
  font-size: 1.5rem;

} */

.bookmark-dialog__top_close {
  background-color: var(--color-background-soft);
  border-top: 4px solid white;
  width: 25%;
  margin: 4px auto;
  padding: 10px;
  border-radius: 3px;


}
.bookmark-dialog__header {
  position: sticky;
  top: 0;
  width: 100%;
  background-color: var(--color-background-soft);
}
/* .bookmark-dialog__header {
  display: flex;
  align-items: center;
  padding: var(--PADDING);
  margin: 10px;

} */

.bookmark-dialog__title {
  flex-grow: 1;
}

.bookmark-dialog__bookmark-item {
  display: flex;

  padding: var(--PADDING);
  flex-direction: column;
  margin: 10px;
}
</style>
