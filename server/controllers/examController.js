const Exam = require("../models/exam");
const Question = require("../models/question");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "İmtahan tapılmadı",
      });
    }
    if (req.userId !== exam.writer) {
      return res.status(403).json({
        success: false,
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }
    await Exam.findOneAndUpdate(
      { id: req.params.id },
      {
        name: req.body.name,
        description: req.body.description,
        questions: req.body.questions,
        updatedAt: new Date(),
        subject: req.body.subject,
        accessLevel: req.body.accessLevel,
      }
    );
    res.status(200).json({ success: true, message: "Məlumatlar yeniləndi" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findOne({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "İmtahan tapılmadı",
      });
    }
    if (req.userId !== exam.writer) {
      return res.status(403).json({
        success: false,
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }
    await Exam.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ success: true, message: "İmtahan silindi" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findOne({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "İmtahan tapılmadı",
      });
    }
    if (req.userId !== exam.writer) {
      return res.status(403).json({
        success: false,
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }
    const questions = await Question.find({ id: { $in: exam.questions } });
    exam.questions = questions;
    res.status(200).json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({ writer: req.userId });
    res.status(200).json({ success: true, exams });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.createExam = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.userId });
    if (user.role !== "teacher") {
      return res.status(404).json({
        success: false,
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }
    const exam = await Exam.create({
      id: uuidv4(),
      name: req.body.name,
      description: req.body.description,
      questions: [],
      writer: req.userId,
      subject: req.body.subject,
      accessLevel: req.body.accessLevel,
      active: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ success: true, exam });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.changeExamStatus = async (req, res) => {
  try {
    const exam = await Exam.findOne({ id: req.params.id });
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "İmtahan tapılmadı",
      });
    }
    if (req.userId !== exam.writer) {
      return res.status(403).json({
        success: false,
        message: "Bu əməliyyatı yerinə yetirmək üçün icazəniz yoxdur",
      });
    }
    await Exam.findOneAndUpdate(
      { id: req.params.id },
      {
        active: req.body.active,
      }
    );
    res.status(200).json({
      success: true,
      message: req.body.active
        ? "İmtahan aktivləşdirildi"
        : "İmtahan deaktivləşdirildi",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};
