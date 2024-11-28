const axios = require("axios"); // HTTP client for making API requests
const express = require("express"); // Web framework for handling server routes
const multer = require("multer"); // Middleware for handling file uploads
const pdfParse = require("pdf-parse"); // Library for parsing PDF files

class OpenAIService {
  /**
   * Constructs the OpenAIService instance with an API key.
   * @param {string} apiKey - The API key for authenticating requests to OpenAI.
   */
  constructor(apiKey) {
    this.apiKey = apiKey; // Storing the API key for OpenAI
    this.apiUrl = "https://api.openai.com/v1/chat/completions"; // OpenAI API URL
    
    // this.s3TodoRepository = new S3TodoRepository();
  }

  /**
   * Generates a list of interview preparation tasks using OpenAI.
   * @param {string} interviewDate - The scheduled date for the interview.
   * @param {string} position - The job position for the interview.
   * @param {string} experienceLevel - The experience level required (e.g., "Junior", "Senior").
   * @returns {Object} - The response containing the list of generated tasks.
   */
  async generateInterviewTasks(interviewDate, position, experienceLevel) {
    // Defining the task generation prompt for OpenAI
    const prompt = `Please generate a JSON object with a list of tasks for a ${experienceLevel} ${position} interview scheduled on ${interviewDate}. Each task should contain the following attributes:
- "id": A unique identifier for the task (e.g., "1").
- "title": The title of the task (e.g., "Technical Preparation").
- "description": A detailed description of the task.
- "priority": The priority level of the task (e.g., "High").
- "dueDate": The due date for the task in the format "YYYY-MM-DD".
- "completed": A boolean indicating whether the task is completed or not (e.g., true or false).
`;

    try {
      // Sending a request to OpenAI API to generate tasks
      const response = await axios.post(
        this.apiUrl,
        {
          model: "gpt-3.5-turbo", // The model used for task generation
          messages: [
            {
              role: "system",
              content: "Generate an interview preparation plan.",
            },
            { role: "user", content: prompt },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`, // Using the API key for authorization
          },
        }
      );

      // const generatedResponse = {
      //   todos: [{ id: "1", title: "Task 1", description: "Description", priority: "High", dueDate: "2024-12-01", completed: false }]
      // };

      // Uncomment if you want to save tasks to S3
      // await this.s3TodoRepository.saveTodos({ todos: response.data.todos });

      return response.data; // Return the generated tasks
    } catch (error) {
      // Handle and log errors
      console.error("Error:", error);
      if (error.response?.status === 429) {
        // Handle rate limiting errors
        throw new Error("Too many requests. Please try again later.");
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  }

  /**
   * Analyzes a resume uploaded as a PDF and provides feedback using OpenAI.
   * @param {Buffer} pdfBuffer - The binary data of the uploaded PDF file.
   * @returns {Object} - An object containing positive aspects and areas for improvement in the resume.
   */
  async analyzeResume(pdfBuffer) {
    try {
      // Parsing the uploaded PDF to extract text content
      const data = await pdfParse(pdfBuffer);
      const resumeText = data.text; // Extracted text from the resume

      // Sending the extracted text to OpenAI for analysis
      const gptResponse = await axios.post(
        this.apiUrl,
        {
          model: "gpt-3.5-turbo", // The model used for resume analysis
          messages: [
            {
              role: "system",
              content:
                "You are a professional resume reviewer. Please analyze the resume provided by the user and list both the positive aspects and areas for improvement in two sections.",
            },
            { role: "user", content: resumeText }, // Sending the extracted resume text
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`, // Using the API key for authorization
          },
        }
      );

      // Parsing the response to extract recommendations
      const recommendations = gptResponse.data.choices[0].message.content;
      const [positiveAspectsSection, improvementSection] = recommendations
        .split("Areas for Improvement:")
        .map((section) => section.trim());

      // Returning structured feedback
      return {
        positiveAspects: positiveAspectsSection
          .replace("Positive Aspects:", "")
          .trim(),
        areasForImprovement: improvementSection
          ? improvementSection.trim()
          : "",
      };
    } catch (error) {
      // Log errors during resume analysis
      console.error("Error processing resume with OpenAI:", error);
      throw new Error("Error processing resume.");
    }
  }
}

module.exports = OpenAIService; 
