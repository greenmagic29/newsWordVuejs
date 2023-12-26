<script setup>
import dictSearchPage from "../components/dictSearchPage.vue";
</script>

<template>
  <div class="about">
    <dictSearchPage />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;

  }
}
</style>
