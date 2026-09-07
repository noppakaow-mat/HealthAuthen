import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { db } from "../Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const Suggest = ({ userBody }) => {
    const [recommendedExercises, setRecommendedExercises] = useState([]);
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchRecommendedExercises = async () => {
            console.log("Fetching exercises for body type:", userBody);
            if (userBody) {
                const q = query(collection(db, 'exercise'), where("Exbody", "==", userBody));
                const querySnapshot = await getDocs(q);
                const exercises = querySnapshot.docs.map(doc => doc.data());
                console.log("Exercises fetched:", exercises);
                setRecommendedExercises(exercises);
            }
        };
        fetchRecommendedExercises();
    }, [userBody]);

    const renderExerciseItem = ({ item }) => (
        <TouchableOpacity
            style={styles.exerciseCard}
            onPress={() => {
                navigation.navigate('ExerciseInfo', {
                    Exname: i18n.language === 'th' && item.ExnameTH ? item.ExnameTH : item.Exname,
                    IEx: i18n.language === 'th' && item.IExTH ? item.IExTH : item.IEx,
                    picUrl: item.picUrl,
                    cat: item.cat
                });
            }}
        >
            <Image
                source={{ uri: item.picUrl }}
                style={styles.exerciseImage}
                onError={(e) => console.error('Failed to load image:', e.nativeEvent.error)}
            />
            <View style={styles.textOverlay}>
                <Text style={styles.exerciseName}>
                    {i18n.language === 'th' && item.ExnameTH ? item.ExnameTH : item.Exname}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {t('RecommendedExercises')}
            </Text>
            <FlatList
                data={recommendedExercises}
                renderItem={renderExerciseItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                contentContainerStyle={styles.grid}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgba(0, 128, 0, 0.7)',
        textAlign: 'left',
        marginBottom: 20,
    },
    grid: {
        justifyContent: 'space-between',
    },
    exerciseCard: {
        flex: 1,
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    exerciseImage: {
        width: '100%',
        height: 150,
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 128, 0, 0.4)',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Suggest;
