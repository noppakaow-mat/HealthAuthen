import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from '../../Firebase';
import { Picker } from '@react-native-picker/picker'; 

const db = getFirestore(app);
const auth = getAuth(app);

const AdminFood = ({ navigation }) => {
  const [fname, setFname] = useState('');
  const [infood, setInfood] = useState('');
  const [ifood, setIfood] = useState('');
  const [cal, setCal] = useState('');
  const [cat, setCat] = useState('');
  const [picUrl, setpicUrl] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const clearFields = () => {
    setpicUrl('');
    setFname('');
    setIfood('');
    setInfood('');
    setCal('');
    setCat('');
  };

  const validateFields = () => {
    return fname && ifood && cal && cat && picUrl;
  };

  const addDataToFirestore = async () => {
    if (!validateFields()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "food"), {
        picUrl: picUrl,
        fname: fname,
        ifood: ifood,
        infood: infood,
        cal: cal,
        cat: cat,
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
        <Text style={styles.title}>Add a New Food Item</Text>
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
          onChangeText={setFname}
          value={fname}
          placeholder="Enter Food Name"
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={[styles.input, { height: 100 }]}
          onChangeText={setInfood}
          value={infood}
          placeholder="Enter Food Information"
          placeholderTextColor="#aaa"
          multiline={true}
          textAlignVertical="top"
        />
        <TextInput
       style={[styles.input, { height: 100 }]}
          onChangeText={setIfood}
          value={ifood}
          placeholder="Enter Ingredients"
          placeholderTextColor="#aaa"
          multiline={true}
          textAlignVertical="top"
        />
        <TextInput
          style={styles.input}
          onChangeText={setCal}
          value={cal}
          placeholder="Enter Calories"
          placeholderTextColor="#aaa"
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
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Drink" value="Drink" />
              <Picker.Item label="Snacks" value="Snacks" />
              <Picker.Item label="Bakery" value="Bakery" />
              <Picker.Item label="Cake" value="Cake" />
              <Picker.Item label="Seafood" value="Seafood" />
              <Picker.Item label="Vegetable" value="Vegetable" />
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

export default AdminFood;