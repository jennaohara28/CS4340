import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

import { useClasses } from '../hooks/useClasses';
import { useFilteredTasks } from '../hooks/useFilteredTasks';

export default function ClassesScreen() {
    const classes = useClasses();
    const allTasks = useFilteredTasks();

    const [selectedClass, setSelectedClass] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState('');
    const [newColor, setNewColor] = useState('#ffffff');
    const [editMode, setEditMode] = useState(false);
    const [classPendingDelete, setClassPendingDelete] = useState(null);

    const openClass = cls => {
        if (selectedClass && selectedClass.id === cls.id) {
            setSelectedClass(null);
            setEditMode(false);
        } else {
            setSelectedClass(cls);
            setEditMode(false);
        }
    };

    const addClass = () => {
        // delegate to API elsewhere or incorporate a hook
        // placeholder
        console.log('Add class', newName, newColor);
        setShowAddForm(false);
    };

    const updateClass = () => {
        console.log('Update class', selectedClass);
        setEditMode(false);
    };

    const deleteClass = () => {
        console.log('Delete class', classPendingDelete);
        setClassPendingDelete(null);
        setSelectedClass(null);
    };

    // filter tasks for selected class
    const tasksForClass = selectedClass
        ? allTasks.filter(t => t.classId === selectedClass.id)
        : [];

    return (
        <View style={styles.container}>
            <FlatList
                data={classes}
                keyExtractor={c => c.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.classCard, { backgroundColor: item.color }]}
                        onPress={() => openClass(item)}
                    >
                        <Text style={styles.classTitle}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {selectedClass && (
                <View style={[styles.detailPanel, { backgroundColor: selectedClass.color }]}>
                    <Text style={styles.detailTitle}>{selectedClass.name}</Text>
                    {tasksForClass.map(task => (
                        <Text key={task.id} style={styles.taskText}>
                            • {task.name} ({task.status})
                        </Text>
                    ))}

                    {!editMode ? (
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setClassPendingDelete(selectedClass)}>
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={styles.input}
                                value={selectedClass.name}
                                onChangeText={text => setSelectedClass(prev => ({ ...prev, name: text }))}
                            />
                            <ColorPicker
                                initialColor={selectedClass.color}
                                onColorChangeComplete={color => setSelectedClass(prev => ({ ...prev, color }))}
                                style={{ flex: 1, marginVertical: 10 }}
                            />
                            <TouchableOpacity style={styles.button} onPress={updateClass}>
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {/* Add Class Modal */}
            <Modal visible={showAddForm} animationType="slide">
                <View style={[styles.modal, { backgroundColor: newColor }]}>
                    <Text style={styles.modalTitle}>Add Class</Text>
                    <TextInput
                        placeholder="Name"
                        style={styles.input}
                        value={newName}
                        onChangeText={setNewName}
                    />
                    <ColorPicker
                        initialColor={newColor}
                        onColorChangeComplete={setNewColor}
                        style={{ flex: 1, marginVertical: 10 }}
                    />
                    <TouchableOpacity style={styles.button} onPress={addClass}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal visible={!!classPendingDelete} transparent>
                <View style={styles.confirmBackground}>
                    <View style={styles.confirmModal}>
                        <Text style={styles.modalTitle}>Delete {classPendingDelete?.name}?</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={deleteClass}>
                                <Text style={styles.buttonText}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => setClassPendingDelete(null)}>
                                <Text style={styles.buttonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={() => setShowAddForm(true)}>
                <Text style={styles.buttonText}>+ Add Class</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    classCard: { padding: 16, margin: 8, borderRadius: 8 },
    classTitle: { fontSize: 18, fontWeight: 'bold' },
    detailPanel: { padding: 16, borderRadius: 8, margin: 8, flex: 1 },
    detailTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    taskText: { fontSize: 16, marginVertical: 2 },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },
    button: { padding: 12, backgroundColor: '#007bff', borderRadius: 8, minWidth: 100, alignItems: 'center' },
    deleteButton: { backgroundColor: 'red' },
    buttonText: { color: 'white', fontWeight: 'bold' },
    input: { borderBottomWidth: 1, marginVertical: 8, padding: 8, fontSize: 16 },
    modal: { flex: 1, padding: 16, paddingTop: 80 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    confirmBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    confirmModal: { backgroundColor: 'white', padding: 20, borderRadius: 8, width: '80%' },
    addButton: { position: 'absolute', right: 16, bottom: 16 }
});
