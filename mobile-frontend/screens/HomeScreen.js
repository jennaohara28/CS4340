import React from 'react';
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { TaskStatusChart } from '../components/TaskStatusChart';
import { TaskSnapshot } from '../components/TaskSnapshot';
import { WeekCalendar } from '../components/WeekCalendar';

export default function HomeScreen() {
    const { width } = useWindowDimensions();
    const isLandscape = width > 600;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={[styles.row, isLandscape && styles.landscapeRow]}>
                    <View style={[styles.panel, isLandscape && styles.flexPanel]}>
                        <TaskStatusChart />
                    </View>
                    <View style={[styles.panel, isLandscape && styles.flexPanel]}>
                        <TaskSnapshot />
                    </View>
                </View>
                <View style={styles.panel}>
                    <WeekCalendar />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, padding: 10 },
    row: { flexDirection: 'column' },
    landscapeRow: { flexDirection: 'row' },
    panel: { margin: 5 },
    flexPanel: { flex: 1 }
});
