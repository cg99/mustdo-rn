import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

// Fetch tasks query
export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Create task mutation with optimistic update
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries(["tasks"]);
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) => [...old, newTask]);

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        type: "active",
        exact: true,
      });
    },
  });
};

// Update task mutation with optimistic update
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries(["tasks"]);
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) =>
        old.map((task) =>
          task._id === updatedTask._id ? { ...task, ...updatedTask } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        type: "active",
        exact: true,
      });
    },
  });
};

// Delete task mutation with optimistic update
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries(["tasks"]);
      const previousTasks = queryClient.getQueryData(["tasks"]);
      queryClient.setQueryData(["tasks"], (old) =>
        old.filter((task) => task._id !== taskId)
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
        type: "active",
        exact: true,
      });
    },
  });
};
