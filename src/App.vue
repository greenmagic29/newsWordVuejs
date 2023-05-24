<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomBar from './components/bottombar.vue'
</script>

<template>
  <!-- <header>
    
    <div class="wrapper">
       <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav> 
    </div>
  </header> -->

  <main>
    <!-- <button onclick="index_html_module.serviceWorker()">show notification</button> -->
    <div class="main">
      <header class="hero">
        <span class="material-symbols-outlined" @click="goBack()" v-if="showBack">
          arrow_back
        </span>
        <p class="hero-text">
          <span class="nowrap">Welcome</span>

        </p>

      </header>
      <RouterView class="index-content"/>

      <!-- <section class="index-content">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam labore asperiores iusto nostrum minus
          sapiente minima necessitatibus. Voluptatibus hic iusto distinctio maxime magnam officia qui consequuntur
          repudiandae, totam alias labore.</p>
        <p>Exercitationem ab recusandae molestias assumenda labore eius, nemo eos quos possimus, rem voluptas magnam
          iusto velit hic libero reiciendis sunt! Aliquid veniam voluptate beatae doloremque ipsa odio, voluptatibus
          eaque alias?</p>

      </section> -->

      <section class="footer">
        <div class="wb-footer"> @ABC by tyic. Since 2000 - {{ new Date().getFullYear() }}</div>
        <BottomBar class="nav-footer" />
        
      </section>

    </div>
  <section class="webpush-banner__section" id="webpush-banner__section">
    <p class="webpush-banner__p">Want to receive reminder everyday? Allow notification in your browser.</p>
    <footer class="webpush-banner__footer">
      <a onclick="hideWebpuhsBanner()" >Cancel</a>
      <a onclick="index_html_module.serviceWorker();hideWebpuhsBanner()">Confirm</a>
    </footer>
  </section>
</main>
  
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
}
.hero {
    padding: 0.5rem;
    /* background-color: #dda15e; */
    max-height: 60px;
    display: flex;
    align-items: center;
    /* border: 2px solid #fff; */
    /* border-radius: 1rem; */
    box-shadow: 1px 1px 2px rgba(0,0,0,0.2);
    /* margin: 0.5rem 1rem 0.5rem 1rem; */
    border-bottom: solid 1px rgba(242, 242, 242, 1);

}
.hero-text {
    flex-grow: 1;
    text-align: center;
    font-weight: 600;
    font-size: 1.5rem;
}
.index-content {
  flex-grow: 1;
}
.webpush-banner__section {
  display: flex;
  position: fixed;
  bottom: 0;
  background-color: antiquewhite;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
  /* height: 17%; */
  left: 0;
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

@media (min-width: 1024px) {

}
</style>
