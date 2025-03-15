const express = require("express");
const router = express.Router();
const userAnswerController = require("../controllers/userAnswerController");
const { authenticate } = require("../middlewares/auth");

router.post("/", authenticate, userAnswerController.addUserAnswer);
router.post("/get-answer", authenticate, userAnswerController.getUserAnswer);

module.exports = router;
