import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import { router } from "expo-router";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Name: {user.name}</Text>
        <Text style={styles.label}>Email: {user.email}</Text>
        <Button title="Logout" onPress={() => {
          logout();
          router.navigate('/login');

        }} />

      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafb',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default Profile;
