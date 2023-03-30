import { io } from "socket.io-client";

const userLS = JSON.parse(sessionStorage.getItem(`user`)) || null;

const socket = io("http://localhost:3000");

if (!userLS) {
  console.log("no user");
} else {
  const sendUserId = () => {
    if (userLS.id) {
      socket.on("askForUserId", () => {
        socket.emit("sendUserId", userLS.id);
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
}

export default socket;
