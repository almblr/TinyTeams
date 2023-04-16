import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/LoginView.vue";
import Feed from "@/views/FeedView.vue";
import Signup from "@/views/SignupView.vue";
import UserProfil from "@/views/UserProfilView.vue";
import UsersList from "@/views/UsersListView.vue";
import Settings from "@/views/SettingsView.vue";
import PostView from "@/views/PostView.vue";
import NotFound from "@/views/NotFoundView.vue";

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
    path: "/feed",
    name: "Feed",
    component: () => import("@/views/FeedView.vue"),
    beforeEnter: (_, _2, next) => {
      window.sessionStorage.getItem("user") ? next() : next("/login");
    },
  },
  {
    path: "/post/:postId",
    name: "Post",
    component: () => import("@/views/PostView.vue"),
  },
  {
    path: "/users",
    name: "User",
    component: () => import("@/views/UsersListView.vue"),
  },
  {
    path: "/users/:userId",
    name: "UserProfil",
    component: () => import("@/views/UserProfilView.vue"),
  },
  {
    path: "/messages/",
    name: "Messages",
    component: () => import("@/views/ChatView.vue"),
  },
  {
    path: "/messages/new/:userId",
    name: "newMessage",
    component: () => import("@/views/ChatView.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("@/views/SettingsView.vue"),
  },
  {
    path: "/notfound/:type/:typeid",
    name: "Notfound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
