import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import TaskItem from './TaskItem';

const DailyEngagement = ({ tasks, onToggleComplete, onDelete }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Daily Engagement</Text>
    <FlatList
      data={tasks}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggleComplete={onToggleComplete} onDelete={onDelete} />
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default DailyEngagement;
