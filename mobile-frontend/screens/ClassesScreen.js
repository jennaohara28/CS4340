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
        api.delete(`/api/classes/${selectedClass.id}`, { headers: { userId } })
            .then(() => {
                setClasses(prev => prev.filter(c => c.id !== selectedClass.id));
                setSelectedClass(null);
                setTasks([]);
            })
            .catch(err => console.error('Error deleting class:', err));
    };

    return (
        <View style={styles.container}>
            <Button title="+ Add Class" onPress={() => setShowAddForm(true)} />
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
            />

            {/*creating a new class*/}
            <Modal visible={showAddForm} animationType="slide">
                <View style={styles.modal}>
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
                    <Button title="Save" onPress={addClass} />
                    <Button title="Cancel" onPress={() => setShowAddForm(false)} />
                </View>
            </Modal>

            {/*options when selecting a class from list of classes*/}
            <Modal visible={selectedClass !== null} animationType="slide">
                <View style={styles.modal}>
                    <RNText style={styles.modalTitle}>{selectedClass?.name} Details</RNText>
                    {!editMode ? (
                        <>
                            {tasks.map(task => (
                                <RNText key={task.id}>{task.name} - {task.status}</RNText>
                            ))}
                            <Button title="Edit Class" onPress={() => setEditMode(true)} />
                            <Button title="Delete Class" color="red" onPress={deleteClass} />
                            <Button title="Close" onPress={() => setSelectedClass(null)} />
                        </>
                    ) : (
                        <>
                            <TextInput
                                value={selectedClass?.name}
                                onChangeText={text => setSelectedClass(prev => ({ ...prev, name: text }))}
                                style={styles.input}
                            />
                            <ColorPicker
                                initialColor={selectedClass?.color}
                                onColorChangeComplete={color => setSelectedClass(prev => ({ ...prev, color }))}
                                style={{ flex: 1, marginBottom: 20 }}
                            />
                            <Button title="Save" onPress={updateClass} />
                            <Button title="Cancel" onPress={() => setEditMode(false)} />
                        </>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16
    },
    classCard: {
        padding: 12,
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