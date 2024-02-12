import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RescheduleSchema = new Schema({
  interviewId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  roundId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  rescheduledDate: {
    type: String,
    required: true,
  },
  actualDate: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  approved: {
    type: String,
    default: "pending",
  },
});

const Reschedule = mongoose.model("reschedule", RescheduleSchema);

export default Reschedule;
