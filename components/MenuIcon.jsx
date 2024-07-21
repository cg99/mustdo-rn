import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MenuIcon = () => {
  return (
    <View style={styles.iconContainer}>
      <MaterialIcons name="menu" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuIcon;
