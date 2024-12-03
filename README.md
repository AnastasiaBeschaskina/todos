# ToDo and Interview Preparation Platform

- Overview
  - This is a full-stack application designed to help users efficiently manage tasks and prepare for job interviews. The platform combines the functionality of a To-Do List with tools to assist job seekers by generating personalized interview preparation schedules and providing AI-powered CV analysis.
  - The frontend is built with Vue.js, and the backend leverages Node.js. Tasks and data are securely stored using AWS S3, and the application integrates the OpenAI API for advanced AI-driven features.
    
## Key Features

### Task Management
  - Task List Display: The homepage displays all tasks in a user-friendly list, color-coded based on their priority (High, Medium, Low).
  - Task Details: Clicking on a task reveals detailed information, such as the task’s title, description, and due date.
  - Priority-Based Coloring: Tasks are visually categorized by priority levels for better organization.
  - Completed Tasks: Tasks that are completed are displayed with strikethrough text for easy differentiation.
  - Create, Update, and Delete Tasks: Users can efficiently manage tasks through a responsive interface.
  - AWS S3 Integration: All task data is stored in Amazon S3, ensuring scalability and persistence.

### Interview Preparation
  - Personalized Task Scheduler: Generates customized task schedules with deadlines, based on user-provided inputs like career goals and interview timelines.
  - CV Analysis and Feedback: AI-driven analysis of uploaded resumes, highlighting strengths and offering actionable suggestions for improvement.
  - Task-Based Preparation: The platform helps users stay organized by breaking down interview preparation into manageable tasks.
  - Interactive UI: A seamless and intuitive design enhances user navigation, making task and schedule management straightforward.
    
## Technologies Used

	•	Frontend: Vue.js, CSS, JavaScript, TypeScript
	•	Backend: Node.js
	•	Database & Storage: MySQL, AWS S3 (for JSON task storage)
	•	AI Integration: OpenAI API for CV analysis and task generation
	•	APIs: RESTful APIs for frontend-backend communication
![Project Image](/project2.png)
## Project setup
```
npm install

npm install express cors body-parser dotenv aws-sdk @aws-sdk/client-s3 uuid

npm install vue vue-router vuex axios core-js postcss vee-validate yup @fontsource/dancing-script

npm install --save-dev @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-plugin-router @vue/cli-plugin-typescript @vue/cli-plugin-unit-jest @vue/cli-plugin-vuex @vue/cli-plugin-pwa @vue/cli-plugin-e2e-cypress @vue/eslint-config-typescript concurrently cypress jest ts-jest typescript babel-jest @types/jest @types/uuid
```

## Configure Environment Variables

To allow the application to interact with AWS S3, create an .env file in the backend root directory with the following content:
```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
```

Replace your-access-key-id, your-secret-access-key, your-region, and your-bucket-name with your actual AWS credentials and bucket details.


## Compiles and hot-reloads for development
Make sure your package.json has the dev script configured correctly. It should look something like this:
```
"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "test:unit": "vue-cli-service test:unit",
  "test:e2e": "vue-cli-service test:e2e",
  "lint": "vue-cli-service lint",
  "start": "node index.js", 
  "dev": "concurrently \"npm run serve\" \"npm run start\"" 
}
```
## Run the Application

```
npm run dev
```

