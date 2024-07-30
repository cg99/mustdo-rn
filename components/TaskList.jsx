import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';
import AddIcon from './icons/AddIcon';

const TaskList = ({ sections, handleToggleComplete, handleDelete, openModal }) => {
    return (
        <>
            {sections.map((section, idx) => (
                <View key={idx} style={styles.section}>
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
        </>
    );
};

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

export default TaskList;
