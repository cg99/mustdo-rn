import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DeleteIcon = () => (
    <View style={styles.iconContainer}>
        <MaterialIcons name="delete-outline" size={24} color="red" />
    </View>
);

const styles = StyleSheet.create({
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DeleteIcon;
