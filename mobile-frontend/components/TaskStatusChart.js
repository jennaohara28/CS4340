import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { UserContext } from '../context/UserContext';
import api from '../api/client';

export function TaskStatusChart() {
    const { userId } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState('pie');

    // dynamically size the chart based on orientation
    const { width: windowWidth } = useWindowDimensions();
    const isLandscape = windowWidth > 600;
    const chartWidth = isLandscape ? windowWidth / 2 - 40 : windowWidth - 40;

    useEffect(() => {
        api.get(`/api/tasks/owner/${userId}`)
            .then(res => {
                const tasks = res.data;
                const counts = { 'To-Do': 0, 'In-Progress': 0, 'Done': 0, 'No Status': 0 };
                tasks.forEach(t => {
                    if (!t.status) counts['No Status']++;
                    else counts[t.status] = (counts[t.status] || 0) + 1;
                });
                const chartData = Object.entries(counts)
                    .filter(([, v]) => v > 0)
                    .map(([name, value], i) => ({
                        name,
                        value,
                        color: ['#f9dca4', '#FFC04C', '#FFA500', '#FF8C00'][i],
                        legendFontColor: '#333',
                        legendFontSize: 14
                    }));
                setData(chartData);
            })
            .catch(err => console.error(err));
    }, [userId]);

    const config = {
        backgroundColor: '#fff',
        backgroundGradientFrom: '#fff7e6',
        backgroundGradientTo: '#fff7e6',
        color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        strokeWidth: 2,
        useShadowColorFromDataset: false
    };

    return (
        <View style={styles.chartContainer}>
            <View style={styles.switchRow}>
                {['pie', 'bar'].map(type => (
                    <TouchableOpacity
                        key={type}
                        onPress={() => setChartType(type)}
                        style={[styles.switchButton, chartType === type && styles.activeSwitch]}
                    >
                        <Text style={styles.switchText}>{type.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {chartType === 'pie' ? (
                <PieChart
                    data={data}
                    width={chartWidth}
                    height={220}
                    chartConfig={config}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            ) : (
                <BarChart
                    data={{ labels: data.map(d => d.name), datasets: [{ data: data.map(d => d.value) }] }}
                    width={chartWidth}
                    height={220}
                    chartConfig={config}
                    fromZero
                    showValuesOnTopOfBars
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: { margin: 20, backgroundColor: '#fff7e6', borderRadius: 8, padding: 10 },
    switchRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
    switchButton: { paddingHorizontal: 12, paddingVertical: 6, marginHorizontal: 5, borderRadius: 4, backgroundColor: '#eee' },
    activeSwitch: { backgroundColor: '#ffa742' },
    switchText: { fontWeight: 'bold' }
});
