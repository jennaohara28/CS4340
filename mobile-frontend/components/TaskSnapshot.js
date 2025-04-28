// components/TaskSnapshot.js
import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { useClasses } from '../hooks/useClasses';
import { format, isBefore, startOfToday } from 'date-fns';

export function TaskSnapshot() {
    const [tasks] = useFilteredTasks();
    const classes = useClasses();
    const navigation = useNavigation();

    const renderItem = ({ item }) => {
        const due = item.dueDate ? new Date(item.dueDate) : null;
        const overdue =
            due &&
            item.status !== 'Done' &&
            isBefore(due, startOfToday());

        return (
            <TouchableOpacity
                style={[
                    styles.snapshotItem,
                    { backgroundColor: classes.find(c => c.id === item.classId)?.color || '#fff' }
                ]}
                onPress={() => navigation.navigate('Tasks', { task: item })}
            >
                <Text style={[styles.taskName, item.status === 'Done' && styles.done]}>
                    {item.name}
                </Text>
                <Text style={[styles.taskDueDate, overdue && styles.overdue]}>
                    {due && format(due, 'MMM d')}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.snapshotContainer}>
            <Text style={styles.snapshotTitle}>Task Snapshot</Text>
            <View style={styles.listWrapper}>
                <FlatList
                    data={tasks}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator
                    style={styles.list}
                />
            </View>
            <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => navigation.navigate('Tasks')}
            >
                <Text style={styles.seeAllText}>See All Tasks</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    snapshotContainer: {
        marginTop: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 10,
    },
    snapshotTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    listWrapper: {
        height: 230,       // fixed height for scrollable area
        marginBottom: 10,
        overflow: 'hidden',
    },
    list: {
        flex: 1,           // fill the wrapper, enabling scrolling
    },
    snapshotItem: {
        padding: 10,
        marginBottom: 5,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskName: {
        flex: 1,
        fontWeight: 'bold',
    },
    taskDueDate: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    overdue: {
        color: 'red',
    },
    done: {
        color: 'green',
    },
    seeAllButton: {
        marginTop: 5,
        paddingVertical: 12,
        backgroundColor: '#007AFF',
        borderRadius: 6,
        alignItems: 'center',
    },
    seeAllText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
