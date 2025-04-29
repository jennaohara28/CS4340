// TaskViewScreen.js
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useClasses } from '../hooks/useClasses';

export default function TaskViewScreen({ route, navigation }) {
    const { task } = route.params;
    const classes = useClasses();
    const cls = classes.find(c => c.id === task.classId);

    const handleEdit = () => {
        navigation.navigate('Main', {
            screen: 'Add Task',
            params: { task }
        });
    };

    const handleCancel = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.header, { backgroundColor: cls?.color || '#3e71c9' }]}>
                    <Text style={styles.title}>{task.name}</Text>
                </View>

                {/* Due Date Field */}
                <View style={styles.field}>
                    <Text style={styles.label}>Due Date</Text>
                    <Text style={styles.value}>
                        {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'None'}
                    </Text>
                </View>

                {/* Status Field */}
                <View style={styles.field}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={[styles.value, task.status === 'Done' && { color: 'green' }]}>
                        {task.status}
                    </Text>
                </View>

                {/* Priority Field */}
                <View style={styles.field}>
                    <Text style={styles.label}>Priority</Text>
                    <Text style={styles.value}>{task.priority ?? 'None'}</Text>
                </View>

                {/* Type Field */}
                <View style={styles.field}>
                    <Text style={styles.label}>Type</Text>
                    <Text style={styles.value}>{task.type || 'None'}</Text>
                </View>

                {/* Class Field */}
                <View style={styles.field}>
                    <Text style={styles.label}>Class</Text>
                    <Text style={styles.value}>{cls?.name || 'None'}</Text>
                </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                >
                    <Ionicons name="close-outline" size={28} color="#3e71c9" />
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEdit}
                >
                    <Ionicons name="create-outline" size={28} color="#fff" />
                    <Text style={styles.editText}>Edit Task</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#dfe9fd'
    },
    content: {
        padding: 24
    },
    header: {
        padding: 24,
        borderRadius: 10,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff'
    },
    field: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        color: '#777',
        marginBottom: 8
    },
    value: {
        fontSize: 18,
        color: '#333',
        lineHeight: 24
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#dfe9fd'
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3e71c9',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2
    },
    editText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderColor: '#3e71c9',
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 1
    },
    cancelText: {
        color: '#3e71c9',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10
    }
});
