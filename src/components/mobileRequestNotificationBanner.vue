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
      <a @click="hideWebpuhsBanner">Confirm</a>
    </footer>
  </section>
</template>

<script>
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
    enableNotification() {
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
