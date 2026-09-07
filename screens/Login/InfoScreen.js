import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../Firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import {  SegmentedButtons, Surface } from 'react-native-paper';

export default function InfoScreen({ route }) {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const [userInfo, setUserInfo] = useState(null);
    const { userId } = route.params;
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('');
    const [chronic, setChronic] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUserInfo(doc.data());
                } else {
                    console.error('Error', 'No such document!');
                }
            }, (error) => {
                console.error("Error fetching user data: ", error);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const activityOptions = [
        { label: 'Little to no exercise', value: '1.2' },
        { label: 'Light exercise', value: '1.375' },
        { label: 'Moderate exercise', value: '1.55' },
        { label: 'Heavy physical exercise', value: '1.725' },
        { label: 'Very Heavy physical exercise', value: '1.9' },
    ];

    const handleBirthdateChange = (text) => {
        const formattedDate = formatDate(text);
        setBirthdate(formattedDate);
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };

    const formatDate = (date) => {
        const cleaned = date.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/);
        if (match) {
            const [, year, month, day] = match;
            return `${year}${month ? `/${month}` : ''}${day ? `/${day}` : ''}`;
        }
        return date;
    };

    const saveInfo = async () => {
        if (!height || !weight || !activityLevel) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }
    
        const parsedHeight = parseFloat(height);
        const heightInMeters = parsedHeight / 100;
        const parsedWeight = parseFloat(weight);
        const calculateAge = (birthdate) => {
            const [year, month, day] = birthdate.split('/').map(Number);
            const today = new Date();
            const birthDate = new Date(year, month - 1, day);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };
        
        if (isNaN(parsedWeight) || isNaN(parsedHeight)) {
            Alert.alert('Error', 'Invalid input values.');
            return;
        }
    
        let bmi = parsedWeight / (heightInMeters ** 2);
        let age = calculateAge(birthdate);
    
        let bmr;
        if (gender === 'Male') {
            bmr = 66 + (13.7 * parsedWeight) + (5 * parsedHeight) - (6.8 * age);
        } else {
            bmr = 665 + (9.6 * parsedWeight) + (1.8 * parsedHeight) - (4.7 * age);
        }
    
        let tdee = bmr * parseFloat(activityLevel);
        if (isNaN(tdee)) {
            Alert.alert('Error', 'Please select a valid activity level.');
            return;
        }
    
        let bodyType;
        if (bmi < 18.5) {
            bodyType = 'Underweight';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            bodyType = 'Normal';
        } else if (bmi >= 25 && bmi <= 29.9) {
            bodyType = 'Overweight';
        } else if (bmi >= 30 && bmi <= 34.9) {
            bodyType = 'Obese';
        } else {
            bodyType = 'Extremely Obese';
        }
    
        try {
            await updateDoc(doc(db, "users", userId), {
                weight: parsedWeight,
                height: parsedHeight,
                gender,
                birthdate,
                activityLevel,
                old: age,
                chronic,
                bmi: bmi.toFixed(2),
                bmr: bmr.toFixed(2),
                tdee: tdee.toFixed(2),
                body: bodyType  
            });
    
            Alert.alert('Success', 'Information updated successfully.');
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <ExpoStatusBar style="light" />
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Weight (kg)"
                            placeholderTextColor={'gray'}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Height (cm)"
                            placeholderTextColor={'gray'}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Gender</Text>
                        <SegmentedButtons
                        value={gender}
                        onValueChange={setGender}
                        buttons={[
                            { value: 'male', label: 'Male' },
                            { value: 'female', label: 'Female' },
                        ]}
                        style={styles.segmentedButton}
                    />
                    </View>
                    <View style={styles.inputContainer}>

                        <TextInput
                            placeholder="Birthdate (YYYY/MM/DD)"
                            placeholderTextColor={'gray'}
                            value={birthdate}
                            onChangeText={handleBirthdateChange}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Chronic Disease"
                            placeholderTextColor={'gray'}
                            onChangeText={setChronic}
                            keyboardType="chronic"
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Activity Level</Text>
                        <TouchableOpacity
    style={styles.input}
    onPress={() => setShowPicker(!showPicker)}
>
    <Text style={[styles.pickerText, activityLevel ? styles.selectedPickerText : styles.placeholderText]}>
        {activityLevel ? activityOptions.find(option => option.value === activityLevel).label : "Select Activity Level"}
    </Text>
</TouchableOpacity>
                        {showPicker && (
                            <Picker
    selectedValue={activityLevel}
    style={styles.picker}
    onValueChange={(itemValue) => {
        setActivityLevel(itemValue);
        setShowPicker(false);
    }}
>
    {activityOptions.map((option) => (
        <Picker.Item key={option.value} label={option.label} value={option.value} />
    ))}
</Picker>
                        )}
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={saveInfo}>
                        <Text style={styles.buttonText}>Save Info</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'space-around',
        paddingTop: 48,
    },
    form: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    inputContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 15,
        borderRadius: 20,
        width: '100%',
        marginBottom: 10,
    },
    input: {
        paddingVertical: 10,
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center', 
        marginTop: 20, 
    },
    button: {
        backgroundColor: 'rgba(127, 192, 75, 1)',
        padding: 15,
        borderRadius: 20,
        width: '80%', 
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    genderContainer: {
        flexDirection: 'row',
    },
    genderOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    selectedGender: {
        backgroundColor: 'rgba(127, 192, 75, 0.1)',
        borderRadius: 10,
    },
    genderText: {
        fontSize: 16,
        marginLeft: 10,
    },
    picker: {
        height: 40,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 20,
    },
    pickerText: {
        color: '#333',
    },
    selectedPickerText: {
        color: '#000',
    },
    placeholderText: {
        color: '#aaa',
    },
    segmentedButton: {
        marginBottom: 16,
        
        
    },
});