import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, Button } from 'react-native';
import { getTasks, getQuote, deleteTask, updateTask } from '../api';
import TaskItem from '../components/TaskItem';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const fetchTasksAndQuote = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
        const quoteData = await getQuote();
        setQuote(quoteData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasksAndQuote();
  }, []);

  const handleToggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      setTasks(tasks.map(t => (t._id === task._id ? { ...t, completed: !t.completed } : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const sections = [
    { title: 'Daily Engagement', data: tasks.filter(task => task.taskType === 'dailyEngagement') },
    { title: "Today's Tasks", data: tasks.filter(task => task.taskType === 'regular' && !task.completed) },
    { title: 'Upcoming', data: tasks.filter(task => task.taskType === 'upcoming') },
    { title: 'Not To Do', data: tasks.filter(task => task.taskType === 'notToDo') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{quote}</Text>
      <Text style={styles.date}>It's {new Date().toLocaleString()}</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafb',
  },
  quote: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Home;
