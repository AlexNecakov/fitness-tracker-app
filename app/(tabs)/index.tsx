import { Text, View, StyleSheet, } from "react-native";

import ExerciseRow from '@/components/ExerciseRow';


export default function Index() {
    return (
        <View style={styles.container}>
            <View style={styles.entriesContainer}>
                <Text style={styles.text}>Set # 2/3</Text>
                <Text style={styles.text}>Last  Current</Text>
                <ExerciseRow label="Pull-Ups"></ExerciseRow>
                <ExerciseRow label="S. Rows"></ExerciseRow>
                <ExerciseRow label="Dips"></ExerciseRow>
                <ExerciseRow label="Push-Ups"></ExerciseRow>
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
    entriesContainer: {
        position: 'absolute',
        bottom: 80,
    },
    entriesRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    entriesCell: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    }
});
