exports.userAnswerdoc = {
  "/user-answers": {
    post: {
      summary: "Add user answer",
      tags: ["User answers"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                examId: { type: "string" },
                answers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      questionId: { type: "string" },
                      answer: { type: "string" },
                    },
                    required: ["questionId", "answer"],
                  },
                },
                score: { type: "string" },
              },
              required: ["examId", "answers", "score"],
            },
          },
        },
      },
      responses: {
        200: { description: "Question added" },
        400: { description: "Error occurred" },
      },
    },
  },
  "/user-answers/get-answer": {
    post: {
      summary: "Get user answer",
      tags: ["User answers"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                examId: { type: "string" },
              },
              required: ["examId"],
            },
          },
        },
      },
      responses: {
        200: { description: "Question added" },
        400: { description: "Error occurred" },
      },
    },
  },
};
