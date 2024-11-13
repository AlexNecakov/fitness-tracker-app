import { useState } from 'react';
import { Text, View, StyleSheet, } from "react-native";

import IconButton from "@/components/IconButton";


export default function Index() {
    const [numPullUps, setNumPullUps] = useState(0);

    const onPlus = () => {
        setNumPullUps(numPullUps + 1);
    };
    const onMinus = () => {
        setNumPullUps(Math.max(0, numPullUps - 1));
    };


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Set # 2/3</Text>
            <Text style={styles.text}>Last  Current</Text>
            <View style={styles.optionsContainer}>
                <View style={styles.optionsRow}>
                    <Text style={styles.text}>Pull-Ups  5 </Text>
                    <IconButton icon="minus" onPress={onMinus} ></IconButton>
                    <Text style={styles.text}>{numPullUps}</Text>
                    <IconButton icon="plus" onPress={onPlus} ></IconButton>
                </View>
                <View style={styles.optionsRow}>
                    <Text style={styles.text}>S. Rows   5 -5+</Text>
                </View>
                <View style={styles.optionsRow}>
                    <Text style={styles.text}>Dips      5 -5+</Text>
                </View>
                <View style={styles.optionsRow}>
                    <Text style={styles.text}>Push-Ups  5 -5+</Text>
                </View>
            </View>
        </View >
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
        fontSize: 40,
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
        flexDirection: 'row',
    }
});
