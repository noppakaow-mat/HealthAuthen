import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db, auth } from '../Firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const screenWidth = Dimensions.get("window").width;

export default function ExerciseChart() {
  const [exerciseData, setExerciseData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [year, setYear] = useState(''); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const bmiDocRef = doc(db, "bmi", user.uid);

      const unsubscribe = onSnapshot(bmiDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const exercises = data.exercises || [];

          
          exercises.sort((a, b) => {
            const dateB = a.day.toDate ? a.day.toDate() : new Date(a.day);
            const dateA = b.day.toDate ? b.day.toDate() : new Date(b.day);
            return dateB - dateA; 
          });

          const recentExercises = exercises.slice(0, 5); 

          const weights = [];
          const days = [];

          recentExercises.forEach(exercise => {
            if (exercise.day && exercise.weight) {
              const exerciseDay = exercise.day.toDate ? exercise.day.toDate() : new Date(exercise.day);
              weights.push(exercise.weight);

            
              const formattedDate = exerciseDay.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
              days.push(formattedDate);

             
              if (!year) {
                const exerciseYear = exerciseDay.getFullYear();
                setYear(exerciseYear);
              }
            } else {
              console.warn('Missing day or weight in exercise:', exercise);
            }
          });

          setExerciseData(weights);
          setLabels(days);
          setLoading(false);
        } else {
          console.warn("Document does not exist.");
          setLoading(false);
        }
      });

      return () => unsubscribe();
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.chartContainer}>
        <ActivityIndicator size="large" color="#e26a00" />
      </View>
    );
  }

  return (
    <View style={styles.chartContainer}>
      {exerciseData.length > 0 ? (
        <>
         
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: exerciseData,
                  strokeWidth: 2, 
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#4caf50', 
              backgroundGradientFrom: '#66bb6a',
              backgroundGradientTo: '#81c784', 
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#84cc16',
              },
            }}
            bezier
            style={styles.chart}
          />
        </>
      ) : (
        <Text>No exercise data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 20,
    borderRadius: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
});
