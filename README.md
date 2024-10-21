# frontend

This project is a ToDo List Application built with a Vue.js frontend and a Node.js backend. The application is designed to help users manage tasks efficiently. 
It allows users to add, view, and delete tasks, with tasks categorized by priority. 
The frontend interacts with the backend through RESTful APIs, and all tasks are stored in AWS S3.

Key Features:

	1.	Display Task List: The homepage shows a list of all tasks (ToDo items), color-coded by priority.
	2.	Task Details: Clicking on any task reveals its detailed information.
	3.	Priority-Based Coloring: Tasks are marked with different colors based on their priority (High, Medium, Low).
	4.	Completed Tasks: Tasks that are completed are displayed with strikethrough text.
	5.	Task Management: Users can create, delete, and manage their tasks.
	6.	Backend with AWS S3: All tasks are stored in AWS S3 for persistent storage.
Project Setup and Installation

This project is a ToDo List Application built with a Vue.js frontend and a Node.js backend. The application is designed to help users manage tasks efficiently. 
It allows users to add, view, and delete tasks, with tasks categorized by priority. 
The frontend interacts with the backend through RESTful APIs, and all tasks are stored in AWS S3.

Key Features:

	1.	Display Task List: The homepage shows a list of all tasks (ToDo items), color-coded by priority.
	2.	Task Details: Clicking on any task reveals its detailed information.
	3.	Priority-Based Coloring: Tasks are marked with different colors based on their priority (High, Medium, Low).
	4.	Completed Tasks: Tasks that are completed are displayed with strikethrough text.
	5.	Task Management: Users can create, delete, and manage their tasks.
	6.	Backend with AWS S3: All tasks are stored in AWS S3 for persistent storage.
Project Setup and Installation

## Project setup
```
npm install

npm install express cors body-parser dotenv aws-sdk @aws-sdk/client-s3 uuid

npm install vue vue-router vuex axios core-js postcss vee-validate yup @fontsource/dancing-script

npm install --save-dev @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-plugin-router @vue/cli-plugin-typescript @vue/cli-plugin-unit-jest @vue/cli-plugin-vuex @vue/cli-plugin-pwa @vue/cli-plugin-e2e-cypress @vue/eslint-config-typescript concurrently cypress jest ts-jest typescript babel-jest @types/jest @types/uuid
npm init -y

npm install @aws-sdk/client-s3 @fontsource/dancing-script aws-sdk axios body-parser core-js cors dotenv express postcss register-service-worker uuid vee-validate vue vue-router vuex yup

Install devDependencies:

npm install --save-dev @types/jest @types/uuid @typescript-eslint/eslint-plugin @typescript-eslint/parser @vue/cli-plugin-babel @vue/cli-plugin-e2e-cypress @vue/cli-plugin-eslint @vue/cli-plugin-pwa @vue/cli-plugin-router @vue/cli-plugin-typescript @vue/cli-plugin-unit-jest @vue/cli-plugin-vuex @vue/cli-service @vue/eslint-config-typescript @vue/test-utils @vue/vue3-jest babel-jest concurrently cypress eslint eslint-plugin-vue jest sass sass-loader ts-jest typescript
```

### Compiles and hot-reloads for development
Make sure your package.json has the dev script configured correctly. It should look something like this:

"scripts": {
  "serve": "vue-cli-service serve",
  "build": "vue-cli-service build",
  "test:unit": "vue-cli-service test:unit",
  "test:e2e": "vue-cli-service test:e2e",
  "lint": "vue-cli-service lint",
  "start": "node index.js", // This should point to your backend entry point
  "dev": "concurrently \"npm run serve\" \"npm run start\"" // This runs both frontend and backend
}


```
npm install --save-dev concurrently

npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
