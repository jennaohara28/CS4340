// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import TabNavigator from './navigation/TabNavigator';
import TaskViewScreen from './screens/TaskViewScreen';

import { UserProvider, UserContext } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';

const Stack = createNativeStackNavigator();

function AppRoutes() {
    const { userId } = React.useContext(UserContext);
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!userId ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                <>
                    {/* Main tab navigator (no tab for TaskView) */}
                    <Stack.Screen name="Main" component={TabNavigator} />

                    {/* Read-only view screen for tasks */}
                    <Stack.Screen
                        name="TaskView"
                        component={TaskViewScreen}
                        options={{
                            headerShown: true,
                            title: 'Task Details',
                            headerStyle: { backgroundColor: '#3e71c9' },
                            headerTintColor: '#ffffff',
                            headerTitleStyle: { fontWeight: 'bold', fontSize: 25 },
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <SettingsProvider>
            <UserProvider>
                <NavigationContainer>
                    <AppRoutes />
                </NavigationContainer>
            </UserProvider>
        </SettingsProvider>
    );
}
