import { getIoInstance } from "../../index.js";
import User from "../../models/User.js";
import connectedUser from "../models/connectedUserList.js";
import { getOnlineUsers } from "./index.js";

export const handleCall = async (callee, socket) => {
  console.log(callee);
  const callerId = socket.user.id;
  const user = await User.findById(callerId).select("username email");
  let io = getIoInstance;
  const onlineUsers = getOnlineUsers();
  onlineUsers.forEach((calleeUser) => {
    if (calleeUser.userId === callee._id) {
      io.to(calleeUser.key).emit("pree-offer", { user, type: callee.callType });
    }
  });
};
