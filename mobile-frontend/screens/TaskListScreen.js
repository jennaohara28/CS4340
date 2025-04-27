import React, { useState, useContext, useCallback } from 'react';
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
import api from '../api/client';
import { UserContext } from '../context/UserContext';
import { format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TaskListScreen({ navigation }) {
    const { userId } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [actionMenuTask, setActionMenuTask] = useState(null);
    const [edits, setEdits] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStatusPicker, setShowStatusPicker] = useState(false);
    const [showPriorityPicker, setShowPriorityPicker] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (!userId) return;
            api.get('/api/classes/owner', { headers: { userId } })
                .then(res => setClasses(res.data))
                .catch(err => console.error('Error fetching classes:', err));
            api.get(`/api/tasks/owner/${userId}`)
                .then(res => {
                    const sorted = res.data.sort((a, b) => {
                        if (!a.dueDate) return 1;
                        if (!b.dueDate) return -1;
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    });
                    setTasks(sorted);
                })
                .catch(err => console.error('Error fetching tasks:', err));
        }, [userId])
    );

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
            .then(() => {
                setTasks(ts => ts.filter(t => t.id !== task.id));
                closeModal();
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not delete task');
            });
    };

    const handleComplete = () => {
        api.put(`/api/tasks/${actionMenuTask.id}`, { ...actionMenuTask, status: 'Done' })
            .then(res => {
                setTasks(ts => ts.map(t => t.id === res.data.id ? res.data : t));
                setActionMenuTask(null);
            })
            .catch(err => {
                console.error(err);
                Alert.alert('Error', 'Could not mark complete');
            });
    };

    const handleSave = () => {
        api.put(`/api/tasks/${selectedTask.id}`, edits)
            .then(res => {
                setTasks(ts => ts.map(t => t.id === res.data.id ? res.data : t));
                closeModal();
            })
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
        const today = new Date();
        const due = item.dueDate ? new Date(item.dueDate) : null;
        const isOverdue = due && due < today.setHours(0,0,0,0);
        return (
            <View style={[styles.item, { backgroundColor: getClassColor(item.classId) }]}>
                <TouchableOpacity style={styles.itemRow} onPress={() => openModal(item)}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={[styles.dueDate, isOverdue && styles.overdueDate]}>
                        {item.dueDate ? format(new Date(item.dueDate), 'MMM d') : ''}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActionMenuTask(item)}
                    style={styles.iconButton}
                >
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

            {/* Action Menu Modal */}
            <Modal visible={!!actionMenuTask} transparent animationType="fade">
                <View style={styles.actionMenuOverlay}>
                    <View style={styles.actionMenuStyled}>
                        <TouchableOpacity
                            style={styles.actionMenuItem}
                            onPress={() => { openModal(actionMenuTask); setActionMenuTask(null); }}
                        >
                            <MaterialIcons name="edit" size={24} color="black" />
                            <Text style={styles.actionMenuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionMenuItem}
                            onPress={() => {
                                handleDelete(actionMenuTask);
                                setActionMenuTask(null);
                            }}
                        >
                            <MaterialIcons name="delete" size={24} color="red" />
                            <Text style={[styles.actionMenuText, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionMenuItem}
                            onPress={handleComplete}
                        >
                            <Ionicons name="checkmark-done" size={24} color="green" />
                            <Text style={[styles.actionMenuText, {color:'green'}]}>Mark Complete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionMenuItem}
                            onPress={() => setActionMenuTask(null)}
                        >
                            <Ionicons name="close" size={24} color="black" />
                            <Text style={styles.actionMenuText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* View/Edit Task Modal (styled just like CreateTaskScreen) */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS==='ios'?'padding':'height'}
                    style={styles.container}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView contentContainerStyle={styles.inner}>
                            {/* Task Name */}
                            <Text style={styles.label}>Task Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={edits.name}
                                placeholder="Enter task name"
                                onChangeText={val => setEdits(prev=>({...prev,name:val}))}
                            />

                            {/* Due Date */}
                            <Text style={styles.label}>Due Date</Text>
                            <View style={styles.datePickerContainer}>
                                <DateTimePicker
                                    value={edits.dueDate?new Date(edits.dueDate):new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            </View>

                            {/* Type */}
                            <Text style={styles.label}>Type</Text>
                            <TextInput
                                style={styles.input}
                                value={edits.type}
                                placeholder="Enter task type"
                                onChangeText={val=>setEdits(prev=>({...prev,type:val}))}
                            />

                            {/* Time Allocation */}
                            <Text style={styles.label}>Time Allocation (hrs)</Text>
                            <TextInput
                                style={styles.input}
                                value={String(edits.timeAll)}
                                placeholder="0"
                                keyboardType="numeric"
                                onChangeText={val=>setEdits(prev=>({...prev,timeAll:Number(val)}))}
                            />

                            {/* Status Picker */}
                            <Text style={styles.label}>Status</Text>
                            <TouchableOpacity
                                style={[styles.classItem, styles.classSelected]}
                                onPress={()=>setShowStatusPicker(s=>!s)}
                            >
                                <Text style={styles.classText}>{edits.status}</Text>
                            </TouchableOpacity>
                            {showStatusPicker && (
                                <FlatList
                                    horizontal
                                    data={['To-Do','In-progress','Done']}
                                    keyExtractor={(i,idx)=>idx.toString()}
                                    renderItem={({item})=>(
                                        <TouchableOpacity
                                            style={[
                                                styles.flatListItem,
                                                edits.status===item && styles.classSelected
                                            ]}
                                            onPress={()=>{
                                                setEdits(prev=>({...prev,status:item}));
                                                setShowStatusPicker(false);
                                            }}
                                        >
                                            <Text style={styles.flatListText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={styles.flatList}
                                />
                            )}

                            {/* Priority Picker */}
                            <Text style={styles.label}>Priority</Text>
                            <TouchableOpacity
                                style={[styles.classItem, styles.classSelected]}
                                onPress={()=>setShowPriorityPicker(p=>!p)}
                            >
                                <Text style={styles.classText}>{edits.priority}</Text>
                            </TouchableOpacity>
                            {showPriorityPicker && (
                                <FlatList
                                    horizontal
                                    data={['1','2','3']}
                                    keyExtractor={(i,idx)=>idx.toString()}
                                    renderItem={({item})=>(
                                        <TouchableOpacity
                                            style={[
                                                styles.flatListItem,
                                                edits.priority===item && styles.classSelected
                                            ]}
                                            onPress={()=>{
                                                setEdits(prev=>({...prev,priority:item}));
                                                setShowPriorityPicker(false);
                                            }}
                                        >
                                            <Text style={styles.flatListText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    contentContainerStyle={styles.flatList}
                                />
                            )}

                            {/* Class Picker */}
                            <Text style={styles.label}>Class *</Text>
                            <FlatList
                                horizontal
                                data={classes}
                                keyExtractor={c=>c.id.toString()}
                                renderItem={({item})=>(
                                    <TouchableOpacity
                                        style={[
                                            styles.classItem,
                                            edits.classId===item.id && styles.classSelected
                                        ]}
                                        onPress={()=>setEdits(prev=>({...prev,classId:item.id}))}
                                    >
                                        <Text style={styles.classText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.classList}
                            />

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

    datePickerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },

    classList: { maxHeight: 50, marginVertical: 8 },
    classItem: {
        padding: 8,
        borderRadius: 4,
        backgroundColor: '#eee',
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    classSelected: {
        backgroundColor: '#cceeff',
    },
    classText: { fontSize: 16 },

    flatList: {
        width: '100%',
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    flatListItem: {
        backgroundColor: '#eee',
        marginRight: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        minWidth: 80,
        flex: 0,
    },
    flatListText: {
        fontSize: 16,
        textAlign: 'center',
    },

    item: {
        padding: 12,
        marginBottom: 9,
        marginHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    itemRow: { flex: 1 },
    iconButton: { marginLeft: 10 },
    title: { fontSize: 18, fontWeight: 'bold' },
    dueDate: { fontSize: 14, color: '#555' },
    overdueDate: { fontSize: 14, color: 'red', fontWeight: 'bold' },
    empty: { textAlign: 'center', marginTop: 20, fontSize: 16 },

    actionMenuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionMenuStyled: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%'
    },
    actionMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    actionMenuText: { marginLeft: 10, fontSize: 18, fontWeight: '500' },
    modalOverlay: {
        flex: 1,
        marginTop: 150,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },

});
