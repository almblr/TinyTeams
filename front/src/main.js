import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import {
  faPenToSquare,
  faPowerOff,
  faFeather,
  faImage,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from './router';
import App from './App.vue';

library.add(
  faEye,
  faPenToSquare,
  faTrashCan,
  faPowerOff,
  faFeather,
  faImage,
  faXmark
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('fa', FontAwesomeIcon);
app.mount('#app');
