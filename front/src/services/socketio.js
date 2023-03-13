import { io } from "socket.io-client";

const sesStr = JSON.parse(sessionStorage.getItem(`user`));
const userId = sesStr?.userId || null;

const socket = io("http://localhost:3000");

const sendUserId = () => {
  if (userId) {
    socket.on("askForUserId", () => {
      socket.emit("sendUserId", userId);
    });
  }
};

socket.on("message", (arg) => {
  alert(arg);
});

socket.on("followNotification", (arg) => {
  console.log(arg);
  const sound = new Audio("../../public/notificationSound.mp3");
  sound.play();
});

sendUserId();

export default socket;
