import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { UserContext } from '../context/UserContext';
import api from '../api/client';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function TaskStatusChart() {
    const { userId } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState('pie');

    const { width: windowWidth } = useWindowDimensions();
    const isLandscape = windowWidth > 600;

    // Set a max width so it doesn't stretch too far
    const maxChartWidth = 400;
    const chartWidth = Math.min(isLandscape ? windowWidth / 2 - 40 : windowWidth - 40, maxChartWidth);

    useFocusEffect(
        useCallback(() => {
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
                            color: ['#f9dca4', '#FFC04C', '#FFA500', '#FF8C00'][i % 4],
                            legendFontColor: '#333',
                            legendFontSize: 14
                        }));
                    setData(chartData);
                })
                .catch(err => console.error(err));
        }, [userId])
    );


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
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}>Task Status</Text>
                        <View style={styles.chartArea}>
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
                        withInnerLines={false}
                    />
                )}
            </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        backgroundColor: '#fff7e6',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 12
    },
    switchButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
    },
    activeSwitch: {
        backgroundColor: '#ffa742',
    },
    switchText: {
        fontWeight: 'bold',
        fontSize: 16
    },
    chartArea: {
        width: '100%',
        alignItems: 'center',
    }
});
