import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserDetailSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    gender: {
      type: String,
    },
    mobileno: {
      type: String,
    },
    profile: {
      type: Object,
    },
    resume: {
      type: Object,
    },
    dateOfBirth: {
      type: String,
    },
    highestQualification: {
      type: String,
    },
    experience: {
      type: String,
    },
    experienceDetails: {
      type: Array,
    },
    education: {
      type: Array,
    },
    languages: {
      type: Array,
    },
    skills: {
      type: Array,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    organizationName: {
      type: String,
    },
    organizationContact: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserDetail = mongoose.model("userDetail", UserDetailSchema);
export default UserDetail;
