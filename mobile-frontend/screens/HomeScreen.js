// screens/HomeScreen.js
import React from 'react';
import {
    SafeAreaView,
    FlatList,         // ← VirtualizedList–backed
    View,
    StyleSheet,
    useWindowDimensions
} from 'react-native';
import { TaskStatusChart } from '../components/TaskStatusChart';
import { TaskSnapshot }    from '../components/TaskSnapshot';
import { WeekCalendar }    from '../components/WeekCalendar';

export default function HomeScreen() {
    const { width } = useWindowDimensions();
    const isLandscape = width > 600;

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={[{ id: 'home' }]}
                keyExtractor={item => item.id}
                renderItem={() => (
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
                )}
                contentContainerStyle={styles.scrollContainer}
                nestedScrollEnabled={true}  // let inner FlatList scroll
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea:       { flex: 1, backgroundColor: '#dfe9fd' },
    scrollContainer:{ flexGrow: 1, padding: 10 },
    container:      { flex: 1 },
    row:            { flexDirection: 'column' },
    landscapeRow:   { flexDirection: 'row' },
    panel:          { marginBottom: 10 },
    flexPanel:      { flex: 1 },
});
