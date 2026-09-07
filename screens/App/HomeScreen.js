import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { useTranslation } from 'react-i18next';
import { auth, db } from "../../Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import WeightChart from "../../component/graph"
import ExChart from "../../component/graphEx"

export default function Home() {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);
  const [todayExercise, setTodayExercise] = useState({ cal: '00', hours: '00' });
  const [currentDateCal, setCurrentDateCal] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const user = auth.currentUser;
  const navigation = useNavigation();
  const [progressColor, setProgressColor] = useState("red");

  useEffect(() => {
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
<<<<<<< HEAD
      const todayDateString = today.toISOString().split('T')[0];
=======
      const todayDateString = today.toLocaleDateString("en-CA");
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a

      const userDocRef = doc(db, "users", user.uid);
      const todayExDocRef = doc(db, "todayex", user.uid);
      const userFoodDocRef = doc(db, 'UserFood', user.uid);

      const unsubscribeUser = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            setUserInfo(doc.data());
          } else {
            Alert.alert("Error", "No such document!");
          }
        },
        (error) => {
          console.error("Error fetching user data: ", error);
          Alert.alert("Error", "Failed to fetch user data.");
        }
      );

      const unsubscribeTodayEx = onSnapshot(todayExDocRef, (doc) => {
        if (doc.exists()) {
          const exercises = doc.data().exercises || [];
          const todayExerciseData = exercises.filter(ex => {
            const exerciseDay = ex.day.toDate();
            exerciseDay.setHours(0, 0, 0, 0);
            return exerciseDay.getTime() === today.getTime();
          });

          if (todayExerciseData.length > 0) {
            const totalCalories = todayExerciseData.reduce((sum, ex) => sum + parseInt(ex.cal, 10), 0);
            const totalHours = todayExerciseData
  .reduce((sum, ex) => sum + parseFloat(ex.hours), 0)
  .toFixed(2);


            setTodayExercise({ cal: totalCalories.toString(), hours: totalHours.toString() });
          } else {
            setTodayExercise({ cal: '00', hours: '00' });
          }
        } else {
          setTodayExercise({ cal: '00', hours: '00' });
        }
      }, (error) => {
        console.error("Error fetching today's exercise data: ", error);
      });

      const unsubscribeUserFood = onSnapshot(userFoodDocRef, (doc) => {
        if (doc.exists()) {
          const UserFoodData = doc.data();
          const todayFoodData = UserFoodData[todayDateString] || [];
          setCurrentDateCal(todayFoodData);
          const total = todayFoodData.reduce((sum, item) => sum + (item.mealCalories || 0), 0);
          setTotalCalories(total);
        } else {
          setCurrentDateCal([]);
          setTotalCalories(0);
        }
      }, (error) => {
        console.error("Error fetching UserFood data: ", error);
      });

      return () => {
        unsubscribeUser();
        unsubscribeTodayEx();
        unsubscribeUserFood();
      };
    }
  }, [user]);

  const remainingCalories = userInfo
    ? (
<<<<<<< HEAD
      ((userInfo.tdee ? parseInt(userInfo.tdee, 10) : 0) -
        (totalCalories ? parseInt(totalCalories, 10) : 0)) +
      (todayExercise.cal ? parseInt(todayExercise.cal, 10) : 0)
=======
      ((userInfo.tdee ? parseInt(userInfo.tdee, 10) : 0) - (totalCalories ? parseInt(totalCalories, 10) : 0)) + (todayExercise.cal ? parseInt(todayExercise.cal, 10) : 0)
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a
    ).toString()
    : '00';

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      const unsubscribeUser = onSnapshot(
        userDocRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setUserInfo(data);
<<<<<<< HEAD
            if (data.weight) {
              updateBar(data.weight);
=======
            if (data.bmi) {
              updateBar(data.bmi);
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a
            }
          } else {
            Alert.alert("Error", "No such document!");
          }
        },
        (error) => {
          console.error("Error fetching user data: ", error);
          Alert.alert("Error", "Failed to fetch user data.");
        }
      );

      return () => unsubscribeUser();
    }
  }, [user]);


<<<<<<< HEAD
  const updateBar = (weight) => {
    let color = "red";

    if (weight >= 100) {
      color = "red";
    } else if (weight >= 50 && weight <= 60) {
      color = "green";
    } else if (weight >= 40) {
      color = "yellow";
    }

    setProgressColor(color);
  };

=======
  const updateBar = (bmi) => {
    let color = "red"; 
  
    if (bmi > 35) {
      color = "red";
    } else if (bmi >= 30 && bmi <= 35) {
      color = "orange";
    } else if (bmi >= 25 && bmi < 30) {
      color = "yellow";
    } else if (bmi >= 18 && bmi < 25) {
      color = "green";
    } else if (bmi < 18) {
      color = "blue";
    }
  
    setProgressColor(color);
  };
  
>>>>>>> 4e26de28d993e34bd156752aa8762d72497c537a
  const getProgressWidth = (weight) => {
    return Math.min((weight / 100) * 100, 100) + "%";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {userInfo ? (
          <>
            <View style={styles.userInfoContainer}>
              <Card style={styles.userCard}>
                <Text style={styles.baseText}>{userInfo.name}</Text>

                <Text style={styles.secText}>{userInfo.birthdate}</Text>
                <Text style={styles.infoText}>{userInfo.weight} KG</Text>

                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: progressColor,
                        width: getProgressWidth(userInfo.weight),
                      },
                    ]}
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("BMI")}
                >
                  <Text style={styles.buttonText}>{t('startcalculate')}</Text>
                </TouchableOpacity>
              </Card>
            </View>
            <Text style={styles.sectionTitle}>{t('today')}</Text>
            <Card style={styles.circleCard}>
              <Text style={styles.circleTitle}>{t('calories')}</Text>
              <Text style={styles.circleSubtitle}>{t('remaining')}</Text>
              <View style={styles.item}>
                <Text style={styles.label}>{t('baseGoal')}</Text>
              </View>
              <Text style={styles.value}>{userInfo.tdee}</Text>
              <View style={styles.item}>
                <Text style={styles.label}>{t('food')}</Text>
              </View>
              <Text style={styles.value}>{totalCalories ? totalCalories : '00'}</Text>
              <View style={styles.item}>
                <Text style={styles.label}>{t('exercise')}</Text>
              </View>
              <Text style={styles.value}>{todayExercise.cal}</Text>
              <View style={[styles.circle, styles.circleOutline]}>
                <View style={styles.circleFill}>
                  <Text style={styles.circleText}>{remainingCalories}</Text>
                </View>
              </View>
            </Card>
            <View style={styles.cardContainer}>
              <Card style={styles.exerciseCard} onPress={() => navigation.navigate("TodayEx")}>
                <View style={styles.headerContainer}>
                  <Text style={styles.exerciseHeaderText}>{t('exercise')}</Text>
                  <Icon
                    name="plus"
                    size={24}
                    color="#333"
                    style={{ marginLeft: 10 }}
                  />
                </View>
                <View style={styles.detailsContainer}>
                  <Icon name="fire" size={24} color="#FFA500" />
                  <Text style={styles.calories}>{todayExercise.cal} cal</Text>
                  <Icon name="account-clock-outline" size={24} color="#4CAF50" />
                  <Text style={styles.duration}>{todayExercise.hours} hr</Text>
                </View>
              </Card>
            </View>
            <Text style={styles.sectionTitle}>{t('availableplans')}</Text>
            <Card
              style={styles.circleCard}
              onPress={() => navigation.navigate("Exercise")}
            >
              <Image
                source={{
                  uri: "https://img1.wsimg.com/isteam/ip/1ee0d8b5-9920-41fc-9085-856fcdd9bb65/iStock-1149241482.jpg",
                }}
                style={styles.cardImage}
              />
            </Card>
            <Text style={styles.sectionTitle}>{t('mealplans')}</Text>
            <Card
              style={styles.circleCard}
              onPress={() => navigation.navigate("Food")}
            >
              <Image
                source={{
                  uri: "https://www.andilynnfitness.com/cdn/shop/files/14-days-clean-eating-meal-plan-1200-lede-601736337d914519bb5bf8eb83540da1.jpg?v=1713741074&width=713",
                }}
                style={styles.cardImage}
              />
            </Card>
            <Text style={styles.sectionTitle}>{t('weightChart')}</Text>
            <WeightChart />
            <Text style={styles.sectionTitle}>{t('exerciseChart')}</Text>
            <ExChart />
          </>
        ) : (
          <Text style={styles.info}>{t('loadingUserInfo')}</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  userInfoContainer: {
    backgroundColor: "#50A966",
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 70,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    padding: 20,
  },
  baseText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyContainer: {
    borderColor: "#50A966",
    height: 20,
    width: 80,
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 20,
    top: 20,
  },
  historyText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  secText: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20,
    top: 20,
  },
  barContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 15,
  },
  bar: {
    width: 75,
    height: 10,
    backgroundColor: "cyan",
    borderRadius: 10,
    marginRight: 5,
  },
  barGreen: {
    width: 75,
    height: 10,
    backgroundColor: "green",
    borderRadius: 10,
    marginRight: 10,
  },
  barRed: {
    width: 75,
    height: 10,
    backgroundColor: "coral",
    borderRadius: 10,
    marginLeft: 10,
  },
  highContainer: {
    backgroundColor: "gold",
    paddingHorizontal: 25,
    paddingVertical: 1,
    borderRadius: 20,
    marginHorizontal: 1,
  },
  highText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#71AA7F",
    padding: 10,
    borderRadius: 30,
    marginHorizontal: 60,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  circleCard: {
    backgroundColor: "#FFFFFF",
    height: 190,
    width: 370,
    marginTop: 20,
    marginHorizontal: 30,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    right: 30,
    bottom: 100,
  },
  circleOutline: {
    borderWidth: 10,
    borderColor: "#99CE90",
  },
  circleFill: {
    width: 95,
    height: 95,
    borderRadius: 90,
    backgroundColor: "#4E7C29",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  circleTitle: {
    fontWeight: "bold",
    textAlign: "left",
    right: 65,
    bottom: 2,
    fontSize: 18,
    top: 2,
    marginLeft: 30,
    marginTop: 10,
  },
  circleSubtitle: {
    fontWeight: "bold",
    textAlign: "left",
    right: 65,
    bottom: 6,
    color: "grey",
    top: 2,
    fontSize: 14,
    marginLeft: 30,
  },
  cardImage: {
    height: 184,
    width: 380,
    borderRadius: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    fontSize: 18,
  },
  info: {
    textAlign: "center",
    marginTop: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    marginLeft: 160,
    bottom: 2,
    top: 10,
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 160,
    bottom: 10,
    top: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  caloriesText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  cardContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
  exerciseCard: {
    backgroundColor: "#FFFFFF",
    width: 370,
    borderRadius: 20,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  exerciseHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  calories: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  duration: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  progressBar: {
    height: "100%",
    borderRadius: 10,
  },
});