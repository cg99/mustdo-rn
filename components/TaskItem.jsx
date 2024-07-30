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
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  taskText: {
    fontSize: 18,
    color: '#333',
    flex: 1,
    marginLeft: 12, // Increased margin to separate from checkbox
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});


export default TaskItem;
