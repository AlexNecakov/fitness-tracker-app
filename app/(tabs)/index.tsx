import { useState } from 'react';
import { Text, View, StyleSheet, } from "react-native";

import { Link } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

import ImageViewer from "@/components/ImageViewer"
import Button from "@/components/Button";
import IconButton from "@/components/IconButton";
import CircleButton from "@/components/CircleButton";

const PlaceholderImage = require('@/assets/images/background-image.png')

export default function Index() {
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [showAppOptions, setShowAppOptions] = useState<boolean>(false);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert("You did not select any image.");
        }
    };

    const onReset = () => {
        setShowAppOptions(false);
    };

    const onAddSticker = () => {
    };

    const onSaveImageAsAsync = async () => {
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Set # 2/3</Text>
            <Text style={styles.text}>Last  Current</Text>
            <View style={styles.imageContainer}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button theme="primary" label='Choose a photo' onPress={pickImageAsync} />
                    <Button label='Use this photo' onPress={() => setShowAppOptions(true)} />
                </View>
            )}
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
        fontSize: 20,
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
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row'
    }
});
