import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getTasks, getQuote, deleteTask, updateTask, createTask } from '../api';
import TaskItem from '../components/TaskItem';
import AddIcon from '../components/AddIcon'; // Ensure you have an AddIcon component
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import AddTaskModal from '../components/AddTaskModal';
import moment from 'moment';

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [quote, setQuote] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
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

  const handleAddTask = async (title) => {
    try {
      const newTask = { title, taskType, date: selectedDate || new Date() };
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (type, date) => {
    setTaskType(type);
    setSelectedDate(date);
    setModalVisible(true);
  };

  const sections = [
    { title: 'Daily Engagement', taskType: 'dailyEngagement', data: tasks.filter(task => task.taskType === 'dailyEngagement') },
    { title: "Today's Tasks", taskType: 'regular', data: tasks.filter(task => task.taskType === 'regular' && moment(task.date).isSame(moment(), 'day')) },
    { title: 'Not To Do', taskType: 'notToDo', data: tasks.filter(task => task.taskType === 'notToDo') },
  ];

  const upcomingTasks = tasks.filter(task => task.taskType === 'regular' && moment(task.date).isAfter(moment(), 'day') && moment(task.date).isSameOrBefore(moment().add(6, 'days'), 'day'));
  const groupedUpcomingTasks = upcomingTasks.reduce((groups, task) => {
    const date = moment(task.date).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {});

  const nextSixDays = Array.from({ length: 6 }, (_, i) => moment().add(i + 1, 'days').format('YYYY-MM-DD'));

  const upcomingSections = nextSixDays.map(date => ({
    title: moment(date).format('D - dddd'),
    taskType: 'regular',
    date,
    data: groupedUpcomingTasks[date] || [],
  }));

  const unfinishedTasks = tasks.filter(task => task.taskType === 'regular' && !task.completed && moment(task.date).isBefore(moment(), 'day'));

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.quote}>{quote}</Text>
      <Text style={styles.date}>It's {new Date().toLocaleString()}</Text>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <TouchableOpacity onPress={() => openModal(section.taskType)}>
              <AddIcon />
            </TouchableOpacity>
          </View>
          {section.data.map((task) => (
            <TaskItem key={task._id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
          ))}
        </View>
      ))}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {upcomingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity onPress={() => openModal(section.taskType, section.date)}>
                <AddIcon />
              </TouchableOpacity>
            </View>
            {section.data.map((task) => (
              <TaskItem key={task._id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
            ))}
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Unfinished Tasks</Text>
        {unfinishedTasks.map((task) => (
          <TaskItem key={task._id} task={task} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
        ))}
      </View>
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleAddTask}
      />
    </ScrollView>
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
