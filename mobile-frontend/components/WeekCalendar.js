import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { UserContext } from '../context/UserContext';
import api from '../api/client';
import { startOfWeek, addDays, format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

// Week Calendar Component
export function WeekCalendar() {
    const { userId } = useContext(UserContext);
    const [classes, setClasses] = useState([]);
    const [tasksByDate, setTasksByDate] = useState({});
    const [week, setWeek] = useState([]);

    useEffect(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const days = Array.from({ length: 7 }, (_,i) => addDays(start, i));
        setWeek(days);

        api.get(`/api/classes/owner/`, { headers:{ userId } })
            .then(res=>setClasses(res.data))
            .catch(console.error);

        api.get('/api/classes/owner', { headers: { userId } })
            .then(res => {
                const map = {};
                days.forEach(d => { const key = format(d,'yyyy-MM-dd'); map[key]=[]; });
                res.data.forEach(t => {
                    if(map[t.dueDate]) map[t.dueDate].push(t);
                });
                setTasksByDate(map);
            })
            .catch(console.error);
    }, [userId]);

    const getClassColor = id => classes.find(c=>c.id===id)?.color || '#fff';

    return (
        <ScrollView horizontal style={styles.calendar}>
            {week.map(date => {
                const key = format(date,'yyyy-MM-dd');
                const items = tasksByDate[key] || [];
                return (
                    <View key={key} style={styles.dayColumn}>
                        <Text style={styles.dayLabel}>{format(date,'EEE')}</Text>
                        <Text style={styles.dateLabel}>{format(date,'dd')}</Text>
                        {items.map(task=> (
                            <View key={task.id} style={[styles.taskBadge,{backgroundColor:getClassColor(task.classId)}]}>
                                <Text numberOfLines={1}>{task.name}</Text>
                            </View>
                        ))}
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    chartContainer: { margin: 20, backgroundColor:'#fff7e6', borderRadius:8, padding:10 },
    switchRow: { flexDirection:'row', justifyContent:'center', marginBottom:10 },
    switchButton: { paddingHorizontal:12, paddingVertical:6, marginHorizontal:5, borderRadius:4, backgroundColor:'#eee' },
    activeSwitch: { backgroundColor:'#ffa742' },
    switchText:{ fontWeight:'bold' },
    calendar: { padding:10, backgroundColor:'#fff7e6', borderRadius:8, margin:20 },
    dayColumn: { width:80, padding:5, alignItems:'center', borderWidth:1, borderColor:'#ddd', marginRight:5, borderRadius:4 },
    dayLabel:{ fontWeight:'bold' },
    dateLabel:{ marginBottom:5 },
    taskBadge:{ padding:4, borderRadius:4, marginBottom:4, width:'100%' },
    snapshotContainer:{ margin:20, backgroundColor:'#fff7e6', borderRadius:8, padding:10, maxHeight:300 },
    snapshotTitle:{ fontSize:18, fontWeight:'bold', textAlign:'center', marginBottom:10 },
    snapshotItem:{ padding:10, marginBottom:5, borderRadius:4 }
});