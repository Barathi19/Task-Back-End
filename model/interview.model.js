import mongoose from "mongoose";

const Schema = mongoose.Schema;

const InterviewSchema = new Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rounds: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "rounds",
    },
  ],
});

const Interview = mongoose.model("interview", InterviewSchema);

export default Interview;
