
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';

import { User, updateProfilePicture } from '../database/auth';

type Props = {
  user: User;
  onUserUpdated: (user: User) => void;
  onLogout: () => void;
};

export default function SettingsScreen({
  user,
  onUserUpdated,
  onLogout,
}: Props) {
  const [saving, setSaving] = useState(false);

  async function changeProfilePicture() {
    if (saving) return;

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Please allow access to your photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;

      setSaving(true);

      const source = new File(result.assets[0].uri);
      const folder = new Directory(Paths.document, 'profile-pictures');

      folder.create({ idempotent: true, intermediates: true });

      const extension =
        result.assets[0].mimeType === 'image/png' ? 'png' : 'jpg';

      const destination = new File(
        folder,
        `user-${user.id}-${Date.now()}.${extension}`
      );

      source.copy(destination);

      const updatedUser = await updateProfilePicture(
        user.id,
        destination.uri
      );

      onUserUpdated(updatedUser);
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('Profile picture error:', error);
      Alert.alert('Error', 'Could not update your profile picture.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileCard}>
        <TouchableOpacity
          onPress={changeProfilePicture}
          disabled={saving}
          style={styles.avatarButton}
        >
          {user.profile_picture ? (
            <Image
              source={{ uri: user.profile_picture }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.avatarInitial}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={changeProfilePicture}
          disabled={saving}
        >
          <Text style={styles.changePhoto}>
            {saving ? 'Saving...' : 'Change Profile Picture'}
          </Text>
        </TouchableOpacity>

        {saving && (
          <ActivityIndicator color="#183D32" />
        )}

        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={onLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5EF',
    padding: 24,
    paddingTop: 35,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 25,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
  },
  avatarButton: {
    marginBottom: 12,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  placeholderAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#183D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: 'white',
    fontSize: 44,
    fontWeight: 'bold',
  },
  changePhoto: {
    color: '#183D32',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 15,
  },
  username: {
    color: '#172B4D',
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#172B4D',
    borderRadius: 12,
    padding: 17,
    marginTop: 25,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
