import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextInput, View, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../../Firebase';
import { doc, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

export default function InfoScreen({ route }) {
    const navigation = useNavigation();
    const user = auth.currentUser;
    const { t } = useTranslation(); 
    const [userInfo, setUserInfo] = useState(null);

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
        { label: t('littleToNoExercisez'), value: '1.2' },
        { label: t('lightExercise'), value: '1.375' },
        { label: t('moderateExercise'), value: '1.55' },
        { label: t('heavyExercise'), value: '1.725' },
        { label: t('veryHeavyExercise'), value: '1.9' },
    ];

    const calculateBMIBMR = async () => {
        if (!height || !weight || !activityLevel) {
            Alert.alert(t('error'), t('pleaseFilllAllFields'));
            return;
        }
    
        const parsedHeight = parseFloat(height);
        const heightInMeters = parsedHeight / 100;
        const parsedWeight = parseFloat(weight);
        const parsedActivityLevel = parseFloat(activityLevel);
    
        if (isNaN(parsedWeight) || isNaN(parsedHeight) || isNaN(parsedActivityLevel)) {
            Alert.alert(t('error'), t('invalidInputValues'));
            return;
        }
    
        let bmi = parsedWeight / (heightInMeters ** 2);
    
        const currentDate = new Date();
        const birthDate = new Date(userInfo.birthdate.replace(/\//g, '-'));
        console.log("Birthdate from userInfo:", userInfo.birthdate);
        console.log("Parsed birthdate:", birthDate);
    
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        if (currentDate < new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
            age--; 
        }
        console.log("Age:", age);
    
        let bmr;
        if (gender === 'Male') {
            bmr = 66 + (13.7 * parsedWeight) + (5 * parsedHeight) - (6.8 * age);
        } else {
            bmr = 665 + (9.6 * parsedWeight) + (1.8 * parsedHeight) - (4.7 * age);
        }
    
        let tdee = bmr * parsedActivityLevel;

        console.log(bmr);
        console.log(tdee);
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
            await updateDoc(doc(db, "users", user.uid), {
                weight: parsedWeight,
                height: parsedHeight,
                bmi: bmi.toFixed(2),
                bmr: bmr.toFixed(2),
                tdee: tdee.toFixed(2),
                bodyType,
                chronic,
            });

            const amiDocRef = doc(db, "bmi", user.uid);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            
            const docSnap = await getDoc(amiDocRef);
            
            if (!docSnap.exists()) {
              await setDoc(amiDocRef, {
                exercises: [{
                  weight: parsedWeight,
                  height: parsedHeight,
                  day: currentDate,
                }],
              });
            } else {
              const existingData = docSnap.data().exercises || [];
            
              const existingIndex = existingData.findIndex(exercise => {
                const exerciseDay = exercise.day.toDate ? exercise.day.toDate() : new Date(exercise.day);
                exerciseDay.setHours(0, 0, 0, 0);
                return exerciseDay.getTime() === currentDate.getTime();
              });
            
              if (existingIndex !== -1) {
                existingData[existingIndex].weight = parsedWeight;
                existingData[existingIndex].height = parsedHeight;
              } else {
                existingData.push({
                  weight: parsedWeight,
                  height: parsedHeight,
                  day: currentDate,
                });
              }
            
              await updateDoc(amiDocRef, { exercises: existingData });
            }
        
            alert(t('dataProcessedSuccessfully'));
          } catch (error) {
            console.error("Error processing weight and height data: ", error);
            alert(t('failedToProcessData'));
          }
        };
        
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{ marginTop: Constants.statusBarHeight }}>
                <Text style={styles.bmiText}>{t('BMI')}</Text>

                <View style={styles.card}>
                    <TextInput
                        placeholder={t('height')}
                        style={styles.textBox}
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                    />
                    <Text style={styles.unitText}>{t('cm')}</Text>
                </View>

                <View style={styles.card}>
                    <TextInput
                        placeholder={t('weight')}
                        style={styles.textBox}
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />
                    <Text style={styles.unitText}>{t('kg')}</Text>
                </View>

                <View style={styles.pickerView}>
                    <Picker
                        selectedValue={activityLevel}
                        onValueChange={(itemValue) => setActivityLevel(itemValue)}
                        style={styles.picker}
                    >
                        {activityOptions.map((option) => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={calculateBMIBMR}>
                    <Text style={styles.buttonText}>{t('calculate')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    bmiText: {
        color: '#2F855A', 
        fontWeight: 'bold',
        fontSize: 36, 
        textAlign: 'center', 
        marginBottom: 30,
    },
    card: {
        height: 135, 
        marginHorizontal: 40,
        marginVertical: 10, 
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15, 
        padding: 20,
        elevation: 6, 
        shadowColor: '#171717', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.15, 
        shadowRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textBox: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: 34,
        textAlign: 'center',
        color: '#333333', 
    },
    unitText: {
        fontWeight: '600', 
        fontSize: 22,
        color: '#2F855A', 
    },
    button: {
        height: 55, 
        backgroundColor: '#38A169', 
        marginHorizontal: 40,
        borderRadius: 30, 
        justifyContent: 'center',
        marginTop: 25, 
        shadowColor: '#2F855A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3, 
    },
    buttonText: {
        fontWeight: '600', 
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        letterSpacing: 1, 
    },
    pickerView: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0', 
        overflow: 'hidden',
        height: 55, 
        marginHorizontal: 40,
        backgroundColor: '#2F855A', 
        justifyContent: 'center',
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    picker: {
        color: '#FFFFFF', 
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
});