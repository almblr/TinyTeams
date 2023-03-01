import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("connection", (socket) => {});

socket.emit("hello", "world");

export default socket;
