import express from "express";
import {
  changePassword,
  deleteUser,
  getAllUser,
  getSingleUser,
  updateUser,
} from "../controller/user.controller.js";
import { protect } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", getAllUser);
router.get("/:id", getSingleUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/", protect, changePassword);

export default router;
