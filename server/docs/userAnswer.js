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
                score: { type: "number" },
              },
              required: ["examId", "answers", "score"],
            },
          },
        },
      },
      responses: {
        200: { description: "User answer added" },
        400: { description: "Error occurred" },
      },
    },
  },
  "/user-answers/{id}": {
    get: {
      summary: "Get user answer",
      tags: ["User answers"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "User answer details" },
        400: { description: "Error occurred" },
      },
    },
  },
};
