import axios from "axios";

// Normally this would be stored in an env variable and injected through the CI/CD pipeline
const baseURL = "http://localhost:3007/api/todoItems";

export const addToDo = async (toDoItem) => {
  try {
    const response = await axios.post(baseURL, toDoItem);
    return { success: true, data: response.data }
  }
  catch (error) {
    return { success: false, error: error.response.data };
  }
};

export const getToDoItems = async () => {
  try {
    const response = await axios.get(baseURL);
    return { success: true, data: response.data }
  }
  catch (error) {
    return { success: false, error: error.response.data };
  }
};

export const markAsCompleted = async (toDoItem) => {
  const { id } = toDoItem;
  const url = `${baseURL}/${id}`;
  const input = { ...toDoItem, isCompleted: true };
  try {
    const response = await axios.put(url, input);
    return { success: true, data: response.data }
  }
  catch (error) {
    return { success: false, error: error.response.data };
  }
};