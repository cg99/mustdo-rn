import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AccessibilityInfo } from 'react-native';
import DeleteIcon from './icons/DeleteIcon';
import Checkbox from 'expo-checkbox';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  // Accessibility label and hint for the checkbox
  const checkboxAccessibilityLabel = task.completed
    ? `Completed ${task.title}`
    : `Not completed ${task.title}`;

  return (
    <View style={styles.taskContainer}>
      <Checkbox
        value={task.completed}
        onValueChange={() => onToggleComplete(task)}
        color={task.completed ? '#378fe6' : '#d0dbea'}
        accessibilityLabel={checkboxAccessibilityLabel}
        accessibilityHint="Tap to toggle completion"
      />
      <Text style={[styles.taskText, task.completed && styles.completed]}>
        {task.title}
      </Text>
      <TouchableOpacity
        onPress={() => onDelete(task._id)}
        accessibilityLabel={`Delete ${task.title}`}
        accessibilityHint="Tap to delete this task"
      >
        <DeleteIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
    color: '#0e141b',
    flex: 1,
    marginLeft: 8, // Add margin to avoid overlap with checkbox
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#8d99ae',
  },
});

export default TaskItem;
