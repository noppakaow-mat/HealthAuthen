import { Text, StyleSheet, TextInput, View, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import React, { useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const { t } = useTranslation(); 
    async function resetPassword() {
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'An email has been sent to reset your password.');
        } catch (error) {
            Alert.alert('Error', 'There was a problem sending the password reset email. Please try again later.');
            console.error('Password reset error:', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
  
  <View style={styles.navHeader}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => navigation.navigate('Setting')}
                >
                    <Ionicons name="arrow-back" size={15} color="black" />
                    <Text style={styles.homeButtonText}>{t('settings')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.headerBG}>
                <Text style={styles.headerText}>{t('changePassword')}</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.form}>
                <View style={styles.buttonContainer}>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholderTextColor={'gray'}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={resetPassword}>
                            <Text style={styles.buttonText}>{t('Submit')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20
    },
    backgroundImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    formContainer: {
        flex: 1,
        paddingTop: 0,
        paddingBottom: 10,
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        width: 200, 
        height: 200, 
        resizeMode: 'contain',
    },
    form: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    inputContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        marginBottom: 10,
    },
    input: {
        paddingVertical: 2,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: 'rgba(127, 192, 75, 1)',
        padding: 15,
        borderRadius: 20,
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonText2: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        paddingBottom: 10
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: 'rgba(127, 192, 75, 1)',
    },
    navHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 0, 
        paddingVertical: 10, 
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
    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 30,
    },
    headerBG: {
        backgroundColor: '#4A9B5D',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        marginBottom: 30,
        width: '100%',
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
    }
});