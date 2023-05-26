import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DocEditView from "../views/DocEditView.vue";
import LoginView from "../views/LoginView.vue";

function ifAuthenticated(to, from, next) {
  console.log(
    "🚀 ~ file: index.html:72 ~ ifAuthenticated ~ ifAuthenticated",
    ifAuthenticated
  );
  if (localStorage.getItem("login")) {
    next();
    return;
  }
  window.location.href = "/login.html";
}
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/docEdit/:id",
      component: DocEditView,
      beforeEnter: ifAuthenticated,
    },
    {
      path: "/login",
      component: LoginView
    }
  ],
});

export default router;
