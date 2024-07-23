import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchTasks = async () => {
  const response = await fetch("YOUR_API_ENDPOINT/tasks");
  return response.json();
};

const addTask = async (newTask) => {
  const response = await fetch("YOUR_API_ENDPOINT/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  });
  return response.json();
};

const deleteTask = async (taskId) => {
  await fetch(`YOUR_API_ENDPOINT/tasks/${taskId}`, {
    method: "DELETE",
  });
};

export const useTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery("tasks", fetchTasks, {
    placeholderData: async () => {
      const storedTasks = await AsyncStorage.getItem("tasks");
      return storedTasks ? JSON.parse(storedTasks) : [];
    },
  });

  const addTaskMutation = useMutation(addTask, {
    onMutate: async (newTask) => {
      await queryClient.cancelQueries("tasks");
      const previousTasks = queryClient.getQueryData("tasks");
      queryClient.setQueryData("tasks", (old) => [...old, newTask]);
      return { previousTasks };
    },
    onSettled: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const deleteTaskMutation = useMutation(deleteTask, {
    onMutate: async (taskId) => {
      await queryClient.cancelQueries("tasks");
      const previousTasks = queryClient.getQueryData("tasks");
      queryClient.setQueryData("tasks", (old) =>
        old.filter((task) => task._id !== taskId)
      );
      return { previousTasks };
    },
    onSettled: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  return { tasksQuery, addTaskMutation, deleteTaskMutation };
};
