import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from '../../Firebase';
import { Picker } from '@react-native-picker/picker'; 

const db = getFirestore(app);
const auth = getAuth(app);

const AdminExercise = ({ navigation }) => {
  const [Exname, setExname] = useState('');
  const [IEx, setIEx] = useState('');
  const [cat, setCat] = useState('');
  const [Exbody, setExbody] = useState('');
  const [ExMet, setExMet] = useState('');
  const [picUrl, setpicUrl] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [showPickers, setShowPickers] = useState(false);

  const clearFields = () => {
    setpicUrl('');
    setExname('');
    setIEx('');
    setCat('');
    setExbody('');
    setExMet('');
  };

  const validateFields = () => {
    return ExMet && Exname && IEx && cat && picUrl && Exbody;
  };

  const addDataToFirestore = async () => {
    if (!validateFields()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "exerciseTH"), {
        picUrl: picUrl,
        Exname: Exname,
        IEx: IEx,
        cat: cat,
        Exbody: Exbody,
        ExMet: ExMet,
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert("Success", `Document successfully created with ID: ${docRef.id}`);
      clearFields();
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Error adding document: " + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add a New Exercise</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setpicUrl}
          value={picUrl}
          placeholder="Enter Picture Url"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setExMet}
          value={ExMet}
          placeholder="Enter Ex Met"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          onChangeText={setExname}
          value={Exname}
          placeholder="Enter Exercise Name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          onChangeText={setIEx}
          value={IEx}
          placeholder="Enter Exercise Information"
          placeholderTextColor="#aaa"
          multiline={true}
          textAlignVertical="top"
        />
        
        <View style={styles.pickerWrapper}>
          <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
            <Text style={[styles.pickerText, cat ? styles.selectedPickerText : styles.placeholderText]}>
              {cat ? cat : "Select Category"}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <Picker
              selectedValue={cat}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setCat(itemValue);
                setShowPicker(false);
              }}
            >
              <Picker.Item label="Weight Training" value="Weight Training" />
              <Picker.Item label="Stretching" value="Stretching" />
              <Picker.Item label="Cardio" value="Cardio" />
            </Picker>
          )}
        </View>

        <View style={styles.pickerWrapper}>
          <TouchableOpacity onPress={() => setShowPickers(!showPickers)}>
            <Text style={[styles.pickerText, Exbody ? styles.selectedPickerText : styles.placeholderText]}>
              {Exbody ? Exbody : "Body Type"}
            </Text>
          </TouchableOpacity>
          {showPickers && (
            <Picker
              selectedValue={Exbody}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setExbody(itemValue);
                setShowPickers(false);
              }}
            >
              <Picker.Item label="Underweight" value="Underweight" />
              <Picker.Item label="Normal" value="Normal" />
              <Picker.Item label="Overweight" value="Overweight" />
              <Picker.Item label="Obese" value="Obese" />
              <Picker.Item label="Extremely Obese" value="Extremely Obese" />
            </Picker>
          )}
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={addDataToFirestore}
        >
          <Text style={styles.saveButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    marginTop: StatusBar.currentHeight || 0,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '90%',
  },
  pickerWrapper: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '90%',
  },
  picker: {
    height: 150,
    width: '100%',
    marginTop: 10,
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
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminExercise;