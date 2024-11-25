import { Text, View, StyleSheet, } from "react-native";
import { Lift, getLiftById } from "@/constants/Lifts";

import IconButton from "@/components/IconButton";

type Props = {
    liftId: number;
    numReps: number;
    setNumReps: (numReps: number) => void;
};

export default function ExerciseRow({ liftId, numReps, setNumReps }: Props) {

    const onPlus = () => {
        setNumReps(numReps + 1);
    };
    const onMinus = () => {
        setNumReps(Math.max(0, numReps - 1));
    };
    const lift = getLiftById(liftId);
    const liftDisplayName = lift ? (lift.shortDisplayName ? lift.shortDisplayName : lift.displayName) : "Unknown";


    return (
        <View style={styles.entriesRow}>
            <View style={styles.entriesCell}>
                <Text style={styles.text}>{liftDisplayName}</Text>
            </View>
            <View style={styles.entriesCell}>
                <IconButton icon="minus" onPress={onMinus} ></IconButton>
                <Text style={styles.text}>{numReps}</Text>
                <IconButton icon="plus" onPress={onPlus} ></IconButton>
            </View>
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
        justifyContent: "center",
        flexDirection: 'row',
    },
    entriesCell: {
        alignItems: 'center',
        justifyContent: "center",
        flexDirection: 'row',
        padding: 20,
        width: '50%',
    },
});
