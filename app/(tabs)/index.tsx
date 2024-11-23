import { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import * as SQLite from "expo-sqlite";

import ExerciseRow from "@/components/ExerciseRow";
import ResultsRow from "@/components/ResultsRow";
import Button from "@/components/Button";

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

    const [targetSets, setTargetSets] = useState<number>(3);

    const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined);
    const [workoutId, setWorkoutId] = useState<number>(0);
    const [numSet, setNumSet] = useState<number>(1);

    const [numPullUps, setNumPullUps] = useState<number>(5);
    const [numRows, setNumRows] = useState<number>(5);
    const [numDips, setNumDips] = useState<number>(5);
    const [numPushUps, setNumPushUps] = useState<number>(5);

    const [lastNumPullUps, setLastNumPullUps] = useState<number>(0);
    const [lastNumRows, setLastNumRows] = useState<number>(0);
    const [lastNumDips, setLastNumDips] = useState<number>(0);
    const [lastNumPushUps, setLastNumPushUps] = useState<number>(0);

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
                        console.log("maxWorkOutId:", maxWorkOutId);
                        setWorkoutId(maxWorkOutId + 1);
                    } else {
                        console.log("No workoutId found, starting at 1");
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
        setScreenState(screenStates.SCREEN_enterSet);
    };

    const onSubmitSet = () => {
        try {
            db.runSync(
                `INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'pullups', $numPullUps)`,
                {
                    $workoutId: workoutId,
                    $numSet: numSet,
                    $numPullUps: numPullUps,
                },
            );
            db.runSync(
                `INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'rows', $numRows)`,
                { $workoutId: workoutId, $numSet: numSet, $numRows: numRows },
            );
            db.runSync(
                `INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'dips', $numDips)`,
                { $workoutId: workoutId, $numSet: numSet, $numDips: numDips },
            );
            db.runSync(
                `INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'pushups', $numPushUps)`,
                {
                    $workoutId: workoutId,
                    $numSet: numSet,
                    $numPushUps: numPushUps,
                },
            );
            setNumSet(numSet + 1);
            setLastNumPullUps(numPullUps);
            setLastNumRows(numRows);
            setLastNumDips(numDips);
            setLastNumPushUps(numPushUps);
            if (numSet >= targetSets) {
                const pullUps = db.getAllSync(
                    `SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'pullups' ORDER BY numSet`,
                    { $workoutId: workoutId },
                );
                const rows = db.getAllSync(
                    `SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'rows' ORDER BY numSet`,
                    { $workoutId: workoutId },
                );
                const dips = db.getAllSync(
                    `SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'dips' ORDER BY numSet`,
                    { $workoutId: workoutId },
                );
                const pushUps = db.getAllSync(
                    `SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'pushups' ORDER BY numSet`,
                    { $workoutId: workoutId },
                );

                const newPullUpsArray = [...pullUpsArray];
                for (const row of pullUps) {
                    newPullUpsArray.push(row.numReps);
                }
                setPullUpsArray(newPullUpsArray);

                const newRowsArray = [...rowsArray];
                for (const row of rows) {
                    newRowsArray.push(row.numReps);
                }
                setRowsArray(newRowsArray);

                const newDipsArray = [...dipsArray];
                for (const row of dips) {
                    newDipsArray.push(row.numReps);
                }
                setDipsArray(newDipsArray);

                const newPushUpsArray = [...pushUpsArray];
                for (const row of pushUps) {
                    newPushUpsArray.push(row.numReps);
                }
                setPushUpsArray(newPushUpsArray);

                setScreenState(screenStates.SCREEN_results);
            }
        } catch (error) {
            console.error("Database error:", error);
        }
    };

    if (screenState == screenStates.SCREEN_loading) {
        return (
            <View style={styles.container}>
                <View style={styles.entriesContainer}>
                    <Text style={styles.text}>Loading...</Text>;
                </View>
            </View>);
    } else if (screenState == screenStates.SCREEN_setup_Workout) {
        return (
            <View style={styles.container}>
                <View style={styles.entriesContainer}>
                    <View style={styles.entriesRow}>
                        <TextInput
                            style={styles.text}
                            onChangeText={text => setTargetSets(text)}
                            value={targetSets}
                            multiline={false}
                            placeholder="Enter Number of Sets"
                            keyboardType="numeric"
                            inputMode="numeric"
                        />
                    </View>
                    <View style={styles.entriesRow}>
                        <Button label="Start Workout" onPress={onStartWorkout}></Button>
                    </View>
                </View>
            </View>);
    } else if (screenState == screenStates.SCREEN_enterSet) {
        return (
            <View style={styles.container}>
                <View style={styles.entriesContainer}>
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
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}>Last</Text>
                        </View>
                        <View style={styles.entriesCell}>
                            <Text style={styles.text}>Current</Text>
                        </View>
                    </View>
                    <ExerciseRow
                        label="Pull-Ups"
                        lastNumReps={lastNumPullUps}
                        numReps={numPullUps}
                        setNumReps={setNumPullUps}
                    >
                    </ExerciseRow>
                    <ExerciseRow
                        label="S. Rows"
                        lastNumReps={lastNumRows}
                        numReps={numRows}
                        setNumReps={setNumRows}
                    >
                    </ExerciseRow>
                    <ExerciseRow
                        label="Dips"
                        lastNumReps={lastNumDips}
                        numReps={numDips}
                        setNumReps={setNumDips}
                    >
                    </ExerciseRow>
                    <ExerciseRow
                        label="Push-Ups"
                        lastNumReps={lastNumPushUps}
                        numReps={numPushUps}
                        setNumReps={setNumPushUps}
                    >
                    </ExerciseRow>
                    <Button label="Submit Set" onPress={onSubmitSet}></Button>
                </View>
            </View>
        );
    } else if (screenState == screenStates.SCREEN_results) {
        return (
            <View style={styles.container}>
                <View style={styles.entriesContainer}>
                    <ResultsRow label="Pull-Ups" numReps={pullUpsArray}>
                    </ResultsRow>
                    <ResultsRow label="Rows" numReps={rowsArray}></ResultsRow>
                    <ResultsRow label="Dips" numReps={dipsArray}></ResultsRow>
                    <ResultsRow label="Push-Ups" numReps={pushUpsArray}>
                    </ResultsRow>
                </View>
            </View>
        );
    } else {
        return;
        <View style={styles.container}>
            <View style={styles.entriesContainer}>
                <Text style={styles.text}>Error</Text>;
            </View>
        </View>;
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
    entriesContainer: {
        position: "absolute",
        bottom: 80,
    },
    entriesRow: {
        alignItems: "center",
        flexDirection: "row",
    },
    entriesCell: {
        alignItems: "center",
        flexDirection: "row",
        padding: 20,
        width: "33%",
    },
});
