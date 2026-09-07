import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView, 
  TextInput, 
  Alert 
} from "react-native";
import { auth, db } from "../../../Firebase";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Suggest from "../../../component/suggest";
import { useTranslation } from 'react-i18next';

const TodayEx = () => {
  const { t, i18n } = useTranslation();
  const [hours, setHours] = useState("");
  const [isMinutes, setIsMinutes] = useState(false);
  const [category, setCategory] = useState(null);
  const [exerciseTypeId, setExerciseTypeId] = useState(null);
  const [exerciseType, setExerciseType] = useState(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState(null);
  const [userWeight, setUserWeight] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const [userBody, setUserBody] = useState(null);

  const categoryOptions = {
    A: t("Weight Training"),
    B: t("Stretching"),
    C: t("Cardio")
  };

  // Convert hours to minutes
  const hoursToMinutes = (hours) => {
    const numHours = parseFloat(hours);
    return isNaN(numHours) ? "" : (numHours * 60).toString();
  };

  // Convert minutes to hours
  const minutesToHours = (minutes) => {
    const numMinutes = parseFloat(minutes);
    return isNaN(numMinutes) ? "" : (numMinutes / 60).toString();
  };

  // Handle time input change
  const handleTimeChange = (value) => {
    setHours(value);
  };

  // Toggle between hours and minutes
  const toggleTimeUnit = () => {
    if (hours) {
      const newValue = isMinutes ? minutesToHours(hours) : hoursToMinutes(hours);
      setHours(newValue);
    }
    setIsMinutes(!isMinutes);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserWeight(userDocSnap.data().weight);
          setUserBody(userDocSnap.data().body);
        }
      }
    });

    if (route.params?.selectedExercise) {
      const { id, Exname, ExMet, cat } = route.params.selectedExercise;
      setCategory(Object.keys(categoryOptions).find(key => categoryOptions[key] === cat));
      setExerciseTypeId(id);
      setExerciseType({ id, Exname, ExMet });
      fetchExercisesByCategory(cat);
    }

    return () => unsubscribe();
  }, [route.params]);

  const fetchExercisesByCategory = async (categoryName) => {
    const q = query(collection(db, "exercise"), where("cat", "==", categoryName));
    const querySnapshot = await getDocs(q);
    const fetchedExercises = [];
    querySnapshot.forEach((doc) => {
      fetchedExercises.push({ id: doc.id, ...doc.data() });
    });
    setExercises(fetchedExercises);
  };
  
  const calculateCalories = (ExMET, weight, hours) => {
    const MET = parseFloat(ExMET);
    const weightKg = parseFloat(weight);
    const durationHours = parseFloat(hours);
    
    if (isNaN(MET) || isNaN(weightKg) || isNaN(durationHours)) {
      console.warn('Invalid input for calorie calculation:', { MET, weightKg, durationHours });
      return 0;
    }
    
    const calories = MET * weightKg * durationHours;
    return Math.round(calories);
  };

  const handleSubmit = async () => {
    if (!user || !exerciseType || !userWeight || !hours) {
      Alert.alert("Error", "Please ensure all fields are filled.");
      return;
    }

    // Convert to hours before calculating calories if in minutes mode
    const hoursValue = isMinutes ? minutesToHours(hours) : hours;
    const caloriesBurned = calculateCalories(exerciseType.ExMet, userWeight, hoursValue);
    
    if (caloriesBurned === 0) {
      Alert.alert("Error", "Unable to calculate calories. Please check your inputs.");
      return;
    }

    const todayExDocRef = doc(db, "todayex", user.uid);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    try {
      const docSnap = await getDoc(todayExDocRef);
      if (!docSnap.exists()) {
        await setDoc(todayExDocRef, {
          exercises: [{
            hours: hoursValue,
            type: exerciseType.Exname,
            cal: caloriesBurned,
            day: currentDate,
          }],
        });
      } else {
        let exercises = docSnap.data().exercises || [];
        exercises.push({
          hours: hoursValue,
          type: exerciseType.Exname,
          cal: caloriesBurned,
          day: currentDate,
        });
        await updateDoc(todayExDocRef, { exercises });
      }
      Alert.alert("Success", "Exercise data processed successfully!");
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error processing exercise data: ", error);
      Alert.alert("Error", "Failed to process exercise data.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="arrow-back" size={15} color="black" />
          <Text style={styles.homeButtonText}>{t("home")}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text>{t("entertoday")}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.timeInput}
            onChangeText={handleTimeChange}
            value={hours}
            placeholder={t(isMinutes ? "MinutesEx" : "HoursEx")}
            placeholderTextColor="#aaa"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.unitButton}
            onPress={toggleTimeUnit}
          >
            <Text style={styles.unitButtonText}>
              {isMinutes ? t("→Hr") : t("→Min")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerWrapper}>
          <TouchableOpacity onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
            <Text style={styles.pickerText}>
              {category ? categoryOptions[category] : t("SelectaCategory")}
            </Text>
          </TouchableOpacity>
          {showCategoryPicker && (
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setCategory(itemValue);
                setExerciseTypeId(null);
                setExerciseType(null);
                setShowCategoryPicker(false);
                fetchExercisesByCategory(categoryOptions[itemValue]);
              }}
            >
              <Picker.Item label={t("weightTraining")} value="A" />
              <Picker.Item label={t("stretching")} value="B" />
              <Picker.Item label={t("cardio")} value="C" />
            </Picker>
          )}
        </View>

        {category && exercises.length > 0 && (
          <View style={styles.pickerWrapper}>
            <TouchableOpacity onPress={() => setShowExercisePicker(!showExercisePicker)}>
              <Text style={styles.pickerText}>
                {exerciseType ? (i18n.language === 'th' && exerciseType.ExnameTH ? exerciseType.ExnameTH : exerciseType.Exname) : t("selectEx")}
              </Text>
            </TouchableOpacity>
            {showExercisePicker && (
              <Picker
                selectedValue={exerciseTypeId}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setExerciseTypeId(itemValue);
                  setExerciseType(exercises.find(exercise => exercise.id === itemValue));
                  setShowExercisePicker(false);
                }}
              >
                {exercises.map((exercise) => (
                  <Picker.Item 
                    key={exercise.id} 
                    label={i18n.language === 'th' && exercise.ExnameTH ? exercise.ExnameTH : exercise.Exname} 
                    value={exercise.id} 
                  />
                ))}
              </Picker>
            )}
          </View>
        )}

        <Button title={t("Submit")} onPress={handleSubmit} />
        {userBody && <Suggest userBody={userBody} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  timeInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: 'white',
    marginRight: 10,
  },
  unitButton: {
    backgroundColor: '#50A966',
    padding: 10,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  unitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: StatusBar.currentHeight || 30,
    paddingTop: 40,
  },
  pickerWrapper: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
  },
  picker: {
    height: 150,
    width: '100%',
    marginTop: 10,
  },
  pickerText: {
    color: '#333',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default TodayEx;