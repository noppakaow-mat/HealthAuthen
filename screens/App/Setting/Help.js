import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Setting() {
    const navigation = useNavigation();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navHeader}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={15} color="black" />
                    <Text style={styles.homeButtonText}>{t('profile')}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBG}>
                <Text style={styles.headerText}>{t('helps')}</Text>
            </View>

            <View style={styles.BG}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuText}>{t('aboutUs')}</Text>
                    <Icon
                        name="chevron-forward-outline"
                        size={24}
                        color="#000000"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.BG}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuText}>{t('contactSupport')}</Text>
                    <Icon
                        name="chevron-forward-outline"
                        size={24}
                        color="#000000"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.BG}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuText}>{t('termsofService')}</Text>
                    <Icon
                        name="chevron-forward-outline"
                        size={24}
                        color="#000000"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.BG}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuText}>{t('troubleshooting')}</Text>
                    <Icon
                        name="chevron-forward-outline"
                        size={24}
                        color="#000000"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.BG}>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.menuText}>{t('serviceStatus')}</Text>
                    <Icon
                        name="chevron-forward-outline"
                        size={24}
                        color="#000000"
                        style={{ marginLeft: 'auto' }}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F0F0',
        paddingTop: 20
    },
    headerText: {
        color: '#387647',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    },
    headerBG: {
        backgroundColor: '#FFFFFF',
        marginBottom: 30,
        width: '100%',
        height: '18%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuText: {
        marginLeft: 20,
        fontSize: 16,
        color: '#333',
        fontWeight: '400'
    },
    BG: {
        backgroundColor: '#8BBC97',
        marginBottom: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    homeButton: {
        borderColor: "#50A966",
        height: 20,
        width: 80,
        borderRadius: 10,
        borderWidth: 2,
        marginVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',

    },
    homeButtonText: {
        fontSize: 12,
        marginLeft: 8,
        fontWeight: 'bold',
    },
    navHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
    },
<<<<<<< HEAD
});
=======
});
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a
