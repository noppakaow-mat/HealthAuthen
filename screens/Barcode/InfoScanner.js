import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../../Firebase";
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const Barcode = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { foodData } = route.params; 
  const [loading, setLoading] = useState(false); 
  const user = auth.currentUser;
  const { t } = useTranslation();

  const UpdateMeal = async (food) => {
    const userMealPlanDoc = doc(db, "mealPlans", user.uid);

    try {
      const docSnapshot = await getDoc(userMealPlanDoc);
      setLoading(true);

      if (docSnapshot.exists()) {
        await updateDoc(userMealPlanDoc, {
          foodItems: arrayUnion(food),
        });
      } else {
        await setDoc(userMealPlanDoc, {
          foodItems: [food],
        });
      }

      Alert.alert(t('success'), t('foodItemAdded'));
    } catch (error) {
      console.error("Error updating meal plan: ", error);
      Alert.alert(t('error'), t('failedToAddFoodItem')); 
      setLoading(false);
    }
  };

  const pressAdd = async () => {
    const foodToAdd = {
      fname: foodData.product_name,
      cal: foodData.nutriments?.["energy-kcal_serving"] || "N/A",
      picUrl: foodData.image_url,
    };
    
    await UpdateMeal(foodToAdd);
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.navHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Scanner" }],
              })
            }
          >
            <Ionicons name="arrow-back" size={24} color="black" />
            <Text style={styles.backButtonText}>{t('scanner')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{foodData.product_name}</Text>
        </View>

        <View style={styles.card}>
          {foodData.image_url && (
            <Image source={{ uri: foodData.image_url }} style={styles.image} />
          )}

          <Text style={styles.description}>
            {t('brand')}: {foodData.brands ? foodData.brands : t('noProductName')}
          </Text>
          <Text style={styles.description}>
            {t('productName')}: {foodData.product_name ? foodData.product_name : t('noProductName')}
          </Text>

          <Text style={styles.description}>
            {t('energy')}: {foodData.nutriments?.["energy-kcal_serving"]
              ? `${foodData.nutriments["energy-kcal_serving"]} kcal`
              : t('noData')}
          </Text>

          <Text style={styles.description}>
            {t('sugar')}: {foodData.nutriments?.sugars
              ? `${foodData.nutriments.sugars} g`
              : t('noData')}
          </Text>
          <Text style={styles.description}>
            {t('fat')}: {foodData.nutriments?.fat
              ? `${foodData.nutriments.fat} g`
              : t('noData')}
          </Text>
          <Text style={styles.description}>
            {t('protein')}: {foodData.nutriments?.proteins
              ? `${foodData.nutriments.proteins} g`
              : t('noData')}
          </Text>
        </View>
        
        <View style={{ margin: 20, alignItems: "center" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={pressAdd}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('adding') : t('addToMeal')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 30,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingTop: 0,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPill: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4A9B5D",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: "40%",
    height: "9%",
    marginLeft: "7%",
  },
  categoryText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 16,
    marginTop: "5%",
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 8,
  },
  button: {
    height: 50,
    width: 115,
    backgroundColor: "#387647",
    borderRadius: 50,
    justifyContent: "center",
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    fontSize: 17,
  },
});

export default Barcode;
