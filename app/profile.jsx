import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import { router } from "expo-router";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Name: {user.name}</Text>
        <Text style={styles.label}>Email: {user.email}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.navigate('/login');
            logout();
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafb', // Light background color for a cleaner look
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Center align content
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e141b',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#378fe6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
