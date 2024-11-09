import { useState } from 'react';
import { Text, View, StyleSheet, } from "react-native";

import { Link } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

import ImageViewer from "@/components/ImageViewer"
import Button from "@/components/Button";

const PlaceholderImage = require('@/assets/images/background-image.png')

export default function Index() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        } else {
            alert("You did not select any image.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            </View>
            <Text style={styles.text}>Web dev is my passion</Text>
            <Link href="/about" style={styles.button}>
                Go to about screen
            </Link>
            <View style={styles.footerContainer}>
                <Button theme="primary" label='Choose a photo' onPress={pickImageAsync} />
                <Button label='Use this photo' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: '#ffff',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: "#fff",
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        width: 320,
        height: 440,
        borderRadius: 18,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
});
