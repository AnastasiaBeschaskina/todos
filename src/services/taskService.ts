// // src/services/taskService.ts

// import { Todo } from "@/types/todo";
// // import { addTodo, deleteTodo, updateTodo } from "@/api/todoService";
// import { addTodo, deleteTodo } from "@/api/todoService";
// import * as yup from "yup";

// // Валидация для задачи
// const taskSchema = yup.object({
//   title: yup.string().required("Please enter the task title."),
//   description: yup.string().required("Don’t forget to add a task description!"),
//   priority: yup.string().required("Please choose a task priority."),
//   dueDate: yup.string().required("Please select a due date."),
// });

// // Функция для добавления новой задачи
// export async function submitTask(task: Todo, validationErrors: any, emit: any) {
//   validationErrors.value = {}; // Очистка ошибок валидации
//   try {
//     await taskSchema.validate(task, { abortEarly: false });
//     const newTask = await addTodo(task); // Запрос к серверу на добавление
//     emit("taskAdded", newTask); // Отправка события
//     return newTask;
//   } catch (error) {
//     if (error instanceof yup.ValidationError) {
//       error.inner.forEach((err) => {
//         validationErrors.value[err.path as keyof typeof validationErrors.value] = err.message;
//       });
//     }
//     throw error;
//   }
// }

// // Функция для удаления задачи
// export async function deleteTask(taskId: string) {
//   try {
//     await deleteTodo(taskId); // Запрос к серверу на удаление
//     console.log(`Task with ID ${taskId} deleted successfully`);
//   } catch (error) {
//     console.error("Error deleting task:", error);
//   }
// }

// // Функция для редактирования задачи
// export async function editTask(task: Todo, validationErrors: any) {
//   validationErrors.value = {};
//   try {
//     await taskSchema.validate(task, { abortEarly: false });
//     const updatedTask = await updateTodo(task); // Запрос на обновление задачи
//     return updatedTask;
//   } catch (error) {
//     if (error instanceof yup.ValidationError) {
//       error.inner.forEach((err) => {
//         validationErrors.value[err.path as keyof typeof validationErrors.value] = err.message;
//       });
//     }
//     throw error;
//   }
// }
