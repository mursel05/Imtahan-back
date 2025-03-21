const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./server/config/db");
const userRoutes = require("./server/routes/user");
const questionRoutes = require("./server/routes/question");
const examRoutes = require("./server/routes/exam");
const userAnswerRoutes = require("./server/routes/userAnswer");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./server/config/swagger");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/user-answers", userAnswerRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  console.error("Error: ", err);
  res.status(500).json({ success: false, message: "Server error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/api-docs`);
});
