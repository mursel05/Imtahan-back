const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answer = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const UserAnswer = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
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
  answers: {
    type: [answer],
    required: true,
  },
  examId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("UserAnswer", UserAnswer);
