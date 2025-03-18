const swaggerJSDoc = require("swagger-jsdoc");
const { userDoc } = require("../docs/user");
const { examDoc } = require("../docs/exam");
const { questionDoc } = require("../docs/question");
const { userAnswerdoc } = require("../docs/userAnswer");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "IMTAHAN API",
      version: "1.0.0",
      description: "API Documentation for IMTAHAN",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local server",
      },
      {
        url: "http://51.8.13.48/api",
        description: "Local server",
      },
    ],
    paths: {
      ...userDoc,
      ...examDoc,
      ...questionDoc,
      ...userAnswerdoc,
    },
  },
  apis: ["./server/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
