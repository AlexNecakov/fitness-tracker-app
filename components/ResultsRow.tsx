import { Text, View, StyleSheet, } from "react-native";

type Props = {
    label: string;
    numReps: number[];
};

export default function ResultsRow({ label, numReps }: Props) {

    return (
        <View style={styles.entriesRow}>
            <View style={styles.entriesCell}>
                <Text style={styles.text}>{label}</Text>
            </View>
            {numReps.map((rep, index) =>
            (
                <View key={index} style={styles.entriesCell}>
                    <Text style={styles.text}>{rep}
                    </Text>
                </View>
            )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        color: '#ffff',
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
