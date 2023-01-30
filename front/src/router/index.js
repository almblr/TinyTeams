import { createRouter, createWebHashHistory } from "vue-router";
import Login from "../views/LoginView.vue";
import News from "../views/NewsFeedView.vue";
import Signup from "../views/SignupView.vue";
import ViewPost from "../views/ViewPost.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
  },
  {
    path: "/news",
    name: "News",
    component: News,
    children: [
      {
        path: ":id",
        name: "ViewPost",
        component: ViewPost,
      },
    ],
    beforeEnter: (_, _2, next) => {
      window.localStorage.getItem("userInfo") ? next() : next("/login");
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
