import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import api from '../api/client';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserId } = useContext(UserContext);

    const login = async () => {
        try {
            const res = await api.post('/auth/login', { email, password });
            Alert.alert("Success", `Welcome ${res.data.email}`);
            setUserId(res.data.userId);
        } catch (err) {
            Alert.alert("Login Failed", err.response?.data?.message || 'Unknown error');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <Button title="Login" onPress={login} />
                    <View style={styles.spacer} />
                    <Button title="No account? Register" onPress={() => navigation.navigate('Register')} />
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
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    spacer: {
        height: 10,
    },
});
