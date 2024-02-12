import express from "express";
import {
  allRescheduleRequest,
  createInterview,
  deleteInterview,
  editInterview,
  getSheduledData,
  getSingleInterview,
  rescheduleRequest,
  userInterviewDetail,
} from "../controller/interview.controller.js";

const router = express.Router();

router.post("/", createInterview);
router.post("/reschedule", rescheduleRequest);
router.get("/rescheduledata/:id", allRescheduleRequest);
router.get("/scheduledata/:id", getSheduledData); // id - recruiterId
router.get("/:id", userInterviewDetail); // id - userID
router.put("/:id", editInterview); // id - interview
router.delete("/:id", deleteInterview); // id - interview
router.get("/userinterview/:id", getSingleInterview); // id -interview

export default router;
