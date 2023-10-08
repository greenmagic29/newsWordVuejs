  <template>
  <div>
    <input
      type="text"
      @blur="updateTitle()"
      v-model="paragraph.title"
      title="title"
      placeholder="Enter a title"
      class="doc-title"
    />
    <div
      id="toolbar"
      class="quil-toolbar"
    >
      <!-- Add buttons as you would before -->
      <!-- <button class="ql-bold">Bold</button>
  <button class="ql-italic">italix</button>  -->
      <button class="material-symbols-outlined bookmark-icon" id="bookmarkWord-icon" >
        book
      </button>
      <!-- But you can also add your own -->
      <!-- <button id="custom-button"></button> -->
    </div>
    <div class="doc-edit-bookmark-icon" @click="openBookmarkDialog()">
      <span class="material-symbols-outlined" style="margin-top: 0.3rem">
        book
      </span>
    </div>
    <div id="editor"></div>

    <BookmarkDialog
      v-if="bookmarkDialog.open"
      :paragraphId="bookmarkDialog.data.paragraphId"
      @close="bookmarkDialog.open = false"
    ></BookmarkDialog>
  </div>
</template>
<script>
import Quill from "quill";
import BookmarkDialog from './bookmarkDialog.vue'
function getSelection(quill) {
  const range = quill.getSelection();
  console.log("🚀 ~ file: docEdit.js:5 ~ getSelection ~ range", range);
  if (range) {
    if (range.length == 0) {
      console.log("User cursor is at index", range.index);
    } else {
      const text = quill.getText(range.index, range.length);
      const fullText = quill.getText();
      console.log("🚀 ~ file: docEdit.vue:50 ~ getSelection ~ fullText:", fullText)
      console.log("User has highlighted: ", text);
      //const regex = /[^.?!]*(?<=[.?\s!])${text.trim()}(?=[\s.?!])[^.?!]*[.?!]/igm;
      // Alternative syntax using RegExp constructor
      const regex = new RegExp(`[^.?!\n]*(?<=[.?\\s!])${text.trim()}(?=[\\s.?!])[^.?!]*[.?!]`, 'igm')
      let m;
      let firstLine = "";


      while ((m = regex.exec(fullText)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
              regex.lastIndex++;
          }
          
          // The result can be accessed through the `m`-variable.

          m.forEach((match, groupIndex) => {
                if(firstLine === "") {
                  firstLine = match;
                }
          });
      }
      
      return {text: text.trim(), line: firstLine};
    }
  } else {
    console.log("User cursor is not in editor");
  }

  return null;
}

//old bold
//DEPRECATED
function customBoldHandler(paragraphId, backendPath) {
  return function (value) {
    console.log("🚀 ~ file: docEdit.js:3 ~ customBoldHandler ~ value", value);
    if (value) {
      this.quill.format("bold", true);
      const { text, line }= getSelection(this.quill);
      console.log("🚀 ~ file: docEdit.js:24 ~ customBoldHandler ~ text", text);
      //TODO: call api to save the text in db highlight words table
      const payload = {
        word: text,
        line:line,
        paragraphId: paragraphId,
      };
      fetch(`${backendPath}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: localStorage.getItem("login"),
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {})
        .catch((e) => {
          console.log(`customBoldHandler error: `, e);
        });
    } else {
      this.quill.format("bold", false);
    }
  };
}
export default {
  components: {BookmarkDialog},
  data() {
    return {
      count: 0,
      paragraph: { title: "" },
      bookmarkDialog: { open: false, data: {} },
      saveTimer: null,
    };
  },
  methods: {
    async getParagraph() {
      try {
        const res = await fetch(
          `${this.backendPath}/paragraph/${this.$route.params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // 'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: localStorage.getItem("login"),
            },
          }
        );
        const resBody = JSON.parse(await res.text());

        this.paragraph = resBody.document;
      } catch (error) {}
    },
    openBookmarkDialog() {
      this.bookmarkDialog.open = true;
      this.bookmarkDialog.data = { paragraphId: this.$route.params.id };
    },
    async updateTitle() {
      const payload = {
        id: this.$route.params.id,
        title: this.paragraph.title,
      };
      try {
        const res = await fetch(`${this.backendPath}/paragraph/title`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: localStorage.getItem("login"),
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.log("🚀 ~ file: docEdit.js:95 ~ updateTitle ~ error", error);
      }
    },
  },
  async mounted() {
    console.log(`abcc`);
    const backendPathForMounted = this.backendPath;
    let changes = false;
    const paragraphId = this.$route.params.id;
    const quill = new Quill("#editor", {
      theme: "snow",
      formats: {
        Inline: {
          size: "large",
        },
      },
      modules: {
        toolbar: {
          container: "#toolbar",
          handlers: {
            bold: customBoldHandler(paragraphId, backendPathForMounted),
          },
        },
      },
      //readOnly: true
    });

    this.saveTimer = setInterval(function () {
      //

      // Save the entire updated text to localStorage
      if (!changes) {
        return;
      }
      const data = quill.getContents();
      console.log(
        "🚀 ~ file: docEdit.js:99 ~ this.saveTime=setInterval ~ data",
        data
      );
      const payload = {
        content: data.ops,
      };
      fetch(`${backendPathForMounted}/paragraph/` + paragraphId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: localStorage.getItem("login"),
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          changes = false;
        })
        .catch((e) => {
          console.log(`customBoldHandler error: `, e);
        });
      //}
    }, 3 * 1000);
    -(await this.getParagraph());
    quill.setContents(this.paragraph.content);
    quill.disable();
    const customButton = document.querySelector("#bookmarkWord-icon");

    customButton.addEventListener("click", function () {
      const { text, line } = getSelection(quill);
      console.log(
        "🚀 ~ file: docEdit.js:135 ~ customButton.addEventListener ~ text",
        text
      );
      quill.format("bold", true);

      //TODO: call api to save the text in db highlight words table
      const payload = {
        word: text,
        line: line,
        paragraphId: paragraphId,
      };
      fetch(`${backendPathForMounted}/bookmark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: localStorage.getItem("login"),
        },
        body: JSON.stringify(payload),
      })
        .then((res) => {})
        .catch((e) => {
          console.log(`customBoldHandler error: `, e);
        });
    });
    //this checking must create after quill.setContents to prevent paragraph from save when first load
    quill.on("text-change", function (delta, oldDelta, source) {
      //quill.getContents()
      changes = true;
    });
  },
  beforeDestroy() {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
    }
  },
};
</script>

<style scoped>
p {
  font-size: 18px;
}
.doc-title {
  font-size: 1.5rem;
      width: 100%;
      background-color: var(--color-background-soft);
      color: var(--color-heading);
  }

.quil-toolbar {
  position: sticky; 
  top: 0; 
  z-index: 1; 
  background-color: var(--color-background-soft);
}

.bookmark-icon {
  color: var(--color-heading);
}

.doc-edit-bookmark-icon {
    position: fixed;
    bottom: 82px;
    right: 2rem;

    display: block;
    background-color: var(--color-background-soft);
    color: var(--color-heading);
    padding: 0.65rem 1rem;

    border-radius: 50%;
    text-align: center;
    z-index: 1;
}
@media (min-width: 1024px) {
  .doc-edit-bookmark-icon {
    bottom: 0;
  }
}
</style>