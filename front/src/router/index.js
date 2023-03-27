import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/LoginView.vue";
import Feed from "@/views/FeedView.vue";
import Signup from "@/views/SignupView.vue";
import UserProfil from "@/views/UserProfilView.vue";
import UsersList from "@/views/UsersListView.vue";
import Settings from "@/views/SettingsView.vue";

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
    component: Feed,
    beforeEnter: (_, _2, next) => {
      window.sessionStorage.getItem("user") ? next() : next("/login");
    },
  },
  {
    path: "/users",
    name: "User",
    component: UsersList,
  },
  {
    path: "/users/:username",
    name: "UserProfil",
    component: UserProfil,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
