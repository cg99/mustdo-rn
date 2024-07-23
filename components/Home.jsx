import { useRouter } from 'expo-router';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { createTask, deleteTask, getQuote, getTasks, updateTask } from '../api';
import { AuthContext } from '../context/AuthContext';
import AddTaskModal from './AddTaskModal';
import Header from './Header';
import TaskList from './TaskList';
import TaskSection from './TaskSection';

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
            <TaskList sections={sections} handleToggleComplete={handleToggleComplete} handleDelete={handleDelete} openModal={openModal} />
            <TaskSection title="Upcoming" tasks={upcomingSections} onAdd={openModal} onToggleComplete={handleToggleComplete} onDelete={handleDelete} />
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
    },
    date: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default Home;
