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
import Logo from '../assets/images/logo.png';

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
                <View style={{ flex: 1 }}>
                    <Animated.View style={[styles.header, { opacity: logoOpacity }]}>
                        <Image source={Logo} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.logoText}>Task Trackr</Text>
                    </Animated.View>
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
    header: {
        alignItems: 'center',
        paddingTop: 135,
    },
    logo: {
        width: '100%',
        height: 140,
        marginBottom: 5,
        alignSelf: 'center'
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 0
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    spacer: {
        height: 10,
    }
});
