const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ExamSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    writer: {
      type: String,
      required: true,
      unique: true,
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
    questions: {
      type: Array,
      required: true,
    },
    accessLevel: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
);

module.exports = mongoose.model("Exam", ExamSchema);
