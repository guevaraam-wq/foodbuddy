import React, { useEffect, useState } from 'react';
import SettingsScreen from './screens/SettingsScreen';
import { seedAllergyCatalog } from './database/allergyCatalog';
import AllergyProfileScreen from './screens/AllergyProfileScreen';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { initializeDatabase } from './database/db';
import {
  User,
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from './database/auth';

const GREEN = '#183D32';
const BLUE = '#172B4D';
const CREAM = '#F7F5EF';

export default function App() {
  const [activeTab, setActiveTab] = useState<
  'home' | 'allergies' | 'settings'
>('home');
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function start() {
      try {
        await initializeDatabase();
        await seedAllergyCatalog();
        const savedUser = await getCurrentUser();
        setUser(savedUser);
      } catch (error) {
        console.error(error);
        Alert.alert('Startup Error', 'Could not load FoodBuddy.');
      } finally {
        setReady(true);
      }
    }

    start();
  }, []);

  async function handleSubmit() {
    if (loading) return;

    if (!email.trim() || !password) {
      Alert.alert('Missing Information', 'Enter your email and password.');
      return;
    }

    if (mode === 'signup') {
      if (!username.trim()) {
        Alert.alert('Missing Information', 'Enter a username.');
        return;
      }

      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }
    }

    setLoading(true);

    try {
      const signedInUser =
        mode === 'signup'
          ? await registerUser(username, email, password)
          : await loginUser(email, password);

      setUser(signedInUser);
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert(
        mode === 'signup' ? 'Signup Failed' : 'Login Failed',
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
      setUser(null);
      setPassword('');
      setConfirmPassword('');
      setMode('login');
    } catch {
      Alert.alert('Error', 'Could not log out.');
    }
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GREEN} />
        <Text style={styles.subtitle}>Loading FoodBuddy...</Text>
      </View>
    );
  }

  
if (user) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {activeTab === 'settings' ? (
  <SettingsScreen
    user={user}
    onUserUpdated={setUser}
    onLogout={handleLogout}
  />
) : activeTab === 'allergies' ? (
  <AllergyProfileScreen userId={user.id} />
) : (
          <ScrollView contentContainerStyle={styles.home}>
            <Text style={styles.logo}>FoodBuddy</Text>

            <Text style={styles.heading}>
              Hi, {user.username}! 👋
            </Text>

            <Text style={styles.subtitle}>
              What are we cooking today?
            </Text>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🍽️ Meal Planner</Text>
              <Text>Plan your meals for the week.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🛒 Grocery List</Text>
              <Text>Keep track of everything you need.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📖 Recipes</Text>
              <Text>Save your favorite meals.</Text>
            </View>
          </ScrollView>
        )}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('home')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'home' && styles.activeTabText,
            ]}
          >
            🏠 Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.tab}
  onPress={() => setActiveTab('allergies')}
>
  <Text
    style={[
      styles.tabText,
      activeTab === 'allergies' && styles.activeTabText,
    ]}
  >
    🛡️ Allergies
  </Text>
</TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('settings')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'settings' && styles.activeTabText,
            ]}
          >
            ⚙️ Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.authContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>FoodBuddy</Text>

        <Text style={styles.heading}>
          {mode === 'signup' ? 'Create Account' : 'Welcome Back!'}
        </Text>

        <Text style={styles.subtitle}>
          {mode === 'signup'
            ? 'Start planning meals with FoodBuddy.'
            : 'Log in to your FoodBuddy account.'}
        </Text>

        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#777"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#777"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#777"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (loading) return;
            setMode(mode === 'login' ? 'signup' : 'login');
            setPassword('');
            setConfirmPassword('');
          }}
        >
          <Text style={styles.switchText}>
            {mode === 'signup'
              ? 'Already have an account? Log In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CREAM,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CREAM,
  },
  authContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  home: {
    flex: 1,
    padding: 28,
    paddingTop: 50,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: GREEN,
    textAlign: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: BLUE,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#606060',
    marginBottom: 25,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    fontSize: 16,
    color: BLUE,
  },
  button: {
    backgroundColor: GREEN,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.65,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  switchText: {
    color: BLUE,
    textAlign: 'center',
    marginTop: 25,
    fontWeight: '600',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    color: GREEN,
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  accountText: {
    color: BLUE,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: GREEN,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: GREEN,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabBar: {
  flexDirection: 'row',
  backgroundColor: 'white',
  borderTopWidth: 1,
  borderTopColor: '#E5E5E5',
  paddingVertical: 15,
},
tab: {
  flex: 1,
  alignItems: 'center',
},
tabText: {
  fontSize: 16,
  color: '#777',
  fontWeight: '600',
},
activeTabText: {
  color: '#183D32',
  fontWeight: 'bold',
},
});