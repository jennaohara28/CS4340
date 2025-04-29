import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Logo from '../assets/images/logo.png';

export default function AppHeader() {
    return (
        <View style={styles.header}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingTop: 135,
        backgroundColor: '#dfe9fd',
    },
    logo: {
        width: '100%',
        height: 190,
        alignSelf: 'center'
    },
});
