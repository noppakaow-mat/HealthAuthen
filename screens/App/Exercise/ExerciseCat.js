import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function ExerciseCat() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const { t, i18n } = useTranslation();

  
  const categoryTranslations = {
    'Weight Training': 'เวทเทรนนิ่ง',
    'Stretching': 'การยืดกล้ามเนื้อ',
    'Cardio': 'คาร์ดิโอ'
  };

  
  const localizedCategory = i18n.language === 'th' ? categoryTranslations[category] || category : category;

  const fetchExercises = useCallback(async () => {
  
    setLoading(true);

    const q = query(collection(db, 'exercise'), where('cat', '==', category));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No exercises found for this category');
    } else {
      const fetchedExercises = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          Exname: i18n.language === 'th' ? data.ExnameTH || data.Exname : data.Exname,
          IEx: i18n.language === 'th' ? data.IExTH || data.IEx : data.IEx,
        };
      });
      setExercises(fetchedExercises);
    }
    setLoading(false);
  }, [category, i18n.language]);

  useEffect(() => {
    
    fetchExercises();
  }, [i18n.language, fetchExercises]);

  useFocusEffect(
    useCallback(() => {
     
      fetchExercises();
    }, [fetchExercises])
  );

  const renderExercise = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => navigation.navigate('ExerciseInfo', { 
        Exname: item.Exname,
        IEx: item.IEx,
        picUrl: item.picUrl,
        cat: item.cat 
      })}
    >
      <View>
        <Image source={{ uri: item.picUrl }} style={styles.exerciseImage} />
        <View style={styles.textOverlay}>
          <Text style={styles.exerciseName}>{item.Exname}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Exercise')}
        >
          <Ionicons name="arrow-back" size={15} color="black" />
          <Text style={styles.homeButtonText}>{t('exercise')}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>{localizedCategory}</Text>

      {exercises.length > 0 ? (
        <FlatList
          data={exercises}
          renderItem={renderExercise}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
        />
      ) : (
        <Text style={styles.noExercisesText}>{t('noExercisesAvailable')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(0, 128, 0, 0.7)',
    textAlign: 'left',
    marginBottom: 20,
  },
  grid: {
    justifyContent: 'space-between',
  },
  exerciseCard: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 128, 0, 0.4)',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
  noExercisesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: 'rgba(0, 0, 0, 0.5)',
  },
});
