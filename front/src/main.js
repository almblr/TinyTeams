import App from "./App.vue";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import { registerPlugins } from "@/plugins";
import vuetify from "./plugins/vuetify";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPenToSquare,
  faPowerOff,
  faFeather,
  faImage,
  faXmark,
  faEllipsis,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import "vuetify/dist/vuetify.min.css";

library.add(
  faEye,
  faPenToSquare,
  faTrashCan,
  faPowerOff,
  faFeather,
  faImage,
  faXmark,
  faEllipsis,
  faThumbsUp
);

const app = createApp(App);
registerPlugins(app);
app.use(createPinia());
app.use(router);
app.use(vuetify);
app.component("fa", FontAwesomeIcon);
app.mount("#app");
