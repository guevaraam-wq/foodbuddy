
import React, { useState } from 'react';
import { registerUser } from '../database/auth';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
const handleSignup = async () => {
    console.log('SIGNUP BUTTON PRESSED');
Alert.alert('Testing', 'Signup button is working!');
  if (
    !username.trim() ||
    !email.trim() ||
    !password ||
    !confirmPassword
  ) {
    Alert.alert('Missing Information', 'Please fill in all fields.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Passwords Do Not Match', 'Please try again.');
    return;
  }

  try {
    await registerUser(username, email, password);

    Alert.alert(
      'Account Created!',
      'Your FoodBuddy account was successfully created.'
    );

    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  } catch (error) {
    Alert.alert(
      'Signup Failed',
      error instanceof Error ? error.message : 'Something went wrong.'
    );
  }
};


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>FoodBuddy</Text>
        <Text style={styles.tagline}>Good food, made simple.</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join FoodBuddy and start planning delicious meals.
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor="#8A9398"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#8A9398"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="At least 8 characters"
            placeholderTextColor="#8A9398"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#8A9398"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log In</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingVertical: 60,
  },
  logo: {
    fontSize: 38,
    fontWeight: '800',
    color: '#183D32',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 15,
    color: '#172B4D',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E9E4',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#172B4D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#65716D',
    lineHeight: 21,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7F5EF',
    borderWidth: 1,
    borderColor: '#DDE4DC',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#172B4D',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#183D32',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    textAlign: 'center',
    color: '#65716D',
    marginTop: 24,
    fontSize: 14,
  },
  loginLink: {
    color: '#183D32',
    fontWeight: '700',
  },
});
