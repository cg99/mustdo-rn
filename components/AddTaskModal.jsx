import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';

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
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        width: '90%',
        maxWidth: 400,
        padding: 24,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    input: {
        borderBottomWidth: 1.5,
        borderBottomColor: '#ddd',
        marginBottom: 24,
        paddingVertical: 10,
        paddingHorizontal: 8,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    button: {
        marginLeft: 10,
        height: 48,
        borderRadius: 8,
        backgroundColor: "#378fe6",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    cancelButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "red",
    },
    buttonText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default AddTaskModal;
