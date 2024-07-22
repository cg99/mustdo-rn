import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal } from 'react-native';

const AddTaskModal = ({ visible, onClose, onSave }) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        onSave(title);
        setTitle('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Add Task</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Task Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={onClose} />
                        <Button title="Save" onPress={handleSave} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 20,
        padding: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default AddTaskModal;
