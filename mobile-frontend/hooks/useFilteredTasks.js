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
        sortOrderAsc
    } = useContext(SettingsContext);

    const [tasks, setTasks] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (!userId) return;

            api.get(`/api/tasks/owner/${userId}`)
                .then(res => {
                    let t = res.data;

                    // filter out completed tasks
                    if (!showCompletedTasks) {
                        t = t.filter(task => task.status !== 'Done');
                    }
                    // filter out past-due tasks
                    if (!showPastDueTasks) {
                        const today = new Date().setHours(0,0,0,0);
                        t = t.filter(task => !task.dueDate || new Date(task.dueDate) >= today);
                    }

                    // dynamic sort by selected field
                    t.sort((a, b) => {
                        let aVal = a[sortField];
                        let bVal = b[sortField];

                        // handle dueDate as Date objects
                        if (sortField === 'dueDate') {
                            if (!aVal) return 1;
                            if (!bVal) return -1;
                            aVal = new Date(aVal);
                            bVal = new Date(bVal);
                        }
                        // numeric fields
                        else if (['timeAll', 'priority', 'classId'].includes(sortField)) {
                            aVal = Number(aVal) || 0;
                            bVal = Number(bVal) || 0;
                        }
                        // strings (type, status)
                        else {
                            aVal = (aVal || '').toString().toLowerCase();
                            bVal = (bVal || '').toString().toLowerCase();
                        }

                        if (aVal < bVal) return sortOrderAsc ? -1 : 1;
                        if (aVal > bVal) return sortOrderAsc ? 1 : -1;
                        return 0;
                    });

                    setTasks(t);
                })
                .catch(console.error);
        }, [
            userId,
            showCompletedTasks,
            showPastDueTasks,
            sortField,
            sortOrderAsc
        ])
    );

    return tasks;
}
