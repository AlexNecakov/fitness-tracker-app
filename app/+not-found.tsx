import { Text, View, StyleSheet } from "react-native";
import { Link, Stack } from 'expo-router';

export default function Index() {
    return (
        <>
            <Stack.Screen options={{ title: 'Page under construction' }} />
            <View style={styles.container}>
                <Link href="/" style={styles.button}>
                    Go home
                </Link>
            </View>
        </>
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
});
