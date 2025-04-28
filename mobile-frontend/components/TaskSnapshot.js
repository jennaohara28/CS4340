// components/TaskSnapshot.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { useClasses } from '../hooks/useClasses';
import { format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

export function TaskSnapshot() {
    const [tasks] = useFilteredTasks();     // ← grab only the tasks array
    const classes = useClasses();
    const navigation = useNavigation();

    const getColor = id => classes.find(c => c.id === id)?.color || '#fff';

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.snapshotItem, { backgroundColor: getColor(item.classId) }]}
            onPress={() => navigation.navigate('Tasks', { task: item })}
        >
            <Text style={[styles.taskName, item.status === 'Done' && { color: 'green' }]}>
                {item.name}
            </Text>
            <Text style={styles.taskDueDate}>
                {item.dueDate ? format(new Date(item.dueDate), 'MMM d') : ''}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.snapshotContainer}>
            <Text style={styles.snapshotTitle}>Task Snapshot</Text>
            <FlatList
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    snapshotContainer: {
        marginTop: 10,
        backgroundColor: '#fff7e6',
        borderRadius: 8,
        padding: 10,
        maxHeight: 300
    },
    snapshotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    snapshotItem: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskName: { flex: 1, fontWeight: 'bold' },
    taskDueDate: { fontSize: 14, color: '#555', marginLeft: 10 }
});
