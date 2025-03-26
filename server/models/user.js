const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
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
  subscription: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "student",
  },
  paidExams: {
    type: [String],
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("User", UserSchema);
