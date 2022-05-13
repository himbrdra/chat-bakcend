import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const MessagesSchema = new mongoose.Schema({
  author: {
    type: ObjectId,
    ref: "User",
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
  },
  direct: {
    type: String,
  },
});

export default mongoose.model("Message", MessagesSchema);
