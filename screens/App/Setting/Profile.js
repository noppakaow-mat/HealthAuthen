import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../../../Firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { signOut } from 'firebase/auth';
import ToggleSwitch from 'toggle-switch-react-native';

export default function Profile() {
    const { t, i18n } = useTranslation();
    const [userInfo, setUserInfo] = useState(null);
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
    const user = auth.currentUser;
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const unsubscribe = onSnapshot(
                userDocRef,
                (doc) => {
                    if (doc.exists()) {
                        setUserInfo(doc.data());
                    } else {
                        Alert.alert('Error', 'No such document!');
                    }
                },
                (error) => {
                    console.error('Error fetching user data: ', error);
                    Alert.alert('Error', 'Failed to fetch user data.');
                }
            );

            return () => unsubscribe();
        }
    }, [user]);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigation.replace('Login');
            })
            .catch((error) => {
                Alert.alert('Error', error.message);
            });
    };

    const changeLanguage = (isEnabled) => {
        const newLanguage = isEnabled ? 'th' : 'en';
        i18n.changeLanguage(newLanguage);
        setCurrentLanguage(newLanguage);
        global.currentLanguage = newLanguage;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                {userInfo ? (
                    <>
                        <Text style={styles.headerText}>{t('profile')}</Text>
                        <View style={styles.profileSection}>
                            <Image
                                source={
                                    userInfo.gender === 'Female'
                                        ? require('./../../../assets/female.png')
                                        : require('./../../../assets/male.png')
                                }
                                style={styles.profileImage}
                            />
                            <Text style={styles.nameText}>{userInfo.name}</Text>
                            <Text style={styles.infoText}>{userInfo.phoneNumber}</Text>
                            <Text style={styles.infoText}>{userInfo.email}</Text>
                        </View>
                        <View style={styles.menuSection}>
                            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Privacy')}>
                                <Icon name="lock-closed-outline" size={24} color="#ff8c00"/>
                                <Text style={styles.menuText}>{t('privacyCenter')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Setting')}>
                                <Icon name="settings-outline" size={24} color="#ff8c00" />
                                <Text style={styles.menuText}>{t('settings')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Help')}>
                                <Icon name="help-circle-outline" size={24} color="#ff8c00" />
                                <Text style={styles.menuText}>{t('helps')}</Text>
                            </TouchableOpacity>

<<<<<<< HEAD
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Icon name="log-out-outline" size={24} color="#ff8c00" />
                                <Text style={styles.menuText}>{t('logout')}</Text>
                            </TouchableOpacity>
=======

>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a

                            <View style={styles.menuItem}>
                                <Icon name="language-outline" size={24} color="#ff8c00" />
                                <Text style={styles.menuText}>EN </Text>
                                <ToggleSwitch
                                    isOn={currentLanguage === 'th'}
                                    onToggle={changeLanguage}
                                    offColor="#ccc"
                                    onColor="#4A9B5D"
                                    size="medium"
                                />
                                <Text style={styles.switchLabel}> TH</Text>
                            </View>
<<<<<<< HEAD
=======
                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Icon name="log-out-outline" size={24} color="#ff8c00" />
                                <Text style={styles.menuText}>{t('logout')}</Text>
                            </TouchableOpacity>
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a
                        </View>
                    </>
                ) : (
                    <Text>{t('loading')}</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30, // Adds padding for smoother scrolling
    },
    headerText: {
        color: '#4A9B5D',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        marginVertical: 30,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
    },
    menuSection: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 20,
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
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
        marginHorizontal: 5,
    },
});