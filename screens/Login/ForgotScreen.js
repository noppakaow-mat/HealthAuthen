import { Text, StyleSheet, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../Firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();

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
        <View style={styles.container}>
            <ExpoStatusBar style="light" />
            <Image style={styles.backgroundImage} source={require('../../assets/images/bg.png')} />
    
            <View style={styles.titleContainer}>
                <Image 
                    source={require('../../assets/images/Logo.png')} 
                    style={styles.logo} 
                />
            </View>
    
            <View style={styles.formContainer}>
                <View style={styles.form}>
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
                            <Text style={styles.buttonText}>Reset Password</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={styles.loginContainer}>
                        <Text>Remember your password? </Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        color: 'rgba(127, 192, 75, 1)',
    },
});