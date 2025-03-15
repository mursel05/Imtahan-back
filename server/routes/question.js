const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { authenticate } = require("../middlewares/auth");

router.put("/", authenticate, questionController.updateQuestion);
router.delete("/", authenticate, questionController.deleteQuestion);
router.get("/:id", authenticate, questionController.getQuestionById);
router.post("/", authenticate, questionController.AddQuestion);

module.exports = router;
