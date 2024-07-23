import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TaskSection from './TaskSection';

const TaskList = ({ sections, handleToggleComplete, handleDelete, openModal }) => (
    <View>
        {sections.map((section, index) => (
            <TaskSection
                key={index}
                title={section.title}
                tasks={section.data}
                onAdd={(date) => openModal(section.taskType, date)}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                date={section.date}
            />
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8fafb',
    },
});

export default TaskList;
