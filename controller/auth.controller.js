import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import UserDetail from "../model/userDetail.model.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import { sendResponse } from "../utils/response.js";

export const register = asyncHandler(async (req, res, next) => {
  const admin = req.user;
  if (admin?.role !== "admin") {
    return next(
      new ErrorResponse("you don't have permission to do this action", 400)
    );
  }
  const { email, firstName, lastName, role } = req.body;
  const userExist = await User.findOne({ email });
  console.log(userExist);
  if (userExist) {
    return next(new ErrorResponse("user already exist", 400));
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: "12345678",
    role,
  });
  let userId = user._id;
  if (userId) {
    await UserDetail.create({
      userId,
    });
  }
  sendResponse(user, 200, res);
});

export const login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }
  const isMatch = await user.matchPassword(req.body.password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 400));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const { password, ...userDetails } = user._doc;
  sendResponse({ ...userDetails, token }, 200, res);
});
