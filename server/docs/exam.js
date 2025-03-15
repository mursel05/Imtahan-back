exports.examDoc = {
  "/exams": {
    get: {
      summary: "Get all exams of the authenticated user",
      tags: ["Exams"],
      responses: {
        200: { description: "List of exams" },
        400: { description: "Error occurred" },
      },
    },
    post: {
      summary: "Create an exam",
      tags: ["Exams"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                subject: { type: "string" },
                accessLevel: { type: "string" },
              },
              required: ["name", "subject", "accessLevel"],
            },
          },
        },
      },
      responses: {
        201: { description: "Exam created" },
        400: { description: "Error occurred" },
      },
    },
  },
  "/exams/{id}": {
    get: {
      summary: "Get an exam by ID",
      tags: ["Exams"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Exam details" },
        400: { description: "Error occurred" },
      },
    },
    put: {
      summary: "Update an exam",
      tags: ["Exams"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                questions: { type: "array", items: { type: "string" } },
                subject: { type: "string" },
                accessLevel: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Exam updated" },
        400: { description: "Error occurred" },
        404: { description: "Exam not found" },
      },
    },
    delete: {
      summary: "Delete an exam",
      tags: ["Exams"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Exam deleted" },
        400: { description: "Error occurred" },
        404: { description: "Exam not found" },
      },
    },
  },
  "/exams/{id}/status": {
    post: {
      summary: "Change exam status",
      tags: ["Exams"],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                active: { type: "boolean" },
              },
              required: ["active"],
            },
          },
        },
      },
      responses: {
        200: { description: "Exam status changed" },
        400: { description: "Error occurred" },
        404: { description: "Exam not found" },
      },
    },
  },
};
