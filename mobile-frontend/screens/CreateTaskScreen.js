// CreateTaskScreen.js
import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/client';
import { UserContext } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const themeColor = '#3e71c9';

export default function CreateTaskScreen({ navigation, route }) {
  const { userId } = useContext(UserContext);
  const editingTask = route.params?.task;
  const isEditing = Boolean(editingTask);

  // Form state
  const [name, setName] = useState(editingTask?.name || '');
  const [dueDate, setDueDate] = useState(
      editingTask && editingTask.dueDate ? new Date(editingTask.dueDate) : new Date()
  );
  const [type, setType] = useState(editingTask?.type || '');
  const [timeAll, setTimeAll] = useState(editingTask ? String(editingTask.timeAll) : '');
  const [status, setStatus] = useState(editingTask?.status || 'To-Do');
  const [priority, setPriority] = useState(editingTask ? String(editingTask.priority) : '1');
  const [classId, setClassId] = useState(editingTask?.classId || null);
  const [classes, setClasses] = useState([]);

  // Fetch classes on focus
  useFocusEffect(
      useCallback(() => {
        if (!userId) return;
        api
            .get('/api/classes/owner', { headers: { userId } })
            .then(res => setClasses(res.data))
            .catch(err => console.error('Error fetching classes:', err));
      }, [userId])
  );

  // Helper to reset all form fields
  const clearForm = () => {
    setName('');
    setDueDate(new Date());
    setType('');
    setTimeAll('');
    setStatus('To-Do');
    setPriority('1');
    setClassId(null);
  };

  // Reset form on focus (prefill if editing, clear if creating)
  useFocusEffect(
      useCallback(() => {
        if (isEditing) {
          setName(editingTask.name || '');
          setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : new Date());
          setType(editingTask.type || '');
          setTimeAll(editingTask.timeAll != null ? String(editingTask.timeAll) : '');
          setStatus(editingTask.status || 'To-Do');
          setPriority(editingTask.priority != null ? String(editingTask.priority) : '1');
          setClassId(editingTask.classId || null);
        } else {
          clearForm();
        }
      }, [editingTask])
  );

  // Clear form state whenever screen blurs
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      clearForm();
      navigation.setParams({ task: null });
    });
    return unsubscribe;
  }, [navigation]);

  const handleDateChange = (event, selected) => {
    if (selected) setDueDate(selected);
  };

  const handleSubmit = async () => {
    const url = `/api/tasks/${editingTask?.id}`;
    const body = {
      id: editingTask?.id,          // add id here to be extra safe
      name: name.trim(),
      dueDate: dueDate.toISOString().split('T')[0],
      type: type.trim(),
      timeAll: Number(timeAll) || 0,
      status,
      priority: Number(priority),
      classId,
      ownerId: isEditing
          ? editingTask.ownerId        // preserve existing owner on edit
          : userId
    };

    if (isEditing) {
      console.log('PUT ->', url, body);
      await api.put(url, body);
    } else {
      console.log('POST -> /api/tasks', body);
      await api.post('/api/tasks', body);
    }

    clearForm();
    navigation.navigate("Tasks");
  };


  return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.inner}>
            <View style={styles.field}>
              <Text style={styles.label}>Task Name *</Text>
              <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter task name"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Due Date</Text>
              <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  style={styles.datePicker}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Type</Text>
              <TextInput
                  style={styles.input}
                  value={type}
                  onChangeText={setType}
                  placeholder="Enter task type"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Time Allocation (hrs)</Text>
              <TextInput
                  style={styles.input}
                  value={timeAll}
                  onChangeText={setTimeAll}
                  placeholder="0"
                  keyboardType="numeric"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerWrapperStatic}>
                {['To-Do', 'In-Progress', 'Done'].map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[
                          styles.pickerItemStatic,
                          status === item && styles.selectedStatic
                        ]}
                        onPress={() => setStatus(item)}
                    >
                      <Text style={status === item ? styles.selectedText : styles.pickerText}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.pickerWrapperStatic}>
                {['1', '2', '3'].map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[
                          styles.pickerItemStatic,
                          priority === item && styles.selectedStatic
                        ]}
                        onPress={() => setPriority(item)}
                    >
                      <Text style={priority === item ? styles.selectedText : styles.pickerText}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Class *</Text>
              <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.classList}
              >
                {classes.map(c => (
                    <TouchableOpacity
                        key={c.id}
                        style={[
                          styles.classItem,
                          classId === c.id && styles.selectedClass
                        ]}
                        onPress={() => setClassId(c.id)}
                    >
                      <Text style={classId === c.id ? styles.selectedText : styles.pickerText}>
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {isEditing ? 'Save Task' : 'Create Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfe9fd' },
  inner: { padding: 16 },
  field: { marginBottom: 20, width: '100%' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  datePicker: {
    width: 500,
    alignSelf: 'center',
    backgroundColor: "#5585d7",
    borderRadius: 8,
  },
  pickerWrapperStatic: { flexDirection: 'row', justifyContent: 'space-between' },
  pickerItemStatic: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  selectedStatic: { backgroundColor: themeColor, borderColor: themeColor },
  pickerText: { color: '#333', textAlign: 'center' },
  selectedText: { color: '#fff', textAlign: 'center' },
  classList: { paddingVertical: 4 },
  classItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  selectedClass: { backgroundColor: themeColor, borderColor: themeColor },
  button: {
    marginTop: 24,
    backgroundColor: themeColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
