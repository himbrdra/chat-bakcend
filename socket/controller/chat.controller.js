import { getIoInstance } from "../../index.js";
import Conversations from "../../models/Conversations.js";
import Messages from "../../models/Messages.js";
import connectedUser from "../models/connectedUserList.js";

export const handleUpadeHistoryMessages = async (socket, data) => {
  const userId = socket.user.id;
  const { reciverId } = data;

  const conversation = await Conversations.findOne({
    participients: { $all: [userId, reciverId] },
  });

  updateHistoryMessages(conversation?._id, socket.id);
};

export const updateHistoryMessages = async (
  conversationId,
  toSpecificUser = null
) => {
  const conversation = await Conversations.findById(conversationId).populate({
    path: "messages",
    model: "Message",
    populate: {
      path: "author",
      model: "User",
      select: "_id username",
    },
  });
  if (conversation) {
    const io = getIoInstance;
    if (toSpecificUser) {
      return io.to(toSpecificUser).emit("direct_chat_history", {
        messages: conversation.messages,
        participients: conversation.participients,
      });
    }
    conversation.participients.forEach((userId) => {
      const onlineUsers = [];
      connectedUser.forEach((value, key) => {
        if (value.user === userId.toString()) {
          onlineUsers.push(key);
        }
        onlineUsers.forEach((user) => {
          io.to(user).emit("direct_chat_history", {
            messages: conversation.messages,
            participients: conversation.participients,
          });
        });
      });
    });
  }
};

export const handleDirectMessages = async (socket, data) => {
  const userId = socket.user.id;
  const { reciverId, content } = data;

  const message = await Messages.create({
    author: userId,
    content: content,
    data: Date.now(),
    direct: "DIRECT",
  });

  const conversation = await Conversations.findOne({
    participients: { $all: [userId, reciverId] },
  });
  const io = getIoInstance;

  if (conversation) {
    conversation.messages.push(message._id);
    await conversation.save();

    // conversation.participients.forEach((userId) => {
    //   const onlineUsers = [];
    //   connectedUser.forEach((value, key) => {
    //     if (value.user === userId.toString()) {
    //       onlineUsers.push(key);
    //     }
    //     onlineUsers.forEach((user) => {
    //       io.to(user).emit("direct_message", {
    //         messages: message,
    //         participients: conversation.participients,
    //       });
    //     });
    //   });
    // });

    connectedUser.forEach((value, key) => {
      const onlineUsers = [];
      if (value.user === reciverId.toString()) {
        onlineUsers.push(key);
      }
      console.log(onlineUsers);
      onlineUsers.forEach((user) => {
        return io.to(user).emit("direct_message", {
          messages: message,
          participients: conversation.participients,
        });
      });
    });

    // updateHistoryMessages(conversation._id);
  } else {
    const newConversation = await Conversations.create({
      participients: [userId, reciverId],
      messages: [message._id],
    });
    updateHistoryMessages(newConversation._id);
  }
};
