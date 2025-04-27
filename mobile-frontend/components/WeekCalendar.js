import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { UserContext } from '../context/UserContext';
import api from '../api/client';
import { startOfWeek, addDays, format } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const screenWidth = Dimensions.get('window').width;

export function WeekCalendar() {
    const { userId } = useContext(UserContext);
    const [classes, setClasses] = useState([]);
    const [tasksByDate, setTasksByDate] = useState({});
    const [week, setWeek] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useFocusEffect(
        useCallback(() => {
            const start = startOfWeek(currentDate, { weekStartsOn: 1 });
            const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
            setWeek(days);

            api.get(`/api/classes/owner`, { headers: { userId } })
                .then(res => setClasses(res.data))
                .catch(console.error);

            api.get(`/api/tasks/owner/${userId}`)
                .then(res => {
                    const map = {};
                    days.forEach(d => { const key = format(d, 'yyyy-MM-dd'); map[key] = []; });
                    res.data.forEach(t => {
                        if (map[t.dueDate]) map[t.dueDate].push(t);
                    });
                    setTasksByDate(map);
                })
                .catch(console.error);
        }, [userId, currentDate])
    );

    const goToPreviousWeek = () => {
        setCurrentDate(prev => addDays(prev, -7));
    };

    const goToNextWeek = () => {
        setCurrentDate(prev => addDays(prev, 7));
    };

    const getClassColor = id => classes.find(c => c.id === id)?.color || '#fff';

    return (
        <View style={styles.panel}>
            <Text style={styles.title}>Weekly Tasks</Text>

            {/* Month centered */}
            <Text style={styles.monthText}>
                {format(currentDate, 'MMMM yyyy')}
            </Text>

            {/* Calendar scroll */}
            <ScrollView horizontal style={styles.calendar}>
                {week.map(date => {
                    const key = format(date, 'yyyy-MM-dd');
                    const items = tasksByDate[key] || [];
                    return (
                        <View key={key} style={styles.dayColumn}>
                            <Text style={styles.dayLabel}>{format(date, 'EEE')}</Text>
                            <Text style={styles.dateLabel}>{format(date, 'dd')}</Text>
                            {items.map(task => (
                                <View key={task.id} style={[styles.taskBadge, { backgroundColor: getClassColor(task.classId) }]}>
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

                <TouchableOpacity style={styles.todayButton} onPress={() => setCurrentDate(new Date())}>
                    <Text style={styles.buttonText}>Go to Current Week</Text>
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
        marginTop: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    navButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    buttonText: {
        fontWeight: 'bold',
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },

    calendar: {
        marginBottom: 10,
    },
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
    dayLabel: {
        fontWeight: 'bold',
    },
    dateLabel: {
        marginBottom: 5,
    },
    taskBadge: {
        padding: 4,
        borderRadius: 4,
        marginBottom: 4,
        width: '100%',
    },
    centerButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    todayButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#eee',
        borderRadius: 8,
    },

});
