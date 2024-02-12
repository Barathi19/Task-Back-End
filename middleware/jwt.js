import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(400).json("Not authorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id, { password: 0 });
    next();
  } catch (error) {
    return res.status(400).json("Not authorized");
  }
};
