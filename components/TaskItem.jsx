import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { deleteTask, updateTask } from "../api/api";

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onToggleComplete(task)}>
        <Text style={[styles.text, task.completed && styles.completed]}>
          {task.title}
        </Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={() => onDelete(task._id)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  completed: {
    textDecorationLine: "line-through",
  },
});

export default TaskItem;
