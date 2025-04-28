// hooks/useClasses.js
import { useState, useCallback, useContext } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { UserContext } from '../context/UserContext';

export function useClasses() {
    const { userId } = useContext(UserContext);
    const [classes, setClasses] = useState([]);

    useFocusEffect(
        useCallback(() => {
            if (!userId) return;
            api.get('/api/classes/owner', { headers: { userId } })
                .then(res => setClasses(res.data))
                .catch(console.error);
        }, [userId])
    );

    return classes;
}
