import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, StyleSheet, Text as RNText, TextInput } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import api from '../api/client';
import { UserContext } from '../context/UserContext';

export default function ClassesScreen() {
    const { userId } = useContext(UserContext);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState('#ffffff');
    const [editMode, setEditMode] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [classPendingDelete, setClassPendingDelete] = useState(null);

    useEffect(() => {
        if (userId) {
            // GET classes with userId header
            api.get('/api/classes/owner', { headers: { userId } })
                .then(res => setClasses(res.data))
                .catch(err => console.error('Error fetching classes:', err));
        }
    }, [userId]);

    const openClass = (cls) => {
        if (selectedClass && selectedClass.id === cls.id) {
            setSelectedClass(null);
            setTasks([]);
            setEditMode(false);
        } else {
            setSelectedClass(cls);
            setEditMode(false);
            // GET tasks for class
            api.get(`/api/tasks/class/${cls.id}`)
                .then(res => setTasks(res.data))
                .catch(err => console.error('Error fetching tasks:', err));
        }
    };

    const addClass = () => {
        const payload = { name: newName, color: newColor };
        // POST new class with userId header
        api.post('/api/classes', payload, { headers: { userId } })
            .then(res => {
                setClasses(prev => [...prev, res.data]);
                setNewName('');
                setNewColor('#ffffff');
                setShowAddForm(false);
            })
            .catch(err => console.error('Error adding class:', err));
    };

    const updateClass = () => {
        api.put(`/api/classes/${selectedClass.id}`, selectedClass, { headers: { userId } })
            .then(res => {
                setClasses(prev => prev.map(c => (c.id === res.data.id ? res.data : c)));
                setEditMode(false);
            })
            .catch(err => console.error('Error updating class:', err));
    };

    const deleteClass = () => {
        api.delete(`/api/classes/${classPendingDelete.id}`, { headers: { userId } })
            .then(() => {
                setClasses(prev => prev.filter(c => c.id !== classPendingDelete.id));
                setSelectedClass(null);
                setTasks([]);
                setClassPendingDelete(null);
            })
            .catch(err => console.error('Error deleting class:', err));
    };

    return (
        <View style={styles.container}>
            {/*Landing Page for Classes*/}
            <FlatList
                data={classes}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.classCard, { backgroundColor: item.color || '#ffffff' }]}
                        onPress={() => openClass(item)}
                    >
                        <RNText style={styles.classTitle}>{item.name}</RNText>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{flexGrow: 1}}
            />

            <View style={[styles.bottomButtons, {paddingBottom: 0}]}>
                <TouchableOpacity style={styles.button} onPress={() => setShowAddForm(true)}>
                    <Text style={styles.buttonText}>+ Add Class</Text>
                </TouchableOpacity>
            </View>

            {/*Creating a new class*/}
            <Modal visible={showAddForm} animationType="slide">
                <View style={[styles.modal, { backgroundColor: newColor || '#ffffff' }]}>
                    <RNText style={styles.modalTitle}>Add New Class</RNText>
                    <View style={styles.spacer} />
                    <View style={styles.spacer} />
                    <TextInput
                        placeholder="Class Name"
                        placeholderTextColor="#999"
                        value={newName}
                        onChangeText={setNewName}
                        style={styles.input}
                    />
                    <View style={styles.spacer} />
                    <View style={styles.spacer} />
                    <Text style={styles.text}>Pick Class Color</Text>
                    <ColorPicker
                        initialColor={newColor}
                        onColorChangeComplete={setNewColor}
                        style={{ padding: 10, marginBottom: 20 }}
                    />

                    <View style={styles.bottomButtons}>
                        <TouchableOpacity style={styles.button} onPress={addClass}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAddForm(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/*Options shows after a class is selected*/}
            <Modal visible={selectedClass !== null} animationType="slide">
                <View style={[styles.modal, selectedClass ? {backgroundColor: selectedClass.color || '#ffffff'} : null]}>
                    <RNText style={styles.modalTitle}>{selectedClass?.name}</RNText>
                    {!editMode ? (
                        <>
                            {tasks.map(task => (
                                <RNText key={task.id}>{task.name} - {task.status}</RNText>
                            ))}

                            <View style={styles.bottomButtons}>
                                <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
                                    <Text style={styles.buttonText}>Edit Class</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setSelectedClass(null)}>
                                    <Text style={styles.buttonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        //
                        <>
                            <TextInput
                                value={selectedClass?.name}
                                onChangeText={text => setSelectedClass(prev => ({ ...prev, name: text }))}
                                style={styles.input}
                            />
                            <ColorPicker
                                color={selectedClass?.color || '#ffffff'}
                                onColorChangeComplete={color => setSelectedClass(prev => ({ ...prev, color }))}
                                style={{ flex: 1, marginBottom: 20 }}
                            />
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity style={styles.button} onPress={updateClass}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bottomButtons}>
                                <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => {
                                    setClassPendingDelete(selectedClass);
                                    setShowDeleteConfirm(true);
                                    setEditMode(false);
                                    setSelectedClass(null);
                                }}>
                                    <Text style={styles.buttonText}>Delete Class</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => {
                                    //clears current modals so delete confirmation page can pop up
                                    setEditMode(false);
                                    setSelectedClass(null);
                                }}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                        </>
                    )}
                </View>
            </Modal>
            <Modal visible={showDeleteConfirm} animationType="fade" transparent={true}>
                <View style={styles.confirmModalBackground}>
                    <View style={styles.confirmModal}>
                        <RNText style={styles.modalTitle}>Confirm Deletion</RNText>
                        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20 }}>
                            Are you sure you want to delete this class? {"\n"}
                            {"\n"}
                            {classPendingDelete?.name}
                        </Text>

                        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => {
                            deleteClass();
                            setShowDeleteConfirm(false);
                            setClassPendingDelete(null);
                        }}>
                            <Text style={styles.buttonText}>Yes, Delete</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowDeleteConfirm(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 6,
        width: 140,
        height: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
    },
    cancelButton: {
        backgroundColor: 'gray',
    },
    bottomButtons: {
        marginTop: 'auto',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
    },
    confirmModalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    confirmModal: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 16
    },
    classCard: {
        padding: 16,
        marginBottom: 8,
        borderRadius: 6
    },
    classTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modal: {
        flex: 1,
        padding: 20,
        paddingTop: 80,
        justifyContent: 'center'
    },
    modalTitle: {
        borderBottomWidth: 1,
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12
    },
    input: {
        borderBottomWidth: 1,
        fontSize: 20,
        padding: 8
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 8,
        paddingBottom: 0
    },
    spacer: {
        height: 10
    }
});