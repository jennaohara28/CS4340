import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { UserContext } from '../context/UserContext';
import api from '../api/client';
import { startOfWeek, addDays, format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

// Task Snapshot List Component
export function TaskSnapshot() {
    const { userId } = useContext(UserContext);
    const [tasks, setTasks] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        // RIGHT:
        api.get('/api/classes/owner', { headers: { userId } })
            .then(res=>setClasses(res.data))
            .catch(console.error);
        api.get(`/api/tasks/owner/${userId}`)
            .then(res=>setTasks(res.data))
            .catch(console.error);
    }, [userId]);

    const getColor = id => classes.find(c=>c.id===id)?.color || '#fff';

    return (
        <View style={styles.snapshotContainer}>
            <Text style={styles.snapshotTitle}>Task Snapshot</Text>
            <FlatList
                data={tasks}
                keyExtractor={item=>item.id.toString()}
                renderItem={({item})=>(
                    <View style={[styles.snapshotItem,{backgroundColor:getColor(item.classId)}]}>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
        </View>
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