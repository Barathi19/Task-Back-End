import express from "express";
import { login, register } from "../controller/auth.controller.js";
import { protect } from "../middleware/jwt.js";

const router = express.Router();

router.post("/register", protect, register);
router.post("/login", login);

export default router;
