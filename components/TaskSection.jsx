import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TaskItem from './TaskItem';
import AddIcon from './icons/AddIcon';

const TaskSection = ({ title, tasks, onAdd, onToggleComplete, onDelete, date }) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity onPress={() => onAdd(date)}>
                <AddIcon />
            </TouchableOpacity>
        </View>
        {tasks?.map((task) => (
            <TaskItem key={task._id} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} />
        ))}
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

export default TaskSection;
