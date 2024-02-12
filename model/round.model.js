import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoundSchema = new Schema({
  roundNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  medium: {
    type: String,
  },
  startTime: {
    type: String,
    required: true,
  },
  interviewerName: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  interviewerEmail: {
    type: String,
    required: true,
  },
  interviewerRole: {
    type: String,
    required: true,
  },
  note: {
    type: String,
  },
  isRescheduled: {
    type: String,
    enum: ["false", "pending", "approved", "rejected"],
    default: "false",
  },
  reasonForReject: {
    type: String,
  },
});

const Round = mongoose.model("round", RoundSchema);

export default Round;
