const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateExamQuestions = async (subject, numQuestions, difficulty) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `Generate ${numQuestions} multiple-choice questions for a ${difficulty} level ${subject} exam. 
        Provide four options per question and indicate the correct answer.`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return null;
    }
};

module.exports = { generateExamQuestions };
