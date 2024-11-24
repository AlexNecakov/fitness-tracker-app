import { Text, View, StyleSheet, ScrollView} from "react-native";

type Props = {
    label: string;
    numReps: number[];
};

export default function ResultsRow({ label, numReps }: Props) {

    return (
            <ScrollView style={styles.scrollView}>
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
            </ScrollView>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 40,
        color: '#ffff',
    },
    entriesRow: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
    },
    entriesCell: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
        padding: 20,
    },
    scrollView:{
        height: "100%",
    },
});
