import { createRouter, createWebHashHistory } from "vue-router";
import useChatStore from "@/stores/chatStore.js";
import Login from "@/views/LoginView.vue";
import Signup from "@/views/SignupView.vue";
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
    name: "UserProfile",
    component: () => import("@/views/UserProfilView.vue"),
  },
  {
    path: "/messages/",
    name: "Messages",
    component: () => import("@/views/ChatView.vue"),
    children: [
      {
        path: ":conversationId",
        name: "MessagesConversation",
        component: () => import("@/views/ChatView.vue"),
      },
    ],
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

router.beforeEach(async (to, from, next) => {
  if (
    to.name !== "Login" &&
    to.name !== "Signup" &&
    window.sessionStorage.getItem("user")
  ) {
    const chatStore = useChatStore();
    await chatStore.getNonReadMessages();
    return next();
  }
  next();
});

export default router;
