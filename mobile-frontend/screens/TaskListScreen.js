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
    const [isEditing, setIsEditing] = useState(false);
    const [edits, setEdits] = useState({});
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);

    const openModal = task => {
        setSelectedTask(task);
        setEdits({ ...task });
        setShowStatusPicker(false);
        setShowPriorityPicker(false);
        setIsEditing(false);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTask(null);
    };

    const handleDelete = task => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive',
                    onPress: () => api.delete(`/api/tasks/${task.id}`)
                        .then(() => { closeModal(); setActionMenuTask(null); })
                        .catch(() => Alert.alert('Error', 'Could not delete task'))
                }
            ]
        );
    };

    const handleComplete = () => {
        api.put(`/api/tasks/${actionMenuTask.id}`, { ...actionMenuTask, status: 'Done' })
            .then(() => setActionMenuTask(null))
            .catch(() => Alert.alert('Error', 'Could not mark complete'));
    };

    const handleSave = () => {
        api.put(`/api/tasks/${selectedTask.id}`, edits)
            .then(closeModal)
            .catch(() => Alert.alert('Error', 'Could not update task'));
    };

    const handleDateChange = (e, date) => {
        setShowStatusPicker(false);
        setShowPriorityPicker(false);
        if (date) {
            setEdits(prev => ({ ...prev, dueDate: date.toISOString().split('T')[0] }));
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.item, { backgroundColor: classes.find(c => c.id === item.classId)?.color || '#fff' }]}>
            <TouchableOpacity style={styles.itemContent} onPress={() => openModal(item)}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.dueDate}>{item.dueDate || ''}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActionMenuTask(item)} style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

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

            {/* Action Menu Modal */}
            <Modal visible={!!actionMenuTask} transparent animationType="fade">
                <View style={styles.actionMenuOverlay}>
                    <View style={styles.actionMenuStyled}>
                        <TouchableOpacity style={styles.actionMenuItem} onPress={() => { openModal(actionMenuTask); }}>
                            <MaterialIcons name="edit" size={24} color="black" />
                            <Text style={styles.actionMenuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionMenuItem} onPress={() => handleDelete(actionMenuTask)}>
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

            {/* Detail / Edit Modal */}
            <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView contentContainerStyle={styles.inner}>
                                {selectedTask && !isEditing ? (
                                    <View style={styles.displayContainer}>
                                        {['name', 'dueDate', 'type', 'timeAll', 'status', 'priority', 'class'].map((field, idx) => {
                                            let label, value;
                                            switch (field) {
                                                case 'name': label = 'Task Name'; value = selectedTask.name; break;
                                                case 'dueDate': label = 'Due Date'; value = selectedTask.dueDate || 'N/A'; break;
                                                case 'type': label = 'Type'; value = selectedTask.type || 'N/A'; break;
                                                case 'timeAll': label = 'Time Allocation (hrs)'; value = selectedTask.timeAll; break;
                                                case 'status': label = 'Status'; value = selectedTask.status; break;
                                                case 'priority': label = 'Priority'; value = selectedTask.priority; break;
                                                case 'class': label = 'Class'; value = classes.find(c => c.id === selectedTask.classId)?.name || 'N/A'; break;
                                            }
                                            return (
                                                <View key={idx} style={styles.displayRow}>
                                                    <Text style={styles.displayLabel}>{label}</Text>
                                                    <Text style={styles.displayValue}>{value}</Text>
                                                </View>
                                            );
                                        })}
                                        <View style={styles.buttonRow}>
                                            <Button title="Edit" onPress={() => setIsEditing(true)} />
                                            <Button title="Delete" color="red" onPress={() => handleDelete(selectedTask)} />
                                            <Button title="Close" onPress={closeModal} />
                                        </View>
                                    </View>
                                ) : (
                                    <React.Fragment>
                                        {/* Edit Form */}
                                        <Text style={styles.label}>Task Name *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={edits.name}
                                            placeholder="Enter task name"
                                            onChangeText={val => setEdits(prev => ({ ...prev, name: val }))}
                                        />
                                        <Text style={styles.label}>Due Date</Text>
                                        <View style={styles.datePickerContainer}>
                                            <DateTimePicker
                                                value={edits.dueDate ? new Date(edits.dueDate) : new Date()}
                                                mode="date"
                                                display="default"
                                                onChange={handleDateChange}
                                            />
                                        </View>
                                        <Text style={styles.label}>Type</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={edits.type}
                                            placeholder="Enter task type"
                                            onChangeText={val => setEdits(prev => ({ ...prev, type: val }))}
                                        />
                                        <Text style={styles.label}>Time Allocation (hrs)</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={String(edits.timeAll)}
                                            placeholder="0"
                                            keyboardType="numeric"
                                            onChangeText={val => setEdits(prev => ({ ...prev, timeAll: Number(val) }))}
                                        />
                                        <Text style={styles.label}>Status</Text>
                                        <TouchableOpacity style={[styles.classItem, styles.classSelected]} onPress={() => setShowStatusPicker(s => !s)}>
                                            <Text style={styles.classText}>{edits.status}</Text>
                                        </TouchableOpacity>
                                        {showStatusPicker && (
                                            <FlatList
                                                horizontal
                                                data={['To-Do','In-progress','Done']}
                                                keyExtractor={(i,idx) => idx.toString()}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={[styles.flatListItem, edits.status === item && styles.classSelected]}
                                                        onPress={() => { setEdits(prev => ({ ...prev, status: item })); setShowStatusPicker(false); }}
                                                    >
                                                        <Text style={styles.flatListText}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                                contentContainerStyle={styles.flatList}
                                            />
                                        )}
                                        <Text style={styles.label}>Priority</Text>
                                        <TouchableOpacity style={[styles.classItem, styles.classSelected]} onPress={() => setShowPriorityPicker(p => !p)}>
                                            <Text style={styles.classText}>{edits.priority}</Text>
                                        </TouchableOpacity>
                                        {showPriorityPicker && (
                                            <FlatList
                                                horizontal
                                                data={['1','2','3']}
                                                keyExtractor={(i,idx) => idx.toString()}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={[styles.flatListItem, edits.priority === item && styles.classSelected]}
                                                        onPress={() => { setEdits(prev => ({ ...prev, priority: item })); setShowPriorityPicker(false); }}
                                                    >
                                                        <Text style={styles.flatListText}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                                contentContainerStyle={styles.flatList}
                                            />
                                        )}
                                        <Text style={styles.label}>Class *</Text>
                                        <FlatList
                                            horizontal
                                            data={classes}
                                            keyExtractor={c => c.id.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    style={[styles.classItem, edits.classId === item.id && styles.classSelected]}
                                                    onPress={() => setEdits(prev => ({ ...prev, classId: item.id }))}
                                                >
                                                    <Text style={styles.classText}>{item.name}</Text>
                                                </TouchableOpacity>
                                            )}
                                            style={styles.classList}
                                        />
                                        <View style={styles.buttonRow}>
                                            <Button title="Save Changes" onPress={handleSave} />
                                            <Button title="Delete" color="red" onPress={() => handleDelete(selectedTask)} />
                                            <Button title="Cancel" onPress={closeModal} />
                                        </View>
                                    </React.Fragment>
                                )}
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
    inner: { padding: 16, justifyContent: 'center', marginTop: 100 },
    item: { padding: 12, marginVertical: 6, marginHorizontal: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    itemContent: { flex: 1 },
    title: { fontSize: 18, fontWeight: 'bold' },
    dueDate: { fontSize: 14, color: '#555' },
    empty: { textAlign: 'center', marginTop: 20, fontSize: 16 },
    iconButton: { padding: 8 },
    actionMenuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    actionMenuStyled: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
    actionMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    actionMenuText: { marginLeft: 10, fontSize: 18, fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.5)' },
    displayContainer: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    displayRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
    displayLabel: { fontWeight: 'bold', fontSize: 16 },
    displayValue: { fontSize: 16, flexShrink: 1, textAlign: 'right' },
    label: { fontWeight: 'bold', marginTop: 12 },
    input: { borderBottomWidth: 1, marginBottom: 8, padding: 4 },
    datePickerContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    classList: { maxHeight: 50, marginVertical: 8 },
    classItem: { padding: 8, borderRadius: 4, backgroundColor: '#eee', marginRight: 8, justifyContent: 'center', alignItems: 'center' },
    classSelected: { backgroundColor: '#cceeff' },
    classText: { fontSize: 16 },
    flatList: { marginTop: 8, flexDirection: 'row', justifyContent: 'center' },
    flatListItem: { backgroundColor: '#eee', marginRight: 8, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 4, justifyContent: 'center', alignItems: 'center', minWidth: 80 },
    flatListText: { fontSize: 16, textAlign: 'center' },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }
});
