import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, View, TouchableOpacity, StatusBar, Alert, Image } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignupScreen() {
    const navigation = useNavigation();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfpassword, setCfPassword] = useState('');

    async function UserRegister() {
        if (!username || !email || !password || !cfpassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (cfpassword !== password) {
            Alert.alert('Error', "Passwords don't match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const currentUser = userCredential.user;
            
            await setDoc(doc(db, "users", currentUser.uid), {
                name: username,
                email: email,
                role: 'user'
            });

            navigation.navigate('Info', { userId: currentUser.uid });
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <ExpoStatusBar style="light" />
            <Image style={styles.backgroundImage} source={require('../../assets/images/bg.png')} />

            <View style={styles.formContainer}>
                
                <View style={styles.titleContainer}>
                    <Image 
                        source={require('../../assets/images/Logo.png')} 
                        style={styles.logo} 
                    />
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Username"
                            placeholderTextColor={'gray'}
                            onChangeText={setUsername}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry={true}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry={true}
                            onChangeText={setCfPassword}
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={UserRegister}>
                            <Text style={styles.buttonText}>SignUp</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.loginContainer}>
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
    lightsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        width: '100%',
    },
    lightImage: {
        height: 225,
        width: 90,
    },
    lightImageOpacity: {
        height: 160,
        width: 65,
        opacity: 0.75,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'space-around',
        paddingTop: 48,
    },
    titleContainer: {
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 40,
    },
    form: {
        alignItems: 'center',
        marginHorizontal: 20,
        spaceBetween: 16,
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
    logo: {
        width: 200, 
        height: 200, 
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: ' rgba(127, 192, 75, 1)',
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