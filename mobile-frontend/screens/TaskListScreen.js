import React, { useState } from 'react';
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
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { useClasses } from '../hooks/useClasses';
import api from '../api/client';

export default function TaskListScreen({ navigation }) {
    const tasks = useFilteredTasks();
    const classes = useClasses();

    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionMenuTask, setActionMenuTask] = useState(null);
    const [edits, setEdits] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);

    const openModal = task => {
        setSelectedTask(task);
        setEdits({ ...task });
        setShowStatusPicker(false);
        setShowPriorityPicker(false);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const handleDelete = task => {
        api.delete(`/api/tasks/${task.id}`)
            .then(() => closeModal())
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not delete task');
            });
    };

    const handleComplete = () => {
        api.put(`/api/tasks/${actionMenuTask.id}`, { ...actionMenuTask, status: 'Done' })
            .then(() => setActionMenuTask(null))
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not mark complete');
            });
    };

    const handleSave = () => {
        api.put(`/api/tasks/${selectedTask.id}`, edits)
            .then(() => closeModal())
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not update task');
            });
    };

    const handleDateChange = (e, date) => {
        setShowDatePicker(false);
        if (date) {
            setEdits(prev => ({
                ...prev,
                dueDate: date.toISOString().split('T')[0]
            }));
        }
    };

    const getClassColor = id => classes.find(c => c.id === id)?.color || '#fff';

    const renderItem = ({ item }) => {
        const today = new Date().setHours(0,0,0,0);
        const due = item.dueDate ? new Date(item.dueDate) : null;
        const isOverdue = due && due < today;
        return (
            <View style={[styles.item, { backgroundColor: getClassColor(item.classId) }]}>
                <TouchableOpacity style={styles.itemRow} onPress={() => openModal(item)}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={[styles.dueDate, isOverdue && styles.overdueDate]}>
                        {item.dueDate}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActionMenuTask(item)} style={styles.iconButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Button title="+ Create Task" onPress={() => navigation.navigate('Add Task')} />
            {tasks.length === 0 ? (
                <Text style={styles.empty}>No tasks. Tap "Create Task"!</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={t => t.id.toString()}
                    renderItem={renderItem}
                />
            )}

            <Modal visible={!!actionMenuTask} transparent animationType="fade">
                <View style={styles.actionMenuOverlay}>
                    <View style={styles.actionMenuStyled}>
                        <TouchableOpacity style={styles.actionMenuItem} onPress={() => { openModal(actionMenuTask); setActionMenuTask(null); }}>
                            <MaterialIcons name="edit" size={24} color="black" />
                            <Text style={styles.actionMenuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionMenuItem} onPress={() => { handleDelete(actionMenuTask); setActionMenuTask(null); }}>
                            <MaterialIcons name="delete" size={24} color="red" />
                            <Text style={[styles.actionMenuText, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionMenuItem} onPress={handleComplete}>
                            <Ionicons name="checkmark-done" size={24} color="green" />
                            <Text style={[styles.actionMenuText, { color: 'green' }]}>Mark Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionMenuItem} onPress={() => setActionMenuTask(null)}>
                            <Ionicons name="close" size={24} color="black" />
                            <Text style={styles.actionMenuText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS==='ios'? 'padding' : 'height'} style={styles.container}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView contentContainerStyle={styles.inner}>

                                <Text style={styles.label}>Task Name *</Text>
                                <TextInput style={styles.input} value={edits.name} placeholder="Enter task name" onChangeText={val => setEdits(prev => ({ ...prev, name: val }))} />

                                <Text style={styles.label}>Due Date</Text>
                                <View style={styles.datePickerContainer}>
                                    <DateTimePicker
                                        value={edits.dueDate ? new Date(edits.dueDate) : new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={handleDateChange}
                                    />
                                </View>

                                {/* Status, Priority, Class pickers same as before… */}
                                <Button title="Save Changes" onPress={handleSave} />
                                <Button title="Cancel" onPress={closeModal} />
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    inner: { padding: 16 },
    label: { fontWeight: 'bold', marginTop: 12 },
    input: { borderBottomWidth: 1, marginBottom: 8, padding: 4 },
    datePickerContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    item: { padding: 12, marginBottom: 9, marginHorizontal: 10, borderRadius: 4, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    itemRow: { flex: 1 },
    title: { fontSize: 18, fontWeight: 'bold' },
    dueDate: { fontSize: 14, color: '#555' },
    overdueDate: { fontSize: 14, color: 'red', fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 20, fontSize: 16 },
    iconButton: { marginLeft: 10 },
    actionMenuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    actionMenuStyled: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    actionMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    actionMenuText: { marginLeft: 10, fontSize: 18, fontWeight: '500' },
    modalOverlay: { flex: 1, marginTop: 150, backgroundColor: 'rgba(255,255,255,0.5)' },
});
