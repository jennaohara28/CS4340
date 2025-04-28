// screens/WeekCalendar.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { startOfWeek, addDays, format } from 'date-fns';
import { useFilteredTasks } from '../hooks/useFilteredTasks';
import { useClasses } from '../hooks/useClasses';

export function WeekCalendar() {
    // new hook returns [tasks, fetchTasks] — we only need the array
    const [tasks] = useFilteredTasks();
    const classes = useClasses();

    const [tasksByDate, setTasksByDate] = useState({});
    const [week, setWeek] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    // key for today so we can highlight quickly
    const todayKey = format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday-start week
        const days  = Array.from({ length: 7 }, (_, i) => addDays(start, i));
        setWeek(days);

        // empty map for each day in this week
        const map = {};
        days.forEach(d => {
            map[format(d, 'yyyy-MM-dd')] = [];
        });

        // bucket tasks by due date
        tasks.forEach(task => {
            if (task.dueDate) {
                const key = format(new Date(task.dueDate), 'yyyy-MM-dd');
                if (map[key]) map[key].push(task);
            }
        });

        setTasksByDate(map);
    }, [tasks, currentDate]);

    // navigation helpers
    const goToPreviousWeek = () => setCurrentDate(prev => addDays(prev, -7));
    const goToNextWeek     = () => setCurrentDate(prev => addDays(prev, 7));
    const goToToday        = () => setCurrentDate(new Date());

    const getClassColor = id => classes.find(c => c.id === id)?.color || '#fff';

    return (
        <View style={styles.panel}>
            <Text style={styles.title}>Weekly Tasks</Text>
            <Text style={styles.monthText}>{format(currentDate, 'MMMM yyyy')}</Text>

            <ScrollView horizontal style={styles.calendar} showsHorizontalScrollIndicator={false}>
                {week.map(date => {
                    const key     = format(date, 'yyyy-MM-dd');
                    const items   = tasksByDate[key] || [];
                    const isToday = key === todayKey;

                    return (
                        <View
                            key={key}
                            style={[styles.dayColumn, isToday && styles.todayColumn]}
                        >
                            <Text style={[styles.dayLabel, isToday && styles.todayText]}>
                                {format(date, 'EEE')}
                            </Text>
                            <Text style={[styles.dateLabel, isToday && styles.todayText]}>
                                {format(date, 'dd')}
                            </Text>

                            {items.map(task => (
                                <View
                                    key={task.id}
                                    style={[
                                        styles.taskBadge,
                                        { backgroundColor: getClassColor(task.classId) }
                                    ]}
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
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginTop: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
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
        minHeight: 100,
    },
    // highlight for today
    todayColumn: {
        backgroundColor: '#e6f6ff',
        borderColor: '#2196f3',
    },
    dayLabel: { fontWeight: 'bold' },
    dateLabel: { marginBottom: 5 },
    todayText: { color: '#2196f3', fontWeight: 'bold' },
    taskBadge: {
        padding: 4,
        borderRadius: 4,
        marginBottom: 4,
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    navButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    buttonText: { fontWeight: 'bold' },
});
