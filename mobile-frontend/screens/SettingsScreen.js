// screens/SettingsScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Switch,
    StyleSheet,
    TouchableOpacity,
    Animated
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SettingsContext } from '../context/SettingsContext';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
    const {
        showCompletedTasks,
        setShowCompletedTasks,
        showPastDueTasks,
        setShowPastDueTasks,
        sortField,
        setSortField,
        sortOrderAsc,
        setSortOrderAsc,
        showCompletedAtBottom,
        setShowCompletedAtBottom
    } = useContext(SettingsContext);
    const { setUserId } = useContext(UserContext);

    const [pickerValue, setPickerValue] = useState(sortField);
    const [showPicker, setShowPicker] = useState(false);
    const animation = useState(new Animated.Value(0))[0];

    useEffect(() => {
        setSortField(pickerValue);
    }, [pickerValue]);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: showPicker ? 1 : 0,
            duration: 300,
            useNativeDriver: false
        }).start();
    }, [showPicker]);

    const pickerHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180]
    });

    const handleLogout = () => {
        setUserId(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={styles.section}>

                <View style={styles.row}>
                    <Text style={styles.label}>Show Completed Tasks</Text>
                    <Switch
                        value={showCompletedTasks}
                        onValueChange={setShowCompletedTasks}
                    />
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Show Past-Due Tasks</Text>
                    <Switch
                        value={showPastDueTasks}
                        onValueChange={setShowPastDueTasks}
                    />
                </View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Completed Tasks at Bottom</Text>
                    <Switch
                        value={showCompletedAtBottom}
                        onValueChange={setShowCompletedAtBottom}
                    />
                </View>
                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.row}
                    onPress={() => setShowPicker(prev => !prev)}
                >
                    <Text style={styles.label}>Filter By</Text>
                    <View style={styles.rowEnd}>
                        <Text style={styles.pickerText}>{pickerValue}</Text>
                        <Ionicons
                            name={showPicker ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="#555"
                        />
                    </View>
                </TouchableOpacity>
                <Animated.View style={[styles.pickerContainer, { height: pickerHeight }]}>
                    {showPicker && (
                        <Picker
                            selectedValue={pickerValue}
                            onValueChange={val => setPickerValue(val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Name" value="name" />
                            <Picker.Item label="Due Date" value="dueDate" />
                            <Picker.Item label="Time Allocation" value="timeAll" />
                            <Picker.Item label="Type" value="type" />
                            <Picker.Item label="Status" value="status" />
                            <Picker.Item label="Priority" value="priority" />
                            <Picker.Item label="Class" value="classId" />
                        </Picker>
                    )}
                </Animated.View>
                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>
                        {sortOrderAsc ? 'Ascending Order' : 'Descending Order'}
                    </Text>
                    <Switch
                        value={sortOrderAsc}
                        onValueChange={setSortOrderAsc}
                    />
                </View>
                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f2', padding: 16 },
    title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 24 },
    section: { backgroundColor: '#fff', borderRadius: 10, padding: 16, elevation: 3 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    label: { fontSize: 18, color: '#555', flex: 1 },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 8 },
    pickerText: { fontSize: 18, color: '#555', marginRight: 8 },
    rowEnd: { flexDirection: 'row', alignItems: 'center' },
    pickerContainer: { overflow: 'hidden' },
    picker: { width: '100%', height: 180 },
    logoutButton: { marginTop: 16, padding: 12, backgroundColor: '#ff4d4d', borderRadius: 8, alignItems: 'center' },
    logoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});
