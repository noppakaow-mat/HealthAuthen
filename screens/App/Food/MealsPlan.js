import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../../Firebase';
import { Ionicons } from '@expo/vector-icons';
import { doc, onSnapshot, updateDoc, arrayUnion, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

export default function MealsPlan({ navigation }) {
    const { t, i18n } = useTranslation();
    const user = auth.currentUser;
    const [mealPlan, setMealPlan] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [currentDateCal, setCurrentDateCal] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalUserFoodCalories, settotalUserFoodCalories] = useState(0);

    useEffect(() => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    setUserInfo(doc.data());
                } else {
                    Alert.alert(t('error'), t('noSuchDocument'));
                }
            }, (error) => {
                console.error("Error fetching user data: ", error);
                Alert.alert(t('error'), t('failedToFetchUserData'));
            });

            return () => unsubscribe();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const unsubscribe = onSnapshot(doc(db, 'mealPlans', user.uid), (doc) => {
                if (doc.exists()) {
                    const mealPlanData = doc.data();
                    setMealPlan(mealPlanData.foodItems || []);
                    const total = (mealPlanData.foodItems || []).reduce((sum, item) => sum + (item.cal || 0), 0);
                    setTotalCalories(total);
                } else {
                    setMealPlan([]);
                    setTotalCalories(0);
                }
            });
            return () => unsubscribe();
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const currentDate = new Date().toISOString().split('T')[0];

            const unsubscribe = onSnapshot(doc(db, 'UserFood', user.uid), (doc) => {
                if (doc.exists()) {
                    const UserFoodData = doc.data();
                    const todayFoodData = UserFoodData[currentDate] || [];

                    const totalMealCalories = todayFoodData.reduce((sum, item) => {
                        if (item.mealCalories) {
                            return sum + item.mealCalories;
                        }
                        return sum;
                    }, 0);

                    settotalUserFoodCalories(totalMealCalories);
                    setCurrentDateCal(todayFoodData);

                } else {
                    setCurrentDateCal([]);
                    settotalUserFoodCalories(0);
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    const UpdateUserMeal = async (food) => {
        const userMealPlanDoc = doc(db, 'users', user.uid);
        const userFoodDoc = doc(db, 'UserFood', user.uid);

        try {
            const docSnapshot = await getDoc(userMealPlanDoc);
            const userFoodSnapshot = await getDoc(userFoodDoc);
            const currentDate = new Date().toISOString().split('T')[0];
            const userTDEE = userInfo?.tdee || 0;

            if (food == 0) {
                Alert.alert(t('warning'), t('pleaseAddFood'));
                return;
            }

            console.log(food);
            if (totalUserFoodCalories + totalCalories > userTDEE) {
                Alert.alert(t('warning'), t('caloriesExceedIntake'));
                return;
            }
            if (docSnapshot.exists()) {
                if (userFoodSnapshot.exists()) {
                    const userFoodData = userFoodSnapshot.data();
                    const todayFood = userFoodData[currentDate] || [];

                    await updateDoc(userFoodDoc, {
                        [currentDate]: arrayUnion({ mealCalories: food, time: new Date().toISOString() }),
                    });
                } else {
                    await setDoc(userFoodDoc, {
                        [currentDate]: [{ mealCalories: food, time: new Date().toISOString() }],
                    });
                }
                setTimeout(async () => {
                    await DeleteCurrentMealPlan();
                    navigation.goBack();
                }, 2000);

                alert(t('addedToMealPlan'));
            } else {
                await setDoc(userMealPlanDoc, {
                    food: totalCalories,
                    lastUpdated: currentDate
                });
                await setDoc(userFoodDoc, {
                    food: mealPlan,
                    date: currentDate,
                });
                alert(t('addedToMealPlan'));
            }
        } catch (error) {
            console.error("Error updating meal plan: ", error);
            alert(t('failedToAddFood'));
        }
    };

    const deleteFoodItem = async (foodItemId) => {
        const mealPlanDoc = doc(db, 'mealPlans', user.uid);

        try {
            const docSnapshot = await getDoc(mealPlanDoc);
            if (docSnapshot.exists()) {
                const mealPlanData = docSnapshot.data();
                const updatedFoodItems = mealPlanData.foodItems.filter(item => item.id !== foodItemId);
                await updateDoc(mealPlanDoc, {
                    foodItems: updatedFoodItems
                });

                setMealPlan(updatedFoodItems);
                const total = updatedFoodItems.reduce((sum, item) => sum + (item.cal || 0), 0);
                setTotalCalories(total);
            }
        } catch (error) {
            console.error("Error deleting food item: ", error);
            alert(t('failedToDeleteFood'));
        }
    };

    const PressSaveMealCal = async (food) => {
        await UpdateUserMeal(food);
    };

    const DeleteCurrentMealPlan = async () => {
        const mealPlanDoc = doc(db, 'mealPlans', user.uid);

        try {
            const docSnapshot = await getDoc(mealPlanDoc);
            if (docSnapshot.exists()) {
                await deleteDoc(mealPlanDoc);
            }
        } catch (error) {
            console.error("Error deleting meal plan: ", error);
            alert(t('failedToDeleteMealPlan'));
        }
    };

    const getFoodName = (item) => {
        return i18n.language === 'th' && item.fnameTH ? item.fnameTH : item.fname;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TouchableOpacity
                    style={styles.ButtonText}
                    onPress={() => navigation.navigate('Food')}
                >
                    <Ionicons name="arrow-back" size={15} color="black" />
                    <Text style={styles.homeButtonText}>{t('FoodList')}</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.headerGreenText}>{t('meal')}</Text>
                    <Text style={styles.headerBlackText}>{t('Food')}</Text>
                </View>

                {Array.isArray(mealPlan) && mealPlan.length > 0 ? (
                    mealPlan.map((item, index) => (
                        <View key={item.id || index} style={styles.cardContainer}>
                            <View style={styles.Foodcard}>
                                <View style={styles.topRow}>
                                    <Image source={{ uri: item.picUrl }} style={styles.cardImage} />
                                    <Text style={styles.cardText}>{getFoodName(item)}</Text>
                                </View>
                                <Text style={styles.calText}>{item.cal} {t('calories')}</Text>
                                <TouchableOpacity onPress={() => deleteFoodItem(item.id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>{t('delete')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noMealsText}></Text>
                )}

                <View style={styles.calculateCal}>
                    <View style={{ marginTop: 15, marginBottom: 15 }}>
                        {Array.isArray(mealPlan) && mealPlan.length > 0 ? (
                            <>
                                {mealPlan.map((item, index) => (
                                    <View key={item.id || index} style={styles.CalcardContainer}>
                                        <View style={styles.CalRow}>
                                            <Text style={styles.itemName}>{getFoodName(item)}</Text>

                                            <Text style={styles.itemCalories}>{item.cal} {t('calories')}</Text>
                                        </View>
                                    </View>
                                ))}
                                <Text style={styles.totalCaloriesText}>{t('total')} : {totalCalories} {t('calories')}</Text>
                            </>
                        ) : (
                            <Text>{t('noItemsFound')}</Text>
                        )}
                    </View>
                </View>
                <View style={{ margin: 20 }}>
                    <TouchableOpacity style={styles.button} onPress={() => PressSaveMealCal(totalCalories)}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', color: 'white', fontSize: 17 }}>{t('addToMeal')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    scrollViewContent: {
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    ButtonText: {
        borderColor: "#50A966",
        height: 20,
        width: 90,
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerGreenText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#4A9B5D',
        marginRight: 10,
    },
    headerBlackText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'black',
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    Foodcard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        width: '90%',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10,
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    calText: {
        fontSize: 16,
        color: 'gray',
    },
    deleteButton: {
        backgroundColor: '#FF4C4C',
        borderRadius: 5,
        padding: 5,
        alignItems: 'center',
        marginTop: 10,
        width: '30%',
        alignSelf: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    calculateCal: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    totalCaloriesText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#4A9B5D',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    CalRow: {
        justifyContent: 'center',
        alignContent: 'center'
    },
    CalcardContainer: {
        justifyContent: 'center',
        alignContent: 'center'
    }
});