// context/SettingsContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [showCompletedTasks, setShowCompletedTasks] = useState(true);
    const [showPastDueTasks, setShowPastDueTasks] = useState(true);
    const [sortField, setSortField] = useState('dueDate');
    const [sortOrderAsc, setSortOrderAsc] = useState(true);
    const [showCompletedAtBottom, setShowCompletedAtBottom] = useState(false);

    // Load persisted settings
    useEffect(() => {
        (async () => {
            try {
                const stores = await AsyncStorage.multiGet([
                    'showCompletedTasks',
                    'showPastDueTasks',
                    'sortField',
                    'sortOrderAsc',
                    'showCompletedAtBottom'
                ]);
                const prefs = Object.fromEntries(stores);
                if (prefs.showCompletedTasks != null)
                    setShowCompletedTasks(prefs.showCompletedTasks === 'true');
                if (prefs.showPastDueTasks != null)
                    setShowPastDueTasks(prefs.showPastDueTasks === 'true');
                if (prefs.sortField != null)
                    setSortField(prefs.sortField);
                if (prefs.sortOrderAsc != null)
                    setSortOrderAsc(prefs.sortOrderAsc === 'true');
                if (prefs.showCompletedAtBottom != null)
                    setShowCompletedAtBottom(prefs.showCompletedAtBottom === 'true');
            } catch (e) {
                console.error('Error loading settings', e);
            }
        })();
    }, []);

    // Persist on change
    useEffect(() => {
        AsyncStorage.setItem('showCompletedTasks', showCompletedTasks.toString());
    }, [showCompletedTasks]);
    useEffect(() => {
        AsyncStorage.setItem('showPastDueTasks', showPastDueTasks.toString());
    }, [showPastDueTasks]);
    useEffect(() => {
        AsyncStorage.setItem('sortField', sortField);
    }, [sortField]);
    useEffect(() => {
        AsyncStorage.setItem('sortOrderAsc', sortOrderAsc.toString());
    }, [sortOrderAsc]);
    useEffect(() => {
        AsyncStorage.setItem('showCompletedAtBottom', showCompletedAtBottom.toString());
    }, [showCompletedAtBottom]);

    return (
        <SettingsContext.Provider
            value={{
                showCompletedTasks,
                setShowCompletedTasks,
                showPastDueTasks,
                setShowPastDueTasks,
                sortField,
                setSortField,
                sortOrderAsc,
                setSortOrderAsc,
                showCompletedAtBottom,
                setShowCompletedAtBottom
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}
