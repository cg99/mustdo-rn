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
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
});


export default DailyEngagement;
