const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const { authenticate } = require("../middlewares/auth");

router.put("/:id", authenticate, examController.updateExam);
router.delete("/", authenticate, examController.deleteExam);
router.get("/:category", authenticate, examController.getExams);
router.get("/id/:id", authenticate, examController.getExamById);
router.post("/", authenticate, examController.createExam);
router.post("/:id/status", authenticate, examController.changeExamStatus);

module.exports = router;
