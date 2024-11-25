import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from "@react-native-picker/picker";
import { Link } from 'expo-router';
import * as SQLite from "expo-sqlite";

import ExerciseRow from "@/components/ExerciseRow";
import ResultsRow from "@/components/ResultsRow";
import Button from "@/components/Button";
import * as Lifts from "@/constants/Lifts";

export default function Index() {
    enum screenStates {
        SCREEN_loading = 0,
        SCREEN_setup_Workout = 5,
        SCREEN_enterSet = 10,
        SCREEN_rest = 20,
        SCREEN_results = 30,
    }

    const [screenState, setScreenState] = useState<screenStates>(
        screenStates.SCREEN_setup_Workout,
    );

    const [targetSets, setTargetSets] = useState<number | undefined>(3);
    const [bodyWeight, setBodyWeight] = useState<number | undefined>(undefined);

    const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined);
    const [workoutId, setWorkoutId] = useState<number>(0);
    const [numSet, setNumSet] = useState<number>(1);

    const [numPullUps, setNumPullUps] = useState<number>(5);
    const [numRows, setNumRows] = useState<number>(5);
    const [numDips, setNumDips] = useState<number>(5);
    const [numPushUps, setNumPushUps] = useState<number>(5);

    const [pullUpsArray, setPullUpsArray] = useState<number[]>([]);
    const [rowsArray, setRowsArray] = useState<number[]>([]);
    const [dipsArray, setDipsArray] = useState<number[]>([]);
    const [pushUpsArray, setPushUpsArray] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try { // Replace with your async function
                const datab = await SQLite.openDatabaseAsync("databaseName");
                setDb(datab);
                if (datab) {
                    await datab.execAsync(`
                    PRAGMA journal_mode = WAL;
                    CREATE TABLE IF NOT EXISTS lifts (id INTEGER PRIMARY KEY NOT NULL, workoutId INTEGER NOT NULL, dateTime INTEGER NOT NULL, numSet INTEGER NOT NULL, lift TEXT NOT NULL, numReps INTEGER);
                `);
                    const maxWorkOutIdResult = await datab.getAllAsync(
                        `SELECT MAX(workoutId) AS maxId FROM lifts`,
                    );
                    if (maxWorkOutIdResult.length > 0) {
                        const maxWorkOutId = maxWorkOutIdResult[0].maxId || 0;
                        setWorkoutId(maxWorkOutId + 1);
                    } else {
                        setWorkoutId(0);
                    }
                    setScreenState(screenStates.SCREEN_setup_Workout);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once on component mount

    const onStartWorkout = () => {
        if (targetSets) {
            setScreenState(screenStates.SCREEN_enterSet);
        }
    };

    const onSubmitSet = () => {
        try {
            const lifts = [
                { lift: 'pullups', reps: numPullUps },
                { lift: 'rows', reps: numRows },
                { lift: 'dips', reps: numDips },
                { lift: 'pushups', reps: numPushUps },
            ];

            lifts.forEach(({ lift, reps }) => {
                db?.runSync(
                    `INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, $lift, $numReps)`,
                    {
                        $workoutId: workoutId,
                        $numSet: numSet,
                        $lift: lift,
                        $numReps: reps,
                    }
                );
            });

            setNumSet(numSet + 1);

            if (numSet >= targetSets) {
                const liftsMap = {
                    pullups: setPullUpsArray,
                    rows: setRowsArray,
                    dips: setDipsArray,
                    pushups: setPushUpsArray,
                };
                for (const [lift, setter] of Object.entries(liftsMap)) {
                    const data = db?.getAllSync(
                        `SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS $lift ORDER BY numSet`,
                        { $workoutId: workoutId, $lift: lift },
                    );

                    const newArray = data.map(row => row.numReps);
                    setter(newArray);
                }
                setScreenState(screenStates.SCREEN_results);
            }
        } catch (error) {
            console.error("Database error:", error);
        }
    };


    if (screenState == screenStates.SCREEN_loading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.text}>Loading...</Text>;
                </View>
            </SafeAreaView>);
    } else if (screenState == screenStates.SCREEN_setup_Workout) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.entriesRow}>
                        <View style={styles.entriesCell}>
                            <Text style={{ fontSize: 30, color: '#ffff', alignContent: "center", justifyContent: "center" }}>What's Today's Workout?</Text>
                        </View>
                    </View>
                    <View style={styles.entriesRow}>
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}>Target Sets:</Text>
                        </View>
                        <View style={styles.entriesCell}>
                            <Picker
                                style={styles.pickerStyles}
                                itemStyle={styles.pickerText}
                                numberOfLines={1}
                                selectedValue={targetSets}
                                onValueChange={(itemValue, itemIndex) =>
                                    setTargetSets(itemValue)
                                }>
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                                <Picker.Item label="4" value="4" />
                                <Picker.Item label="5" value="5" />
                                <Picker.Item label="6" value="6" />
                                <Picker.Item label="7" value="7" />
                                <Picker.Item label="8" value="8" />
                                <Picker.Item label="9" value="9" />
                                <Picker.Item label="10" value="10" />
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.entriesRow}>
                        <Button label="Start Workout" theme="primary" onPress={onStartWorkout}></Button>
                    </View>
                </View>
            </SafeAreaView>);
    } else if (screenState == screenStates.SCREEN_enterSet) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.entriesRow}>
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}></Text>
                        </View>
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}>Set # {numSet}/{targetSets}</Text>
                        </View>
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}></Text>
                        </View>
                    </View>
                    <View style={styles.entriesRow}>
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}></Text>
                        </View>
                    </View>
                    <ExerciseRow
                        liftId={1}
                        numReps={numPullUps}
                        setNumReps={setNumPullUps}
                    >
                    </ExerciseRow>
                    <ExerciseRow
                        liftId={2}
                        numReps={numRows}
                        setNumReps={setNumRows}
                    >
                    </ExerciseRow>
                    <ExerciseRow
                        liftId={3}
                        numReps={numDips}
                        setNumReps={setNumDips}
                    >
                    </ExerciseRow>
                    <ExerciseRow
                        liftId={4}
                        numReps={numPushUps}
                        setNumReps={setNumPushUps}
                    >
                    </ExerciseRow>
                    <View style={styles.entriesRow}>
                        <Button label="Complete Set" theme="primary" onPress={onSubmitSet}></Button>
                    </View>
                </View>
            </SafeAreaView>
        );
    } else if (screenState == screenStates.SCREEN_results) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <ResultsRow label="Pull-Ups" numReps={pullUpsArray} />
                    <ResultsRow label="Rows" numReps={rowsArray} />
                    <ResultsRow label="Dips" numReps={dipsArray} />
                    <ResultsRow label="Push-Ups" numReps={pushUpsArray} />
                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.text}>Error</Text>;
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#25292e",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 22,
        color: "#ffff",
    },
    entriesRow: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: 20,
    },
    entriesCell: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        padding: 15,
    },
    pickerStyles: {
        width: '50%',
        justifyContent: "center",
        backgroundColor: "#ffff",
        color: "#25292e",
    },
    pickerText: {
        fontSize: 22,
        color: "#25292e",
    },
});
