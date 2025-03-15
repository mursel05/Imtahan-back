const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const QuestionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    examId: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model("Question", QuestionSchema);
