const Exam = require("../models/exam");
const Question = require("../models/question");
const { v4: uuidv4 } = require("uuid");

exports.AddQuestion = async (req, res) => {
  try {
    const exam = await Exam.findOne({ id: req.body.examId });
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
    const newQuestion = new Question({
      id: uuidv4(),
      text: req.body.text,
      options: req.body.options,
      correctAnswer: req.body.correctAnswer,
      imageUrls: req.body.imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
      examId: req.body.examId,
    });
    await newQuestion.save();
    exam.questions.push(newQuestion.id);
    await exam.save();
    res.status(200).json({ success: true, message: "Sual əlavə edildi" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({ id: req.params.id });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Sual tapılmadı",
      });
    }
    const exam = await Exam.findOne({ id: question.examId });
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
    res.status(200).json({ success: true, data: question });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ id: req.params.id });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Sual tapılmadı",
      });
    }
    const exam = await Exam.findOne({ id: question.examId });
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
    await Question.findOneAndUpdate(
      { id: req.params.id },
      {
        text: req.body.text,
        options: req.body.options,
        correctAnswer: req.body.correctAnswer,
        imageUrls: req.body.imageUrls,
        updatedAt: new Date(),
      }
    );
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ id: req.params.id });
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Sual tapılmadı",
      });
    }
    const exam = await Exam.findOne({ id: question.examId });
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
    await Question.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ success: true, message: "Sual silindi" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Xəta baş verdi" });
  }
};
