import { Server } from "socket.io";
import { socketAuth } from "../middlewares/index.js";
import {
  handleDirectMessages,
  handleUpadeHistoryMessages,
  updateHistoryMessages,
} from "./controller/chat.controller.js";
import {
  addNewConnectedUsers,
  getOnlineUsers,
  removeDisconnectUsers,
} from "./controller/index.js";
import { handleCall } from "./controller/webRTC.controller.js";
let io = null;
export const connectSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const boradcastOnlineUsers = () => {
    const onlineusersList = getOnlineUsers();

    io.emit("connected_users", onlineusersList);
  };
  io.use(socketAuth);
  boradcastOnlineUsers();
  io.on("connection", (socket) => {
    addNewConnectedUsers(socket, socket.user);
    setTimeout(() => {
      boradcastOnlineUsers();
    }, 1000);
    socket.on("direct_message", (data) => {
      handleDirectMessages(socket, data);
    });

    socket.on("direct_chat_history", (data) => {
      handleUpadeHistoryMessages(socket, data);
    });
    socket.on("disconnect", () => {
      removeDisconnectUsers(socket);
      setTimeout(() => {
        boradcastOnlineUsers();
      }, 1000);
    });

    socket.on("pree-offer", (data) => {
      handleCall(data, socket);
    });
  });

  // setInterval(() => {
  //   boradcastOnlineUsers();
  // }, 8000);
  return io;
};
