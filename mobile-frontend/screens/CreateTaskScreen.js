import React, { useState, useContext, useCallback } from 'react';
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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/client';
import { UserContext } from '../context/UserContext';
import { useFocusEffect } from '@react-navigation/native';

const themeColor = '#3e71c9';

export default function CreateTaskScreen({ navigation }) {
  const { userId } = useContext(UserContext);

  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [type, setType] = useState('');
  const [timeAll, setTimeAll] = useState('');
  const [status, setStatus] = useState('To-Do');
  const [priority, setPriority] = useState('1');
  const [classId, setClassId] = useState(null);
  const [classes, setClasses] = useState([]);

  useFocusEffect(
      useCallback(() => {
        if (!userId) return;
        api
            .get('/api/classes/owner', { headers: { userId } })
            .then(res => setClasses(res.data))
            .catch(err => console.error('Error fetching classes:', err));
      }, [userId])
  );

  const clearForm = () => {
    setName('');
    setDueDate(new Date());
    setType('');
    setTimeAll('');
    setStatus('To-Do');
    setPriority('1');
    setClassId(null);
  };

  const handleDateChange = (event, selected) => {
    if (selected) setDueDate(selected);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !classId) {
      alert('Please fill in required fields');
      return;
    }
    const payload = {
      name: name.trim(),
      dueDate: dueDate.toISOString().split('T')[0],
      type: type.trim(),
      timeAll: Number(timeAll) || 0,
      status,
      priority: Number(priority),
      classId,
      ownerId: userId,
    };
    try {
      await api.post('/api/tasks', payload);
      clearForm();
      navigation.goBack();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.inner}>

            {/* Task Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Task Name *</Text>
              <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter task name"
              />
            </View>

            {/* Due Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Due Date</Text>
              <DateTimePicker
                  style={styles.datePicker}
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
              />
            </View>

            {/* Type */}
            <View style={styles.field}>
              <Text style={styles.label}>Type</Text>
              <TextInput
                  style={styles.input}
                  value={type}
                  onChangeText={setType}
                  placeholder="Enter task type"
              />
            </View>

            {/* Time Allocation */}
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

            {/* Status Picker */}
            <View style={styles.field}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.pickerWrapperStatic}>
                {['To-Do', 'In-Progress', 'Done'].map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[
                          styles.pickerItemStatic,
                          status === item && styles.selectedStatic,
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

            {/* Priority Picker */}
            <View style={styles.field}>
              <Text style={styles.label}>Priority</Text>
              <View style={styles.pickerWrapperStatic}>
                {['1', '2', '3'].map(item => (
                    <TouchableOpacity
                        key={item}
                        style={[
                          styles.pickerItemStatic,
                          priority === item && styles.selectedStatic,
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

            {/* Class Selection: allow horizontal overflow */}
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
                          classId === c.id && styles.selectedClass,
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

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create Task</Text>
            </TouchableOpacity>

          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#dfe9fd' },
  inner: { padding: 16 },
  field: { marginBottom: 20, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  datePicker: {
    width: 500,
    alignSelf: 'center',
    backgroundColor: "#5585d7",
    borderRadius: 8,
  },
  pickerWrapperStatic: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  pickerItemStatic: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
  },
  selectedClass: { backgroundColor: themeColor, borderColor: themeColor },
  button: {
    marginTop: 24,
    backgroundColor: themeColor,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});