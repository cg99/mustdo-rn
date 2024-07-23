import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Checkbox from 'expo-checkbox';
import DeleteIcon from './DeleteIcon';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <View style={styles.taskContainer}>
      <Checkbox
        value={task.completed}
        onValueChange={() => onToggleComplete(task)}
        color={task.completed ? '#378fe6' : '#d0dbea'}
      />
      <Text style={[styles.taskText, task.completed && styles.completed]}>
        {task.title}
      </Text>
      <TouchableOpacity onPress={() => onDelete(task._id)}>
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
    marginLeft: 8, // Add some margin to avoid overlap with checkbox
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#8d99ae',
  },
});

export default TaskItem;
