const UserAnswer = require("../models/userAnswer");
const { v4: uuidv4 } = require("uuid");
const Exam = require("../models/exam");

exports.addUserAnswer = async (req, res) => {
  try {
    const exam = Exam.findOne({ id: req.body.examId });
    if (!exam) {
      res.status(404).json({
        success: false,
        message: "İmtahan tapılmadı",
      });
    }
    let userAnswer = await UserAnswer.findOne({
      examId: req.body.examId,
      userId: req.userId,
    });
    if (userAnswer) {
      userAnswer.answers = req.body.answers;
      userAnswer.score = req.body.score;
      userAnswer.updatedAt = new Date();
    } else {
      userAnswer = new UserAnswer({
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        answers: req.body.answers,
        userId: req.userId,
        examId: req.body.examId,
        score: req.body.score,
      });
    }
    await userAnswer.save();
    res.status(201).json({ success: true, data: userAnswer });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getUserAnswer = async (req, res) => {
  try {
    const userAnswer = await UserAnswer.findOne({
      examId: req.body.examId,
      userId: req.userId,
    });
    if (!userAnswer) {
      res.status(404).json({
        success: false,
        message: "İstifadəçinin cavabı tapılmadı",
      });
    }
    res.status(200).json({ success: true, data: userAnswer });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};
