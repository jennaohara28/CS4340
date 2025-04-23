import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import api from '../api/client';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !confirm) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            const res = await api.post('/auth/register', {
                email,
                password,
            });
            console.log('Register success:', res.data);
            navigation.navigate('Login');
        } catch (err) {
            Alert.alert('Registration Failed', err.response?.data?.message || 'Unknown error');
            console.error('Register error:', err);

        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry />
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { borderBottomWidth: 1, marginBottom: 12, padding: 8 },
});
