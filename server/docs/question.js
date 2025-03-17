exports.questionDoc = {
  "/questions": {
    post: {
      summary: "Add a question to an exam",
      tags: ["Questions"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                examId: { type: "string" },
                text: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correctAnswer: { type: "string" },
                imageUrls: { type: "array", items: { type: "string" } },
              },
              required: ["examId", "text", "options", "correctAnswer"],
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
  "/questions/{id}": {
    get: {
      summary: "Get a question by ID",
      tags: ["Questions"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Question details" },
        400: { description: "Error occurred" },
      },
    },
    put: {
      summary: "Update a question",
      tags: ["Questions"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                text: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correctAnswer: { type: "string" },
                imageUrls: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Question updated" },
        400: { description: "Error occurred" },
      },
    },
    delete: {
      summary: "Delete a question",
      tags: ["Questions"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        200: { description: "Question deleted" },
        400: { description: "Error occurred" },
      },
    },
  },
};
