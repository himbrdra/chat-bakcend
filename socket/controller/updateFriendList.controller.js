import { getIoInstance } from "../../index.js";
import User from "../../models/User.js";
import connectedUser from "../models/connectedUserList.js";

export const updateFriendList = async (userId) => {
  console.log(userId);
  if (connectedUser.length <= 0) {
    return;
  }

  const user = await User.findById(userId, {
    _id: 1,
    friends: 1,
  }).populate("friends", "_id username image");
  console.log(user);

  const friendList = user.friends.map((friend) => {
    return {
      id: friend._id,
      username: friend.username,
      image: friend.image,
    };
  });

  const onlineUsers = [];

  connectedUser.forEach((value, key) => {
    if (value.user === user.id) {
      onlineUsers.push(key);
    }
  });
  const io = getIoInstance;

  onlineUsers.forEach((reciver) => {
    io.to(reciver).emit("friendList", [...friendList]);
  });
};
