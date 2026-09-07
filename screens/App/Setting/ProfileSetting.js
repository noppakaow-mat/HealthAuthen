import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { auth, db } from '../../../Firebase';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next'; 

export default function Profile() {
    const navigation = useNavigation();
    const { t } = useTranslation(); 

    const [gender, setGender] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        birthdate: '',
        height: '',
        weight: '',
        gender: '',
    });

    const user = auth.currentUser;

    const Gender = [
        { label: t('male'), value: 'Male' },
        { label: t('female'), value: 'Female' },
    ];

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUserInfo(doc.data());
                } else {
                    Alert.alert(t('errorFetchingUserData'), t('noDocument'));
                }
            }, (error) => {
                console.error("Error fetching user data: ", error);
                Alert.alert(t('errorFetchingUserData'));
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setUserInfo({ ...userInfo, [field]: value });
    };

    const handleUpdateProfile = async () => {
        if (user) {
            try {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, userInfo);
                Alert.alert(t('profileUpdated'));
            } catch (error) {
                console.error("Error updating profile: ", error);
                Alert.alert(t('errorUpdatingProfile'));
            }
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.navHeader}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('Setting')}
                >
                    <Ionicons name="arrow-back" size={15} color="black" />
                    <Text style={styles.homeButtonText}>{t('settings')}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.headerBG}>
                <Text style={styles.headerText}>{t('profileSetting')}</Text>
            </View>
            <Text style={styles.label}>{t('name')}</Text>
            <TextInput
                style={styles.input}
                value={userInfo.name}
                onChangeText={(text) => handleInputChange('name', text)}
            />

            <Text style={styles.label}>{t('email')}</Text>
            <TextInput
                style={styles.input}
                value={userInfo.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
            />

            <Text style={styles.label}>{t('birthdate')}</Text>
            <TextInput
                style={styles.input}
                value={userInfo.birthdate}
                onChangeText={(text) => handleInputChange('birthdate', text)}
                placeholder="YYYY-MM-DD"
            />

            <Text style={styles.label}>{t('height')}</Text>
            <TextInput
                style={styles.input}
                value={userInfo.height}
                onChangeText={(text) => handleInputChange('height', text)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>{t('weight')}</Text>
            <TextInput
                style={styles.input}
                value={userInfo.weight}
                onChangeText={(text) => handleInputChange('weight', text)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>{t('gender')}</Text>
            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowPicker(!showPicker)}
            >
                <Text style={[styles.pickerText, gender ? styles.selectedPickerText : styles.placeholderText]}>
                    {gender || t('selectGender')}
                </Text>
            </TouchableOpacity>
            {showPicker && (
                <View style={styles.pickerContainer}>
                    {Gender.map((option) => (
                        <TouchableOpacity key={option.value} onPress={() => {
                            setGender(option.value);
                            setUserInfo({ ...userInfo, gender: option.value });
                            setShowPicker(false);
                        }}>
                            <Text style={styles.pickerOption}>{option.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
                <Text style={styles.buttonText}>{t('saveChanges')}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#4A9B5D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 30,
    },
    headerBG: {
        backgroundColor: '#4A9B5D',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 30,
        width: '100%',
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
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
        paddingHorizontal: 0, 
        paddingVertical: 10, 
    },
    pickerContainer: {
        position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    zIndex: 10, 
    elevation: 5, 
    },
    pickerOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
<<<<<<< HEAD
});
=======
});
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a
