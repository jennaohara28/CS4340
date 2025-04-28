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
    Animated
} from 'react-native';

import api from '../api/client';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import AppHeader from '../components/AppHeader';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserId } = useContext(UserContext);

    const logoOpacity = useState(new Animated.Value(0))[0]; //makes logo invisible at first

    React.useEffect(() => {
        Animated.timing(logoOpacity, {
            toValue: 1,  //fully visible
            duration: 1000,   //1 second
            useNativeDriver: true,
        }).start();
    }, []);

    const login = async () => {
        try {
            const res = await api.post('/auth/login', { email, password });
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
                <View style={{ flex: 1 }}>
                    <AppHeader />
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
        paddingTop: 0,
        backgroundColor: '#dfe9fd',
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 12,
        padding: 10,
        backgroundColor: '#dfe9fd',
    },
    spacer: {
        height: 10,
        backgroundColor: '#dfe9fd',
    }
});
