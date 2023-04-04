import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  newPost: [],
  newFollow: [],
});

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000/";

export const socket = io(URL);

socket.on("askForUserId", () => {
  socket.emit("sendUserId", userLS.id);
});

socket.on("notifPost", (...args) => {
  state.newPost.push(args);
});

socket.on("notifFollow", (...args) => {
  state.newFollow.push(args);
});

// socket.on("notifFollow", (arg) => {
//   console.log(arg);
//   const sound = new Audio("../../public/notificationSound.mp3");
//   sound.play();
// });

// socket.on("notifPost", (arg) => {
//   console.log(arg);
//   const sound = new Audio("../../public/notificationSound.mp3");
//   sound.play();
// });
