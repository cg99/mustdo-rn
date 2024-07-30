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
        marginBottom: 24,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333333',
    },
});


export default TaskSection;
