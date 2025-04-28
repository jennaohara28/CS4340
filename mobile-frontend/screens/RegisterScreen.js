import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
} from 'react-native';
import api from '../api/client';
import AppHeader from '../components/AppHeader';

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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={-60}   //adjusts height of offset
            style={{flex: 1}}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    {/* Header for logo + app name */}
                    <AppHeader />

                    {/* Form */}
                    <View style={styles.inner}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirm}
                            onChangeText={setConfirm}
                            secureTextEntry
                        />
                        <View style={styles.spacer} />
                        <View style={styles.spacer} />
                        <Button title="Register" onPress={handleRegister} />
                        <View style={styles.spacer} />
                        <Button title="Back to Login" onPress={() => navigation.goBack()} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 0
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 12,
        padding: 10
    },
    spacer: {
        height: 10,
    },
});
