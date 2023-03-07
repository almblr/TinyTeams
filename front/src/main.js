import { createApp } from "vue";
import { createPinia } from "pinia";
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
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faEye,
  faPowerOff,
  faFeather,
  faImage,
  faEllipsis,
  faThumbsUp,
  faCamera,
  faXmark,
  faUserPlus
);

const app = createApp(App);
app.config.performance;
app.use(createPinia());
app.use(router);
app.component("fa", FontAwesomeIcon);
app.mount("#app");
