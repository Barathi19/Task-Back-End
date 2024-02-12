import asyncHandler from "../middleware/async.js";
import Reschedule from "../model/reschedule.model.js";
import Round from "../model/round.model.js";
import { sendResponse } from "../utils/response.js";

export const editReshedule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedRound = await Reschedule.findOneAndUpdate(
      { roundId: id },
      { $set: req.body },
      { new: true }
    );
    sendResponse(updatedRound, 200, res);
  } catch (error) {
    next(error);
  }
});

export const getRound = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const round = await Reschedule.findOne({ roundId: id });
    sendResponse(round, 200, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export const deleteReshedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Reschedule.findOneAndDelete({ roundId: id });
    console.log(deleted, "deleted");
    await Round.findByIdAndUpdate(
      id,
      {
        $set: {
          isRescheduled: "false",
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

export const editRound = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Round.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    await Reschedule.findOneAndUpdate(
      { roundId: id },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});
