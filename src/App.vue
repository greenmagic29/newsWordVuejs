<script setup>
import { RouterLink, RouterView } from "vue-router";
import BottomBar from "./components/bottombar.vue";
import MobileRequestNotificationBanner from "./components/mobilerequestNotificationBanner.vue";
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


    <!-- <button onclick="index_html_module.serviceWorker()">show notification</button> -->
    <div class="main">
      <header class="hero">
        <span
          class="material-symbols-outlined"
          @click="goBack()"
          v-if="showBack"
        >
          arrow_back
        </span>
        <p class="hero-text">
          <span class="nowrap">News</span>
        </p>
      </header>
      <BottomBar class="nav-header" />
      <RouterView :key="$route.fullPath" class="index-content" />

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
    <MobileRequestNotificationBanner v-show=" isMobile && isEnabledNotif && notCreatedNotif && !isInLoginPage" />

</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.hero {
  padding: 0.5rem 0;
  /* background-color: #dda15e; */
  max-height: 60px;
  display: flex;
  align-items: center;
  /* border: 2px solid #fff; */
  /* border-radius: 1rem; */
  /* box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); */
  /* margin: 0.5rem 1rem 0.5rem 1rem; */
  /* border-bottom: solid 1px rgba(242, 242, 242, 1); */
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
import {LocalNotifications} from '@capacitor/local-notifications'
import { createNotifications, getCache } from "./utils/sqlitedb";
import dayjs from 'dayjs'
export default {
   data() {
    return {
      isEnabledNotif: true,
      notCreatedNotif: true
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
  async mounted() {
    console.log("🚀 ~ file: App.vue:140 ~ isInLoginPage ~ this.$router.currentRoute.value.fullPath:", this.$router.currentRoute.value.fullPath)
    const permission = (await LocalNotifications.checkPermissions()).display;
    if(['prompt', 'prompt-with-rationale'].includes(permission)) {
      await LocalNotifications.requestPermissions();
    }
    
    const notifications = (await LocalNotifications.getPending()).notifications
    console.log("🚀 ~ file: App.vue:124 ~ mounted ~ await LocalNotifications.getPending():", JSON.stringify(notifications))
    this.notCreatedNotif = notifications.length === 0
    if(this.isMobile) {
      const tmpRouter = this.$router;
      LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {
        console.log("🚀 ~ file: App.vue:149 ~ LocalNotifications.addListener ~ localNotificationActionPerformed: running")
          const extra = payload.notification.extra;
          console.log("🚀 ~ file: App.vue:147 ~ LocalNotifications.addListener ~ extra:", JSON.stringify(extra))
          // use route to redirect
          tmpRouter.push({ name: extra.route, params: { word: extra.word.text, def: extra.word.def } })
      });
      //update the latest bookmark to notification once a day
      const lastDateString = (await getCache('dictionary'))[0]['last_update_date'];
      const lastDate = dayjs(lastDateString)
      console.log("🚀 ~ file: App.vue:137 ~ mounted ~ lastDate:", lastDate)
      const now = dayjs();
      if(!this.notCreatedNotif && now.isAfter(lastDate.add(1, 'day'))) {
        console.log(`App.vue:140 ~ Refreshing notification....`)
      await createNotifications();
      }

    }
  },
  computed: {
    showBack() {
      if (["/", "/login"].includes(this.$router.currentRoute.value.fullPath)) {
        return false;
      }
      return true;
    },
    isInLoginPage() {
      if(this.$router.currentRoute.value.fullPath === "/login") {
        
        return true
      }
      return false
    }

  },
};
</script>
