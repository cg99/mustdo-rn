import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MenuIcon from './icons/MenuIcon';

const Header = () => {
    const router = useRouter();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.title}>MustDo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/profile')}>
                <MenuIcon />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Full width
        height: 60, // Smaller height
        paddingHorizontal: 16,
        // backgroundColor: '#6200ea', // Vibrant color for prominence
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000', // White text for contrast
    },
});



export default Header;
