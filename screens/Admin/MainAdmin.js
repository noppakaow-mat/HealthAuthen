import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 
import AdminFood from './AdminFood.js';
import AdminEx from './AdminEx.js';
import AdminProfile from './AdminProfile.js';


const Tab = createBottomTabNavigator();

export default function AssetExample() {
  return (
    <View style={styles.container}>
      <MyTabs />
    </View>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Food':
              iconName = 'wine';
              break;
            case 'Ex':
              iconName = 'barbell';
              break;
              case 'Profile':
                iconName = 'person';
                break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: 'rgba(56, 118, 71, 1)',
        },
      })}
    >
      <Tab.Screen name="Food" component={AdminFood} />
      <Tab.Screen name="Ex" component={AdminEx} />
      <Tab.Screen name="Profile" component={AdminProfile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(56, 118, 71, 1)',
    flex: 1,
  },
});
