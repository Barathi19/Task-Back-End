import asyncHandler from "../middleware/async.js";
import Interview from "../model/interview.model.js";
import Reschedule from "../model/reschedule.model.js";
import Round from "../model/round.model.js";
import { ObjectId } from "mongodb";
import ErrorResponse from "../utils/errorResponse.js";
import { sendResponse } from "../utils/response.js";

export const createInterview = asyncHandler(async (req, res, next) => {
  const { title, rounds, userId, recruiterId } = req.body;
  const interviewRounds = Array.isArray(rounds)
    ? rounds.map((round) => {
        round.isRescheduled = "false";
        return round;
      })
    : [];
  const alreadyExist = await Interview.findOne({ recruiterId });
  if (alreadyExist) {
    return next(new ErrorResponse("Already scheduled", 400));
  }
  let totalRounds = [];
  if (rounds && interviewRounds.length) {
    totalRounds = await Round.insertMany(interviewRounds);
  }
  totalRounds = totalRounds.map((round) => round._id);
  if (!totalRounds.length) {
    return next(new ErrorResponse("RoundList is empty", 400));
  }
  const interview = await Interview.create({
    recruiterId,
    userId,
    title,
    rounds: totalRounds,
  });
  sendResponse(interview, 200, res);
});

export const rescheduleRequest = asyncHandler(async (req, res, next) => {
  try {
    const {
      interviewId,
      userId,
      roundId,
      actualDate,
      rescheduledDate,
      recruiterId,
      reason,
      approved,
    } = req.body;
    const reschedule = await Reschedule.create({
      interviewId,
      roundId,
      recruiterId,
      userId,
      actualDate,
      rescheduledDate,
      reason,
      approved,
    });
    await Round.findByIdAndUpdate(
      roundId,
      {
        $set: {
          isRescheduled: "pending",
        },
      },
      { new: true }
    );
    sendResponse(reschedule, 200, res);
  } catch (error) {
    next(error);
  }
});

export const allRescheduleRequest = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const mongoId = new ObjectId(id);
  try {
    const allRescheduleRequestData = await Reschedule.aggregate([
      {
        $match: {
          recruiterId: mongoId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $lookup: {
          from: "userdetails",
          localField: "userId",
          foreignField: "userId",
          as: "meta_info",
        },
      },
      {
        $unwind: "$meta_info",
      },
      {
        $lookup: {
          from: "rounds",
          localField: "roundId",
          foreignField: "_id",
          as: "round_info",
        },
      },
      {
        $unwind: "$round_info",
      },
      {
        $project: {
          firstName: "$user_info.firstName",
          lastName: "$user_info.lastName",
          email: "$user_info.email",
          mobileno: "$meta_info.mobileno",
          roundNumber: "$round_info.roundNumber",
          actualDate: 1,
          roundId: 1,
          rescheduledDate: 1,
          reason: 1,
          approved: 1,
        },
      },
    ]);
    console.log(allRescheduleRequestData, "data");
    sendResponse(allRescheduleRequestData, 200, res);
  } catch (error) {
    next(error);
  }
});

export const getSheduledData = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const mongoId = new ObjectId(id);
  try {
    const scheduleRequestData = await Interview.aggregate([
      {
        $match: {
          recruiterId: mongoId,
        },
      },
      {
        $lookup: {
          from: "rounds",
          let: { roundIds: "$rounds" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$roundIds"] },
              },
            },
          ],
          as: "rounds",
        },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user_info",
        },
      },
      {
        $unwind: "$user_info",
      },
      {
        $lookup: {
          from: "userdetails",
          foreignField: "userId",
          localField: "userId",
          as: "meta_info",
        },
      },
      {
        $unwind: "$meta_info",
      },
      {
        $lookup: {
          from: "userdetails",
          foreignField: "userId",
          localField: "recruiterId",
          as: "recruiter_info",
        },
      },
      {
        $unwind: "$recruiter_info",
      },
      {
        $project: {
          firstName: "$user_info.firstName",
          lastName: "$user_info.lastName",
          email: "$user_info.email",
          mobileno: "$meta_info.mobileno",
          gender: "$meta_info.gender",
          dateOfBirth: "$meta_info.dateOfBirth",
          experience: "$meta_info.experience",
          address: "$meta_info.address",
          technicalSkills: "$meta_info.technicalSkills",
          recruiterId: "$recruiter_info.userId",
          organizationName: "$recruiter_info.organizationName",
          organizationContact: "$recruiter_info.organizationContact",
          title: 1,
          rounds: 1,
          userId: 1,
        },
      },
    ]);
    sendResponse(scheduleRequestData, 200, res);
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
});

export const userInterviewDetail = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const mongoId = new ObjectId(id);
    const interviewDetail = await Interview.aggregate([
      {
        $match: {
          userId: mongoId,
        },
      },
      {
        $lookup: {
          from: "rounds",
          let: { roundIds: "$rounds" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$roundIds"] },
              },
            },
          ],
          as: "rounds",
        },
      },
      {
        $lookup: {
          from: "userdetails",
          foreignField: "userId",
          localField: "recruiterId",
          as: "recruiter_info",
        },
      },
      {
        $unwind: "$recruiter_info",
      },
      {
        $project: {
          organizationName: "$recruiter_info.organizationName",
          organizationContact: "$recruiter_info.organizationContact",
          title: 1,
          userId: 1,
          rounds: 1,
          recruiterId: 1,
        },
      },
    ]);
    sendResponse(interviewDetail, 200, res);
  } catch (error) {
    next(error);
  }
});

export const getSingleInterview = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    const mongoId = new ObjectId(id);
    const interviewDetail = await Interview.aggregate([
      {
        $match: {
          _id: mongoId,
        },
      },
      {
        $lookup: {
          from: "rounds",
          let: { roundIds: "$rounds" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$roundIds"] },
              },
            },
          ],
          as: "rounds",
        },
      },
      {
        $lookup: {
          from: "userdetails",
          foreignField: "userId",
          localField: "recruiterId",
          as: "recruiter_info",
        },
      },
      {
        $unwind: "$recruiter_info",
      },
      {
        $project: {
          organizationName: "$recruiter_info.organizationName",
          organizationContact: "$recruiter_info.organizationContact",
          title: 1,
          userId: 1,
          rounds: 1,
          recruiterId: 1,
        },
      },
    ]);
    sendResponse(interviewDetail, 200, res);
  } catch (error) {
    console.log(error, "error");
    next(error);
  }
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const interview = await Interview.findByIdAndDelete(id);
    const roundToDelete = interview.rounds;
    await Round.deleteMany({ _id: { $in: roundToDelete } });
    await Reschedule.findOneAndDelete({ interviewId: id });
    res.status(200).json({ success: true, message: "Delted Successfully" });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({ success: false, error });
  }
});

export const editInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, rounds } = req.body;
  try {
    const interview = await Interview.findById(id);
    const isNewRound = Array.isArray(rounds)
      ? rounds.filter((round) => !interview.rounds.includes(round?._id))
      : [];
    let newRounds = [];
    if (isNewRound && isNewRound.length) {
      newRounds = await Round.insertMany(isNewRound);
      newRounds = newRounds.map((round) => round._id);
      newRounds = [...newRounds, ...interview.rounds];
      await Interview.findByIdAndUpdate(
        id,
        {
          $set: {
            title: title,
            rounds: newRounds,
          },
        },
        {
          new: true,
        }
      );
    } else {
      await Interview.findByIdAndUpdate(
        id,
        {
          $set: {
            title: title,
          },
        },
        {
          new: true,
        }
      );
    }
    Array.isArray(rounds) &&
      rounds.forEach(async (round) => {
        await Round.findByIdAndUpdate(
          round._id,
          { $set: round },
          { new: true }
        );
      });
    res.status(200).json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});
