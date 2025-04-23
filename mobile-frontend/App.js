import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './navigation/TabNavigator';

import { UserProvider, UserContext } from './context/UserContext';
import React, { useContext } from 'react';

const Stack = createNativeStackNavigator();

function AppRoutes() {
    const { userId } = useContext(UserContext);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!userId ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                <Stack.Screen name="Main" component={TabNavigator} />
            )}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <UserProvider>
            <NavigationContainer>
                <AppRoutes />
            </NavigationContainer>
        </UserProvider>
    );
}
