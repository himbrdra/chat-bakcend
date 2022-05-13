import connectedUser from "../models/connectedUserList.js";
import { upadatePendingInvitaions } from "./invitaion.controller.js";
import { updateFriendList } from "./updateFriendList.controller.js";

export const addNewConnectedUsers = (socket, user) => {
  connectedUser.set(socket.id, { user: user.id });

  upadatePendingInvitaions(user.id);
  updateFriendList(user.id);
};

export const getOnlineUsers = () => {
  const onlineUsers = [];
  connectedUser.forEach((value, key) => {
    onlineUsers.push({ userId: value.user, key });
  });
  return onlineUsers;
};

export const removeDisconnectUsers = (socket) => {
  if (connectedUser.has(socket.id)) {
    connectedUser.delete(socket.id);
  }
};
