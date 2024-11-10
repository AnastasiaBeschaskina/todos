const axios = require("axios"); // Importing axios to make HTTP requests
const express = require("express"); // Importing express to set up the web server
const multer = require("multer"); // Importing multer to handle file uploads
const pdfParse = require("pdf-parse"); // Importing pdf-parse to parse PDF files

class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey; // Storing the API key for OpenAI
    this.apiUrl = "https://api.openai.com/v1/chat/completions"; // Defining the OpenAI API URL for chat completions
  }

  // Method to generate interview tasks based on the interview date, position, and experience level
  async generateInterviewTasks(interviewDate, position, experienceLevel) {
    // Constructing the prompt for the OpenAI API to generate interview tasks
    const prompt = `Please generate a JSON object with a list of tasks for a ${experienceLevel} ${position} interview scheduled on ${interviewDate}. Each task should contain the following attributes:
- "id": A unique identifier for the task (e.g., "1").
- "title": The title of the task (e.g., "Technical Preparation").
- "description": A detailed description of the task.
- "priority": The priority level of the task (e.g., "High").
- "dueDate": The due date for the task in the format "YYYY-MM-DD".
- "completed": A boolean indicating whether the task is completed or not (e.g., true or false).

Please generate a list of tasks, structured like this:
{
  "todos": [
    {
      "id": "1",
      "title": "Frontend Development with Vue.js",
      "description": "Build the frontend of the application using Vue.js.",
      "priority": "High",
      "dueDate": "2024-10-16",
      "completed": true
    },
    {
      "id": "2",
      "title": "Implement Database Integration",
      "description": "Connect the backend with the database to perform CRUD operations.",
      "priority": "High",
      "dueDate": "2024-10-17",
      "completed": false
    }
  ]
}`;

    try {
      // Making the request to OpenAI API to generate interview tasks
      // const response = await axios.post(
      //   "https://api.openai.com/v1/chat/completions",
      //   {
      //     model: "gpt-3.5-turbo",
      //     messages: [
      //       {
      //         role: "system",
      //         content: "Generate an interview preparation plan.",
      //       },
      //       { role: "user", content: prompt },
      //     ],
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      //     },
      //   }
      // );

      // For testing, using a static response with predefined interview tasks
      const generatedResponse = {
        todos: [
          {
            id: "1",
            title: "Data Structures and Algorithms Revision",
            description:
              "Refresh your knowledge of essential data structures and algorithms commonly asked in interviews.",
            priority: "High",
            dueDate: "2024-11-30",
            completed: false,
          },
          {
            id: "2",
            title: "System Design Practice",
            description:
              "Practice designing scalable and efficient systems, focusing on trade-offs, scalability, and system architecture.",
            priority: "High",
            dueDate: "2024-12-03",
            completed: false,
          },
          {
            id: "3",
            title: "Mock Interviews",
            description:
              "Participate in mock interviews to simulate the real interview environment and receive feedback on areas of improvement.",
            priority: "High",
            dueDate: "2024-12-06",
            completed: false,
          },
          {
            id: "4",
            title: "Review Past Projects",
            description:
              "Revisit and be prepared to discuss the projects you have worked on, highlighting your role, challenges faced, and the solutions implemented.",
            priority: "Medium",
            dueDate: "2024-12-08",
            completed: false,
          },
          {
            id: "5",
            title: "Behavioral Interview Preparation",
            description:
              "Prepare answers to common behavioral interview questions, focusing on your experiences, strengths, weaknesses, and how you handle challenges.",
            priority: "Medium",
            dueDate: "2024-12-09",
            completed: false,
          },
          {
            id: "6",
            title: "Technical Presentation",
            description:
              "Prepare a brief technical presentation showcasing a project you have worked on, emphasizing your technical skills and problem-solving abilities.",
            priority: "Medium",
            dueDate: "2024-12-10",
            completed: false,
          },
        ],
      };

      // Returning the generated response
      return generatedResponse;
    } catch (error) {
      // Handling errors, including rate limiting (too many requests)
      console.error("Error:", error);
      if (error.response?.status === 429) {
        res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      } else {
        res.status(500).json({ message: "An unexpected error occurred." });
      }
    }
  }

  // Method to analyze a resume uploaded as a PDF and provide feedback using OpenAI API
  async analyzeResume(pdfBuffer) {
    try {
      // Parsing the PDF to extract the resume text
      const data = await pdfParse(pdfBuffer);
      const resumeText = data.text;

      // Calling OpenAI API to get feedback on the resume
      const gptResponse = await axios.post(
        this.apiUrl,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional resume reviewer. Please analyze the resume provided by the user and list both the positive aspects and areas for improvement in two sections.",
            },
            { role: "user", content: resumeText },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      // Extracting the feedback from OpenAI response
      const recommendations = gptResponse.data.choices[0].message.content;
      //    const recommendations = [
      //   "The resume clearly highlights the candidate's technical skills and showcases hands-on experience with relevant technologies like JavaScript, React, Node.js, and MySQL. - The candidate has provided specific examples of projects worked on, outlining the technologies used and the impact of their contributions. - The inclusion of additional skills, such as troubleshooting, team collaboration, and adaptability, helps to paint a more well-rounded picture of the candidate.",
      //   "Consider adding a professional summary at the beginning of the resume to provide a brief overview of the candidate's experience, key strengths, and career goals. - Include specific achievements or quantifiable results from the projects worked on to demonstrate the impact of your work more effectively. - Provide more details about the roles in the work experience section, such as the size of the team worked with, any challenges overcome, or any leadership responsibilities held. - Ensure consistency in formatting and punctuation throughout the resume, such as using bullet points consistently and aligning the dates of professional experience entries.",
      // ];

      // Splitting recommendations into positive aspects and areas for improvement
      const [positiveAspectsSection, improvementSection] = recommendations
        .split("Areas for Improvement:")
        .map((section) => section.trim());

      return {
        positiveAspects: positiveAspectsSection
          .replace("Positive Aspects:", "")
          .trim(),
        areasForImprovement: improvementSection
          ? improvementSection.trim()
          : "",
      };
    } catch (error) {
      // Logging and handling errors that occur during resume analysis
      console.error("Error processing resume with OpenAI:", error);
      throw new Error("Error processing resume.");
    }
  }
}

module.exports = OpenAIService;
