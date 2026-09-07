import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { I18nextProvider } from 'react-i18next';
import i18n from './screens/i18'
import LoginScreen from './screens/Login/LoginScreen';
import SignupScreen from './screens/Login/SignupScreen';
import ForgotScreen from './screens/Login/ForgotScreen';
import InfoScreen from './screens/Login/InfoScreen';
import MainScreen from './screens/App/MainScreen';
import MainAdminScreen from './screens/Admin/MainAdmin';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Forgot" component={ForgotScreen} />
          <Stack.Screen name="Info" component={InfoScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="MainAdmin" component={MainAdminScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </I18nextProvider>
  );
}

export default App;