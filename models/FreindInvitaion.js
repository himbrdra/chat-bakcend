import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const FriendInvitaionSchema = new mongoose.Schema({
  reciverId: {
    type: ObjectId,
    ref: "User",
  },
  senderId: {
    type: ObjectId,
    ref: "User",
  },
});

const FriendInvitaion = new mongoose.model("Invitaion", FriendInvitaionSchema);

export default FriendInvitaion;
