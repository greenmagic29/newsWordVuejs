<template>
  <section
    v-if="isChatOpen"
    class="news-chat"
    role="dialog"
    aria-label="Find news chat"
  >
    <header class="news-chat__header">
      <h2>Find news</h2>
      <button
        class="news-chat__close"
        type="button"
        aria-label="Close Find news chat"
        @click="isChatOpen = false"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </header>

    <div ref="messageList" class="news-chat__messages" aria-live="polite">
      <p v-if="messages.length === 0" class="news-chat__welcome">
        What news are you looking for?
      </p>
      <article
        v-for="(message, index) in messages"
        :key="index"
        class="news-chat__message"
        :class="`news-chat__message--${message.role}`"
      >
        {{ message.content }}
      </article>
      <p v-if="isSubmitting" class="news-chat__status" role="status">
        Finding news...
      </p>
      <p v-if="errorMessage" class="news-chat__error" role="alert">
        {{ errorMessage }}
      </p>
    </div>

    <form class="news-chat__form" @submit.prevent="sendPrompt">
      <textarea
        v-model="prompt"
        aria-label="Describe the news you want"
        placeholder="Describe the news you want..."
        rows="2"
        :disabled="isSubmitting"
        @keydown.enter.exact.prevent="sendPrompt"
      ></textarea>
      <button
        class="news-chat__send"
        type="submit"
        :disabled="isSubmitting || !prompt.trim()"
      >
        Send
      </button>
    </form>
  </section>

  <button
    class="find-news-button"
    type="button"
    :aria-expanded="isChatOpen"
    @click="isChatOpen = !isChatOpen"
  >
    <span class="material-symbols-outlined">search</span>
    {{ isChatOpen ? "Close" : "Find news" }}
  </button>
</template>

<script>
import { nextTick } from "vue";

export default {
  data() {
    return {
      isChatOpen: false,
      isSubmitting: false,
      prompt: "",
      messages: [],
      errorMessage: "",
    };
  },
  methods: {
    async sendPrompt() {
      const prompt = this.prompt.trim();
      if (!prompt || this.isSubmitting) return;

      this.messages.push({ role: "user", content: prompt });
      this.prompt = "";
      this.errorMessage = "";
      this.isSubmitting = true;
      await this.scrollMessagesToBottom();

      try {
        const response = await fetch(
          `${this.backendPath}/agent/search_and_save`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("login"),
            },
            body: JSON.stringify({ prompt }),
          },
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof result?.message === "string"
              ? result.message
              : `The news search failed (${response.status}).`,
          );
        }
        if (result?.success !== true || typeof result.agentResponse !== "string") {
          throw new Error(
            typeof result?.message === "string"
              ? result.message
              : "The news search returned an invalid response.",
          );
        }

        this.messages.push({ role: "assistant", content: result.agentResponse });
      } catch (error) {
        this.errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to find news. Please try again.";
      } finally {
        this.isSubmitting = false;
        await this.scrollMessagesToBottom();
      }
    },
    async scrollMessagesToBottom() {
      await nextTick();
      if (this.$refs.messageList) {
        this.$refs.messageList.scrollTop = this.$refs.messageList.scrollHeight;
      }
    },
  },
};
</script>

<style scoped>
.find-news-button {
  position: fixed;
  right: 1rem;
  bottom: calc(92px + env(safe-area-inset-bottom));
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 0;
  border-radius: 999px;
  background: #2c3e50;
  color: #fff;
  box-shadow: 0 3px 12px rgb(0 0 0 / 25%);
  font: inherit;
  cursor: pointer;
}

.news-chat {
  position: fixed;
  right: 1rem;
  bottom: calc(148px + env(safe-area-inset-bottom));
  z-index: 5;
  display: flex;
  flex-direction: column;
  width: min(420px, calc(100vw - 2rem));
  height: min(560px, calc(100dvh - 180px));
  min-height: 240px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: var(--color-background);
  box-shadow: 0 4px 20px rgb(0 0 0 / 25%);
}

.news-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.news-chat__header h2 {
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
}

.news-chat__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}

.news-chat__messages {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding: 1rem;
}

.news-chat__welcome,
.news-chat__status {
  color: var(--color-text);
  opacity: 0.75;
}

.news-chat__message {
  max-width: 90%;
  padding: 0.65rem 0.8rem;
  border-radius: 0.9rem;
  color: var(--color-heading);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.news-chat__message--user {
  align-self: flex-end;
  background: #2c3e50;
  color: #fff;
}

.news-chat__message--assistant {
  align-self: flex-start;
  background: var(--color-background-soft);
}

.news-chat__error {
  color: #b42318;
}

.news-chat__form {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.news-chat__form textarea {
  flex: 1;
  min-width: 0;
  resize: vertical;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
  background: var(--color-background-soft);
  color: var(--color-text);
  font: inherit;
}

.news-chat__send {
  border: 0;
  border-radius: 0.5rem;
  padding: 0.55rem 0.8rem;
  background: #2c3e50;
  color: #fff;
  font: inherit;
  cursor: pointer;
}

.news-chat__send:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 400px) {
  .news-chat {
    right: 0.5rem;
    width: calc(100vw - 1rem);
  }

  .find-news-button {
    right: 0.75rem;
  }
}
</style>
