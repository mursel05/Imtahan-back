const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const { authenticate } = require("../middlewares/auth");

router.put("/", authenticate, examController.updateExam);
router.delete("/", authenticate, examController.deleteExam);
router.get("/", examController.getExams);
router.get("/:id", examController.getExamById);
router.post("/", authenticate, examController.createExam);
router.post("/:id/status", authenticate, examController.changeExamStatus);

module.exports = router;
