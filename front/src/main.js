import { createApp } from "vue";
import { createPinia } from "pinia";
import VueClickOutsideElement from "vue-click-outside-element";
import App from "@/App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEye,
  faPowerOff,
  faFeather,
  faImage,
  faEllipsis,
  faThumbsUp,
  faCamera,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faEye,
  faPowerOff,
  faFeather,
  faImage,
  faEllipsis,
  faThumbsUp,
  faCamera,
  faXmark
);

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.use(VueClickOutsideElement);
app.component("fa", FontAwesomeIcon);
app.mount("#app");
