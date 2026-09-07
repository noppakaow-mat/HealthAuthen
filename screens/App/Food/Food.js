import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { db } from '../../../Firebase';
import { Card } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function Food() {
  const { t, i18n } = useTranslation(); 
  const [foodItems, setFoodItems] = useState([]);
  const [categoriesItems, setCategoriesItems] = useState([]);
  const [SearchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFoodData = async () => {
      const foodCollection = collection(db, 'food');
      const snapshot = await getDocs(foodCollection);
      const foods = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFoodItems(foods);
    };
    fetchFoodData();
  }, []);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const categoriesCollection = collection(db, 'categories');
      const snapshot = await getDocs(categoriesCollection);
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategoriesItems(categories);
    };
    fetchCategoriesData();
  }, []);

  const Search = async () => {
    if (SearchText.trim() === '') {
      setSearchResults([]);
      return;
    }
  
    const foodCollection = collection(db, 'food');
    const fnameQuery = query(foodCollection, where('fname', '==', SearchText));
    const catQuery = query(foodCollection, where('cat', '==', SearchText));
  
    const [fnameSnapshot, catSnapshot] = await Promise.all([
      getDocs(fnameQuery),
      getDocs(catQuery),
    ]);
    const searchResults = [
      ...fnameSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ];
    const uniqueResults = Array.from(new Map(searchResults.map(item => [item.id, item])).values());
  
    if (uniqueResults.length === 0) {
      console.log("No matching documents.");
      setSearchResults([]);
    } else {
      console.log("Matched documents.");
      setSearchResults(uniqueResults);
    }
  };

  const pressFoodpic = (fname) => {
    navigation.navigate('FoodInfo', { fname });
  };

  const getCategoryName = (category) => {
    return i18n.language === 'th' && category.CnameTH ? category.CnameTH : category.Cname;
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.navHeader}>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Ionicons name="arrow-back" size={15} color="black" />
            <Text style={styles.homeButtonText}>{t('home')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.MealsButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Ionicons name="barcode-outline" size={24} color="#50A966" />
            <Text style={styles.MealsButtonText}>{t('Scanner')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.MealsButton}
            onPress={() => navigation.navigate('MealsPlan')}
          >
            <Ionicons name="clipboard" size={24} color="#50A966" />
            <Text style={styles.MealsButtonText}>{t('mealplans')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: Constants.statusBarHeight }}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-sharp"
              size={20}
              color="white"
              style={{ marginLeft: 10 }}
              onPress={Search}
            />
            <TextInput
              placeholder={t('search')}
              style={styles.textBox}
              keyboardType="default"
              value={SearchText}
              onChangeText={setSearchText}
            />
          </View>

          <ScrollView horizontal={true} style={{ margin: 15 }}>
            {foodItems.map((food) => (
              <TouchableOpacity key={food.id} onPress={() => pressFoodpic(food.fname)}>
                <Card style={styles.item}>
                  <Image source={{ uri: food.picUrl }} style={styles.foodImage} />
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('categories')}</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color="black"
              style={styles.ellipsisIcon}
              onPress={Search}
            />
          </View>

          <ScrollView horizontal={true} style={styles.categoriesContainer}>
            {categoriesItems.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                onPress={() => { 
                  setSearchText(category.Cname);
                  Search(); 
                }}
              >
                <Card style={styles.Category}>
                  <Image source={{ uri: category.Cpic }} style={styles.categoryImage} />
                  <Text style={styles.categoryName}>{getCategoryName(category)}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('recommendedMenu')}</Text>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color="black"
              style={styles.ellipsisIcon}
              onPress={Search}
            />
          </View>

          <FlatList
            data={searchResults.length > 0 ? searchResults : foodItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => pressFoodpic(item.fname)}>
                <Card style={styles.item2}>
                  <Image source={{ uri: item.picUrl }} style={styles.recommendedImage} />
                </Card>
              </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={styles.row}
            ListEmptyComponent={() => (
              <View style={styles.emptyListContainer}>
                <Text>{t('noItemsFound')}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,  
    backgroundColor: '#F5F5F5', 
    elevation: 4,
    justifyContent: 'space-between',
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

  MealsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#EAF2E3',
    borderRadius: 20, 
    elevation: 2,
  },
  MealsButtonText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#50A966',
    fontWeight: 'bold',
  },
  searchContainer: {
    height: 33,
    marginLeft: 40,
    marginRight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#397A49',
    borderRadius: 8,
    margin: 5,
  },
  textBox: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#4A9B5D',
    height: 33,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    marginLeft: 10,
    paddingRight: 20,
    color: 'white',
  },
  item: {
    width: 220,
    height: 135,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 12, 
    elevation: 3, 
  },
  foodImage: {
    width: 220,
    height: 135,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
    marginRight: '5%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
  },
  ellipsisIcon: {
    marginTop: 4,
  },
  categoriesContainer: {
    flexWrap: 'wrap',
    marginLeft: '2%',
  },
  Category: {
    width: 55,
    height: 75,
    alignItems: 'center',
    margin: 10,
    borderRadius: 12,
    elevation: 2,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  categoryName: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    paddingTop: 2,
  },
  item2: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6, 
    borderRadius: 12,
    width: 175,
    height: 125,
    elevation: 3,
  },
  recommendedImage: {
    width: 175,
    height: 125,
    borderRadius: 8,
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  emptyListContainer: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});