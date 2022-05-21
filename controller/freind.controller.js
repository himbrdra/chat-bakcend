import FriendInvitaion from "../models/FreindInvitaion.js";
import User from "../models/User.js";
import { upadatePendingInvitaions } from "../socket/controller/invitaion.controller.js";
import { updateFriendList } from "../socket/controller/updateFriendList.controller.js";

export const sendInvitaion = async (req, res) => {
  const { email } = req.body;
  const reciverEmail = email;

  // sender user
  const sender = await User.findById(req.user._id);

  const targetUser = await User.findOne({ email });
  if (!targetUser) {
    return res.status(404).send({
      error: ` user with the email  ${email} not found please check the email`,
    });
  }
  // check if the target is the same user
  if (reciverEmail === sender.email) {
    return res.status(409).send({ error: "you cant be friend with yourself" });
  }

  const invitaionAlreadySent = await FriendInvitaion.findOne({
    reciverId: targetUser._id,
    senderId: sender._id,
  });

  if (invitaionAlreadySent) {
    return res.status(409).send({ error: "invitaion already sent" });
  }

  const isAlreadyFriends = targetUser.friends.find((friendId) => {
    return friendId.toString() === req.user._id.toString();
  });

  if (isAlreadyFriends) {
    return res.status(409).send({
      error: `you alrady friend with ${targetUser.email} check friends list`,
    });
  }
  const pendingInvitaion = await FriendInvitaion.create({
    reciverId: targetUser._id,
    senderId: sender._id,
  });
  await upadatePendingInvitaions(targetUser.id);

  return res.status(200).send({ message: "invtaion send" });
};

export const acceptInvitaion = async (req, res) => {
  const reciver = req.user;
  const { invitaionId, senderId } = req.body;

  const invitaion = await FriendInvitaion.findByIdAndDelete(invitaionId);

  // upadate user friend list
  reciver.friends.push(senderId);
  await reciver.save();

  const sender = await User.findById(senderId);
  sender.friends.push(reciver._id);
  await sender.save();
  const pendingInvitaions = await FriendInvitaion.find({
    reciverId: reciver._id,
  });
  console.log(pendingInvitaions);
  await updateFriendList(reciver._id);

  await updateFriendList(sender._id);
  try {
    res.status(200).send(pendingInvitaions);
  } catch (err) {
    res.status(500).send({ error: "something went wrong" });
  }
};
export const rejectInvitaion = async (req, res) => {
  const reciver = req.user;
  const { invitaionId, senderId } = req.body;
  const invitaion = await FriendInvitaion.findByIdAndDelete(invitaionId);
  const pendingInvitaions = await FriendInvitaion.find({
    reciverId: reciver._id,
  });
  try {
    res.status(200).send(pendingInvitaions);
  } catch (err) {
    res.status(500).send({ error: "something went wrong" });
  }
};
