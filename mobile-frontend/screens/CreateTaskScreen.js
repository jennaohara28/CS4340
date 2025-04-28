import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../api/client';
import { UserContext } from '../context/UserContext';
import {useFocusEffect} from "@react-navigation/native";

export default function CreateTaskScreen({ navigation }) {
  const { userId } = useContext(UserContext);

  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState('');
  const [timeAll, setTimeAll] = useState('');
  const [status, setStatus] = useState('To-Do'); // Default status is "To-Do"
  const [priority, setPriority] = useState('1');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState([]);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  useFocusEffect(
      useCallback(() => {
        if (!userId) return;
        api
            .get('/api/classes/owner', { headers: { userId } })
            .then(res => setClasses(res.data))
            .catch(err => console.error('Error fetching classes:', err));
      }, [userId])
  );

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !classId) {
      alert('Please fill in required fields');
      return;
    }
    const payload = {
      name,
      dueDate: dueDate.toISOString().split('T')[0],
      type,
      timeAll: Number(timeAll) || 0,
      status,
      priority: Number(priority),
      classId: Number(classId),
      ownerId: userId,
    };
    try {
      await api.post('/api/tasks', payload);
      navigation.goBack();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  const renderClass = ({ item }) => (
      <TouchableOpacity
          style={[
            styles.classItem,
            classId === String(item.id) && styles.classSelected,
          ]}
          onPress={() => setClassId(String(item.id))}
      >
        <Text style={styles.classText}>{item.name}</Text>
      </TouchableOpacity>
  );

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>
            <Text style={styles.label}>Task Name *</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter task name"
            />

            <Text style={styles.label}>Due Date</Text>
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                  value={dueDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
              />
            </View>


            <Text style={styles.label}>Type</Text>
            <TextInput
                style={styles.input}
                value={type}
                onChangeText={setType}
                placeholder="Enter task type"
            />

            <Text style={styles.label}>Time Allocation (hrs)</Text>
            <TextInput
                style={styles.input}
                value={timeAll}
                onChangeText={setTimeAll}
                placeholder="0"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Status</Text>
            <TouchableOpacity
                style={[styles.classItem, styles.classSelected]}
                onPress={() => setShowStatusPicker(!showStatusPicker)}
            >
              <Text style={styles.classText}>{status}</Text>
            </TouchableOpacity>
            {showStatusPicker && (
                <FlatList
                    horizontal
                    data={['To-Do', 'In-progress', 'Done']}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.flatListItem}
                            onPress={() => {
                              setStatus(item);
                              setShowStatusPicker(false);
                            }}
                        >
                          <Text style={styles.flatListText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.flatList}  // Apply layout properties here
                />
            )}

            <Text style={styles.label}>Priority</Text>
            <TouchableOpacity
                style={[styles.classItem, styles.classSelected]}
                onPress={() => setShowPriorityPicker(!showPriorityPicker)}
            >
              <Text style={styles.classText}>{priority}</Text>
            </TouchableOpacity>
            {showPriorityPicker && (
                <FlatList
                    horizontal
                    data={['1', '2', '3']}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.flatListItem}
                            onPress={() => {
                              setPriority(item);
                              setShowPriorityPicker(false);
                            }}
                        >
                          <Text style={styles.flatListText}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.flatList}  // Apply layout properties here
                />
            )}

            <Text style={styles.label}>Class *</Text>
            <FlatList
                horizontal
                data={classes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderClass}
                style={styles.classList}
            />

            <Button title="Create Task" onPress={handleSubmit} />
          </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DFE9FDFF', },
  inner: { padding: 16, justifyContent: 'center' },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderBottomWidth: 1, marginBottom: 8, padding: 4 },
  datePickerContainer: {
    justifyContent: 'center', // Centers vertically
    alignItems: 'center', // Centers horizontally
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
});

