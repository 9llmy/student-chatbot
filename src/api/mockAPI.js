// mockAPI.js - Fake API responses for development/testing

export const Core = {
  InvokeLLM: async (prompt) => {
    return {
      success: true,
      result: {
        output: `Mock response to: "${prompt}"`
      }
    };
  },
  SendEmail: async ({ to, subject, body }) => {
    return {
      success: true,
      message: `Mock email sent to ${to} with subject "${subject}".`
    };
  },
  UploadFile: async (file) => {
    return {
      success: true,
      fileUrl: "https://example.com/fake-uploaded-file"
    };
  },
  GenerateImage: async (description) => {
    return {
      success: true,
      imageUrl: "https://example.com/fake-image.jpg"
    };
  },
  ExtractDataFromUploadedFile: async (file) => {
    return {
      success: true,
      data: { extracted: "Sample extracted data from file" }
    };
  }
};

// Export InvokeLLM directly
export const InvokeLLM = Core.InvokeLLM;
