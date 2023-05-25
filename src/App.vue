<script setup>
import { RouterLink, RouterView } from 'vue-router'
import BottomBar from './components/bottombar.vue'
import MobileRequestNotificationBanner from './components/mobilerequestNotificationBanner.vue';
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
          <span class="nowrap">News</span>

        </p>

      </header>
      <BottomBar class="nav-header" />
      <RouterView class="index-content"/>

      <!-- <section class="index-content">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam labore asperiores iusto nostrum minus
          sapiente minima necessitatibus. Voluptatibus hic iusto distinctio maxime magnam officia qui consequuntur
          repudiandae, totam alias labore.</p>
        <p>Exercitationem ab recusandae molestias assumenda labore eius, nemo eos quos possimus, rem voluptas magnam
          iusto velit hic libero reiciendis sunt! Aliquid veniam voluptate beatae doloremque ipsa odio, voluptatibus
          eaque alias?</p>

      </section> -->

      <!-- <section class="footer">
        <div class="wb-footer"> @ABC by tyic. Since 2000 - {{ new Date().getFullYear() }}</div>
        
        
      </section> -->
      
    </div>
    <BottomBar class="nav-footer" />
    <MobileRequestNotificationBanner />

</main>
  
</template>

<style scoped>

.main {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 2rem);
}
.hero {
    padding: 0.5rem 0;
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
  color: var(--color-heading);
    flex-grow: 1;
    
    font-weight: 600;
    font-size: 1.5rem;
}
.index-content {
  flex-grow: 1;
}

.nav-footer {
    display: flex;
    justify-content: center;
    position: sticky;
    bottom: 0;
    background-color: var(--color-background);
}
.nav-header {
  display: none;
}
@media (min-width: 1024px) {
  .nav-footer {
    display: none;
  }
  .nav-header {
    display: flex;
    justify-content: center;
  }
}
</style>

<script>
export default {
  methods: {
      goBack() {
        
        this.$router.back();
      }
    },
    computed:{
      showBack() {
      
        if(this.$router.currentRoute.value.fullPath === "/") {
          
          return false;
        }
        return true;
      }
    }
}
</script>