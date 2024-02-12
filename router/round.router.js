import express from "express";
import {
  deleteReshedule,
  editReshedule,
  editRound,
  getRound,
} from "../controller/round.contoller.js";

const router = express.Router();

router.put("/:id", editReshedule); // id - round
router.get("/:id", getRound);
router.delete("/:id", deleteReshedule);
router.put("/status/:id", editRound); // id - round

export default router;
