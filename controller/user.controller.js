import asyncHandler from "../middleware/async.js";
import User from "../model/user.model.js";
import UserDetail from "../model/userDetail.model.js";
import { ObjectId } from "mongodb";
import { sendResponse } from "../utils/response.js";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from "bcrypt";

// get single user
export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userID = new ObjectId(id);
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: userID,
        },
      },
      {
        $lookup: {
          from: "userdetails",
          foreignField: "userId",
          localField: "_id",
          as: "User_Info",
        },
      },
      {
        $unwind: {
          path: "$User_Info",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    sendResponse(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

//get all user
export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await User.aggregate([
      {
        $lookup: {
          from: "userdetails",
          foreignField: "userId",
          localField: "_id",
          as: "User_Info",
        },
      },
      {
        $unwind: "$User_Info",
      },
      {
        $match: {
          role: { $ne: "admin" },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);
    sendResponse(allUser, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// update
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateDate = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: updateDate,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return next(new ErrorResponse("user not found", 400));
    }
    const updatedUserDetail = await UserDetail.findOneAndUpdate(
      { userId: id },
      { $set: updateDate },
      { new: true }
    );
    if (!updatedUserDetail) {
      return next(new ErrorResponse("user not found", 400));
    }
    res.status(200).json("updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

//delete
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    await UserDetail.findOneAndDelete({ userId: id });
    res.status(200).json({ success: true, message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

//password change
export const changePassword = asyncHandler(async (req, res, next) => {
  const user = req.user._id;
  const { password } = req.body;
  let Password = password;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    Password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(
    user,
    {
      $set: { password: Password, token: null },
    },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "Success", data: updatedUser });
});
