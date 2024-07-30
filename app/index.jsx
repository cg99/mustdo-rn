import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from "expo-router";
import AddTaskModal from '../components/AddTaskModal';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import TaskSection from '../components/TaskSection';
import { AuthContext } from '../context/AuthContext';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '../hooks/useTasks';
import { useQuote } from '../hooks/useQuote';

const Index = () => {
  const { user, loading } = useContext(AuthContext);
  const { data: tasks = [], isError, isLoading } = useTasks();
  const { data: quote = '' } = useQuote();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [modalVisible, setModalVisible] = useState(false);
  const [taskType, setTaskType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login'); // Use replace instead of push
    }
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error loading tasks</Text>
      </View>
    );
  }

  const handleToggleComplete = (task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  const handleDelete = (id) => {
    deleteTask(id);
  };

  const handleAddTask = (title) => {
    const newTask = { title, taskType, date: selectedDate || new Date() };
    createTask(newTask);
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
      <TaskList sections={sections} handleToggleComplete={handleToggleComplete} handleDelete={handleDelete} openModal={openModal} />

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        <TaskList sections={upcomingSections} handleToggleComplete={handleToggleComplete} handleDelete={handleDelete} openModal={openModal} />
      </View>

      <TaskSection title="Unfinished Tasks" tasks={unfinishedTasks} onAdd={openModal} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />

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
    color: '#555',
    fontStyle: 'italic',
  },
  date: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#555',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  upcomingContainer: {
    marginTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
  },
});

export default Index;
