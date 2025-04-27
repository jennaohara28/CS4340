import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView
} from 'react-native';
import api from '../api/client';
import { UserContext } from '../context/UserContext';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function TaskListScreen({ navigation }) {
    const { userId } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [edits, setEdits] = useState({});

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                api.get('/api/classes/owner', { headers: { userId } })
                    .then(res => setClasses(res.data))
                    .catch(err => console.error('Error fetching classes:', err));
                api.get(`/api/tasks/owner/${userId}`)
                    .then(res => {
                        const sortedTasks = res.data.sort((a, b) => {
                            if (!a.dueDate) return 1;
                            if (!b.dueDate) return -1;
                            return new Date(a.dueDate) - new Date(b.dueDate);
                        });
                        setTasks(sortedTasks);
                    })
                    .catch(err => console.error('Error fetching tasks:', err));
            }
        }, [userId])
    );

    const openModal = (task) => {
        setSelectedTask(task);
        setEdits({ ...task });
        setEditMode(false);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const handleDelete = () => {
        api.delete(`/api/tasks/${selectedTask.id}`)
            .then(() => {
                setTasks(tasks.filter(t => t.id !== selectedTask.id));
                closeModal();
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not delete task');
            });
    };

    const handleSave = () => {
        api.put(`/api/tasks/${selectedTask.id}`, edits)
            .then(res => {
                setTasks(tasks.map(t => t.id === res.data.id ? res.data : t));
                closeModal();
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not update task');
            });
    };

    const getClassColor = id => classes.find(c => c.id === id)?.color || '#fff';

    const renderItem = ({ item }) => {
        const today = new Date();
        const dueDate = item.dueDate ? new Date(item.dueDate) : null;
        const isOverdue = dueDate && dueDate < today.setHours(0, 0, 0, 0);

        return (
            <TouchableOpacity
                style={[styles.item, { backgroundColor: getClassColor(item.classId) }]}
                onPress={() => openModal(item)}
            >
                <View style={styles.itemRow}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={[styles.dueDate, isOverdue && styles.overdueDate]}>
                        {item.dueDate ? format(new Date(item.dueDate), 'MMM d') : ''}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Button title="+ Create Task" onPress={() => navigation.navigate('Add Task')} />
            {tasks.length === 0 ? (
                <Text style={styles.empty}>No tasks. Tap "Create Task"!</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                />
            )}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <ScrollView contentContainerStyle={styles.modal}>
                    {selectedTask && !editMode && (
                        <>
                            <Text style={styles.label}>Name: {selectedTask.name}</Text>
                            <Text style={styles.label}>Due: {selectedTask.dueDate}</Text>
                            <Text style={styles.label}>Type: {selectedTask.type}</Text>
                            <Text style={styles.label}>Time: {selectedTask.timeAll}</Text>
                            <Text style={styles.label}>Status: {selectedTask.status}</Text>
                            <Text style={styles.label}>Priority: {selectedTask.priority}</Text>
                            <Text style={styles.label}>Class: {classes.find(c => c.id === selectedTask.classId)?.name}</Text>
                            <Button title="Edit" onPress={() => setEditMode(true)} />
                            <Button title="Delete" color="red" onPress={handleDelete} />
                            <Button title="Close" onPress={closeModal} />
                        </>
                    )}
                    {selectedTask && editMode && (
                        <>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={edits.name}
                                onChangeText={val => setEdits({ ...edits, name: val })}
                            />
                            <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
                            <TextInput
                                style={styles.input}
                                value={edits.dueDate}
                                onChangeText={val => setEdits({ ...edits, dueDate: val })}
                            />
                            <Text style={styles.label}>Type</Text>
                            <TextInput
                                style={styles.input}
                                value={edits.type}
                                onChangeText={val => setEdits({ ...edits, type: val })}
                            />
                            <Text style={styles.label}>Time</Text>
                            <TextInput
                                style={styles.input}
                                value={String(edits.timeAll)}
                                keyboardType="numeric"
                                onChangeText={val => setEdits({ ...edits, timeAll: Number(val) })}
                            />
                            <Text style={styles.label}>Status</Text>
                            <TextInput
                                style={styles.input}
                                value={edits.status}
                                onChangeText={val => setEdits({ ...edits, status: val })}
                            />
                            <Text style={styles.label}>Priority</Text>
                            <TextInput
                                style={styles.input}
                                value={String(edits.priority)}
                                keyboardType="numeric"
                                onChangeText={val => setEdits({ ...edits, priority: Number(val) })}
                            />
                            <Text style={styles.label}>Class ID</Text>
                            <TextInput
                                style={styles.input}
                                value={String(edits.classId)}
                                keyboardType="numeric"
                                onChangeText={val => setEdits({ ...edits, classId: Number(val) })}
                            />
                            <Button title="Save" onPress={handleSave} />
                            <Button title="Cancel" onPress={() => setEditMode(false)} />
                        </>
                    )}
                </ScrollView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    item: { padding: 12, marginBottom: 8, borderRadius: 4 },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
    dueDate: { fontSize: 14, color: '#555', marginLeft: 10 },
    overdueDate: { fontSize: 14, color: 'red', fontWeight: 'bold', marginLeft: 10 },
    empty: { textAlign: 'center', marginTop: 20, fontSize: 16 },
    modal: { padding: 16 },
    label: { fontWeight: 'bold', marginVertical: 6 },
    input: { borderBottomWidth: 1, marginBottom: 12, padding: 4 },
});
