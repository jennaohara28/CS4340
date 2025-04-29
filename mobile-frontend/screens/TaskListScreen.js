// TaskListScreen.js
import React, { useEffect } from 'react';
import {
    SafeAreaView,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { useClasses } from '../hooks/useClasses';
import api from '../api/client';
import { format, isBefore, startOfToday } from 'date-fns';

export default function TaskListScreen({ navigation }) {
    const [tasks, refetchTasks] = useFilteredTasks();
    const classes = useClasses();

    const handleDelete = task => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        api.delete(`/api/tasks/${task.id}`)
                            .then(() => refetchTasks())
                            .catch(() => Alert.alert('Error', 'Could not delete task'));
                    }
                }
            ]
        );
    };

    const handleComplete = task => {
        api.put(`/api/tasks/${task.id}`, { ...task, status: 'Done' })
            .then(() => refetchTasks())
            .catch(() => Alert.alert('Error', 'Could not mark complete'));
    };

    const renderItem = ({ item }) => (
        <View
            style={[
                styles.item,
                { backgroundColor: classes.find(c => c.id === item.classId)?.color || '#fff' }
            ]}
        >
            <TouchableOpacity
                style={styles.itemContent}
                onPress={() => navigation.navigate('TaskView', { task: item })}  // View mode
            >
                <Text style={[styles.title, item.status === 'Done' && { color: 'green' }]}>
                    {item.name}
                </Text>
                <View style={styles.metaContainer}>
                    <Text
                        style={[
                            styles.taskDueDate,
                            item.dueDate &&
                            item.status !== 'Done' &&
                            isBefore(new Date(item.dueDate), startOfToday()) &&
                            styles.overdue
                        ]}
                    >
                        {item.dueDate && format(new Date(item.dueDate), 'MMM d')}
                    </Text>
                    <Text style={styles.taskStatus}>{item.status}</Text>
                </View>
            </TouchableOpacity>

            <View style={styles.iconGroup}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('Add Task', { task: item })}  // Edit mode
                >
                    <Ionicons name="create-outline" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleComplete(item)}
                >
                    <Ionicons name="checkmark-done" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => handleDelete(item)}
                >
                    <MaterialIcons name="delete-outline" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {tasks.length === 0 ? (
                <Text style={styles.empty}>No tasks. Tap "+ Create Task"!</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={t => t.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}

            <View style={styles.bottomButtons}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Add Task')}
                >
                    <Text style={styles.buttonText}>+ Create Task</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#dfe9fd' },
    list: { paddingBottom: 80 },
    empty: { textAlign: 'center', marginTop: 20, color: '#555' },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    itemContent: { flex: 1 },
    title: { fontSize: 18, fontWeight: 'bold' },
    metaContainer: { flexDirection: 'row', marginTop: 4 },
    taskDueDate: { marginRight: 12, color: '#555' },
    overdue: { color: 'red' },
    taskStatus: { fontSize: 14, color: '#333' },
    iconGroup: { flexDirection: 'row' },
    iconButton: { marginLeft: 12 },
    bottomButtons: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        paddingBottom: 0,
    },
    button: {
        backgroundColor: '#3e71c9',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
