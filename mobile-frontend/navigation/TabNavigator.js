// navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateTaskScreen from '../screens/CreateTaskScreen';
import TaskListScreen from "../screens/TaskListScreen";
import SettingsScreen from '../screens/SettingsScreen';   // placeholder if needed
import { Ionicons } from '@expo/vector-icons';
import ClassesScreen from "../screens/ClassesScreen";
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#3e71c9',   // ⬅️ your header background
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 25,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Tasks') iconName = 'checkmark-done';
                    else if (route.name === "Home") iconName = 'home';
                    else if (route.name === 'Add Task') iconName = 'add-circle';
                    else if (route.name === 'Classes') iconName = 'school';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <Ionicons name={iconName} size={size} color={"#3e71c9"} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Tasks" component={TaskListScreen} />
            <Tab.Screen name="Add Task" component={CreateTaskScreen} />
            <Tab.Screen name="Classes" component={ClassesScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
