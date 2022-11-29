import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import News from "../views/NewsFeedView.vue";
import TestViewVue from "@/views/TestView.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: TestViewVue,
  },
  {
    path: "/news",
    name: "News",
    component: News,
    beforeEnter: (_, _2, next) => {
      window.localStorage.getItem("TokenUser") ? next() : next("/login");
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
