import FriendInvitaion from "../../models/FreindInvitaion.js";
import connectedUser from "../models/connectedUserList.js";
import { getIoInstance } from "../../index.js";

export const upadatePendingInvitaions = async (userId) => {
  const pendingInvitaions = await FriendInvitaion.find({
    reciverId: userId,
  }).populate("senderId", "email username image");

  const io = getIoInstance;
  const onlineRecivers = [];

  connectedUser.forEach((value, key) => {
    if (value.user === userId) {
      onlineRecivers.push(key);
    }
    // console.log("online", connectedUser);

    onlineRecivers.forEach((reciver) => {
      io.to(reciver).emit("invitaion", pendingInvitaions);
    });
  });
};
