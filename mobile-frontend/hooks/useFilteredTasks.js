// hooks/useFilteredTasks.js
import { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { UserContext } from '../context/UserContext';
import { SettingsContext } from '../context/SettingsContext';

export function useFilteredTasks() {
    const { userId } = useContext(UserContext);
    const {
        showCompletedTasks,
        showPastDueTasks,
        sortField,
        sortOrderAsc,
        showCompletedAtBottom
    } = useContext(SettingsContext);

    const [tasks, setTasks] = useState([]);

    const fetchTasks = useCallback(() => {
        if (!userId) return;

        api.get(`/api/tasks/owner/${userId}`)
            .then(res => {
                let t = res.data;

                if (!showCompletedTasks) {
                    t = t.filter(task => task.status !== 'Done');
                }

                if (!showPastDueTasks) {
                    const today = new Date().setHours(0, 0, 0, 0);
                    t = t.filter(task => !task.dueDate || new Date(task.dueDate) >= today);
                }

                t.sort((a, b) => {
                    let aVal = a[sortField];
                    let bVal = b[sortField];

                    if (sortField === 'dueDate') {
                        if (!aVal) return 1;
                        if (!bVal) return -1;
                        aVal = new Date(aVal);
                        bVal = new Date(bVal);
                    } else if (['timeAll', 'priority', 'classId'].includes(sortField)) {
                        aVal = Number(aVal) || 0;
                        bVal = Number(bVal) || 0;
                    } else {
                        aVal = (aVal || '').toString().toLowerCase();
                        bVal = (bVal || '').toString().toLowerCase();
                    }

                    if (aVal < bVal) return sortOrderAsc ? -1 : 1;
                    if (aVal > bVal) return sortOrderAsc ? 1 : -1;
                    return 0;
                });

                if (showCompletedTasks && showCompletedAtBottom) {
                    const incomplete = t.filter(task => task.status !== 'Done');
                    const complete   = t.filter(task => task.status === 'Done');
                    t = [...incomplete, ...complete];
                }

                setTasks(t);
            })
            .catch(console.error);
    }, [
        userId,
        showCompletedTasks,
        showPastDueTasks,
        sortField,
        sortOrderAsc,
        showCompletedAtBottom
    ]);

    // Run once when the screen comes into focus,
    // and again only when fetchTasks’ dependencies change.
    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [fetchTasks])
    );

    return [tasks, fetchTasks];
}
