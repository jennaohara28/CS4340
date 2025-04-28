// screens/WeekCalendar.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { startOfWeek, addDays, format } from 'date-fns';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { useClasses } from '../hooks/useClasses';

export function WeekCalendar() {
    const [tasks] = useFilteredTasks();   // ← grab only the tasks array
    const classes = useClasses();

    const [tasksByDate, setTasksByDate] = useState({});
    const [week, setWeek] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
        setWeek(days);

        const map = {};
        days.forEach(d => {
            const key = format(d, 'yyyy-MM-dd');
            map[key] = [];
        });

        tasks.forEach(task => {
            if (task.dueDate) {
                const key = format(new Date(task.dueDate), 'yyyy-MM-dd');
                if (map[key]) map[key].push(task);
            }
        });

        setTasksByDate(map);
    }, [tasks, currentDate]);

    const goToPreviousWeek = () => setCurrentDate(prev => addDays(prev, -7));
    const goToNextWeek     = () => setCurrentDate(prev => addDays(prev, 7));
    const goToToday        = () => setCurrentDate(new Date());

    const getClassColor = id => classes.find(c => c.id === id)?.color || '#fff';

    return (
        <View style={styles.panel}>
            <Text style={styles.title}>Weekly Tasks</Text>
            <Text style={styles.monthText}>{format(currentDate, 'MMMM yyyy')}</Text>

            <ScrollView horizontal style={styles.calendar}>
                {week.map(date => {
                    const key   = format(date, 'yyyy-MM-dd');
                    const items = tasksByDate[key] || [];
                    return (
                        <View key={key} style={styles.dayColumn}>
                            <Text style={styles.dayLabel}>{format(date, 'EEE')}</Text>
                            <Text style={styles.dateLabel}>{format(date, 'dd')}</Text>
                            {items.map(task => (
                                <View
                                    key={task.id}
                                    style={[styles.taskBadge, { backgroundColor: getClassColor(task.classId) }]}
                                >
                                    <Text numberOfLines={1}>{task.name}</Text>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </ScrollView>

            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.navButton} onPress={goToPreviousWeek}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
                    <Text style={styles.buttonText}>This Week</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={goToNextWeek}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: '#fff7e6',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginTop: 10
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    calendar: { marginBottom: 10 },
    dayColumn: {
        width: 80,
        padding: 5,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 5,
        borderRadius: 4,
        minHeight: 100
    },
    dayLabel: { fontWeight: 'bold' },
    dateLabel: { marginBottom: 5 },
    taskBadge: {
        padding: 4,
        borderRadius: 4,
        marginBottom: 4,
        width: '100%'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    navButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8
    },
    buttonText: { fontWeight: 'bold' }
});
