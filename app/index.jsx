import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, ScrollView } from 'react-native';
import { getTasks, getQuote, deleteTask, updateTask } from '../api/api';
import TaskItem from '../components/TaskItem';
import MenuIcon from '../components/MenuIcon';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); // Use replace instead of push
    } else if (user) {
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
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null; // or a loading spinner
  }

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MustDo</Text>
        <TouchableOpacity onPress={() => { 
            router.push("/profile");
        }}>
          <MenuIcon />
        </TouchableOpacity>
      </View>
      <Text style={styles.quote}>{quote}</Text>
      <Text style={styles.date}>It's {new Date().toLocaleString()}</Text>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <TouchableOpacity onPress={() => console.log(`Add new task to ${section.title}`)}>
              <MenuIcon />
            </TouchableOpacity>
          </View>
          {section.data.map((task) => (
            <TaskItem key={task._id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0e141b',
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
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default Home;
