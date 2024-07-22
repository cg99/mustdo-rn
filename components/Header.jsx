import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MenuIcon from './MenuIcon';

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
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0e141b',
    },
});

export default Header;
