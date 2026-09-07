import { Text, StyleSheet, TextInput, View, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
    const navigation = useNavigation();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function UserLogin() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    navigation.navigate('MainAdmin');
                } else if (userData.role === 'user') {
                    navigation.navigate('Main');
                }
            } else {
                Alert.alert("Error", "User data not found!");
            }
        } catch (error) {
            Alert.alert("Error", error.message);
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
                    <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.push('Forgot')}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>
    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={UserLogin}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
    
                    <View style={styles.loginContainer}>
                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.push('Signup')}>
                            <Text style={styles.loginText}>SignUp</Text>
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
        forgotPassword: {
        alignSelf: 'flex-end',
        marginLeft: 20,
        marginBottom: 10,
        },
        forgotPasswordText: {
        color: 'rgba(127, 192, 75, 1)',
        fontSize: 12,
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