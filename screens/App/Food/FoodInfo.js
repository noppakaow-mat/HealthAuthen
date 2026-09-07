import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../../Firebase';
import { Card } from 'react-native-paper';
import { collection, getDoc, query, where, arrayUnion, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function FoodDetails() {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { fname } = route.params;
    const user = auth.currentUser;
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const getFoodData = async () => {
            setLoading(true);
            try {
                const foodCollection = collection(db, 'food');
                const fnameQuery = query(foodCollection, where('fname', '==', fname));
                const querySnapshot = await getDocs(fnameQuery);
                const fetchResult = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setFoodItems(fetchResult);
            } catch (error) {
                console.error("Error fetching food data: ", error);
                alert('Failed to fetch food data.');
            } finally {
                setLoading(false);
            }
        };

        getFoodData();
    }, [fname]);

    const updateMeal = async (food) => {
        const userMealPlanDoc = doc(db, 'mealPlans', user.uid);
        try {
            const docSnapshot = await getDoc(userMealPlanDoc);
            if (docSnapshot.exists()) {
                await updateDoc(userMealPlanDoc, {
                    foodItems: arrayUnion(food)
                });
            } else {
                await setDoc(userMealPlanDoc, {
                    foodItems: [food]
                });
            }
            alert('Added to your meal plan!');
        } catch (error) {
            console.error("Error updating meal plan: ", error);
            alert('Failed to add food item to your meal plan.');
        }
    };

    const pressAdd = async (food) => {
        await updateMeal(food);
        navigation.navigate('Food');
    };

    const displayFname = (food) => i18n.language === 'th' && food.fnameTH ? food.fnameTH : food.fname;
    const displayIfood = (food) => i18n.language === 'th' && food.ifoodTH ? food.ifoodTH : food.ifood;

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('Food')}
                >
                    <Ionicons name="arrow-back" size={15} color="black" />
                    <Text style={styles.homeButtonText}>{t('FoodList')}</Text>
                </TouchableOpacity>

                {foodItems.map((food) => (
                    <View key={food.id} style={styles.foodContainer}>
                        <View style={styles.fname}>
                            <Text style={styles.foodName}>
                                {displayFname(food)}
                            </Text>
                        </View>
                        <Card style={styles.cardOutside}>
                            <View style={styles.cardContent}>
                                <Image source={{ uri: food.picUrl }} style={styles.foodImage} />
                                <Card style={styles.cardInside}>
                                    <Text style={styles.ingredientText}>{t('Ingredient')}</Text>
                                    <Text style={styles.ingredientDetails}>
                                        {displayIfood(food)}
                                    </Text>

                                    <View style={styles.calorieContainer}>
                                        <Text style={styles.calorieCount}>{food.cal}</Text>
                                        <Text style={styles.calorieLabel}>{t('Calorie')}</Text>
                                    </View>
                                </Card>

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={() => pressAdd(food)}>
                                        <Text style={styles.buttonText}>{t('Addtomeal')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    foodContainer: {
        alignItems: 'center',
    },
    cardOutside: {
        height: 630,
        width: 350,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
    },
    cardInside: {
        height: 295,
        width: 270,
        backgroundColor: '#F0F0F0',
        padding: 10,
        borderRadius: 18,
        alignItems: 'center',
    },
    buttonContainer: {
        margin: 20,
    },
    button: {
        height: 50,
        width: 115,
        backgroundColor: '#387647',
        borderRadius: 50,
        justifyContent: 'center',
        marginTop: 5,
    },
    fname: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4A9B5D',
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        width: 151,
        height: 40,
        marginRight: '35%',
    },
    homeButton: {
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
    foodName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    cardContent: {
        alignItems: 'center',
    },
    foodImage: {
        width: 200,
        height: 200,
        borderRadius: 8,
        margin: 10,
    },
    ingredientText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#50A966',
        textAlign: 'center',
    },
    ingredientDetails: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#453131',
        textAlign: 'left',
    },
    calorieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    calorieCount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFC85C',
        textAlign: 'center',
        marginRight: 5,
    },
    calorieLabel: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
    },
});
