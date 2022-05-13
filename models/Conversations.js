import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const conversationSchema = new mongoose.Schema({
  participients: [{ type: ObjectId, ref: "User" }],
  messages: [{ type: ObjectId, ref: "Message" }],
});

export default mongoose.model("Conversation", conversationSchema);
