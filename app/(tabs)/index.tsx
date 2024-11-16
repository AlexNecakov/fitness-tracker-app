import { useEffect, useState } from "react";
import { Text, View, StyleSheet, } from "react-native";
import * as SQLite from "expo-sqlite";

import ExerciseRow from '@/components/ExerciseRow';
import Button from "@/components/Button";


export default function Index() {

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

    useEffect(() => {
        const fetchData = async () => {
            try { // Replace with your async function 
                const datab = await SQLite.openDatabaseAsync('databaseName');
                setDb(datab);
                if (datab) {
                    await datab.execAsync(`
                    PRAGMA journal_mode = WAL;
                    CREATE TABLE IF NOT EXISTS lifts (id INTEGER PRIMARY KEY NOT NULL, workoutId INTEGER NOT NULL, dateTime INTEGER NOT NULL, numSet INTEGER NOT NULL, lift TEXT NOT NULL, numReps INTEGER);
                `);
                    const maxWorkOutIdResult = await datab.getAllAsync(`SELECT MAX(workoutId) AS maxId FROM lifts`);
                    if (maxWorkOutIdResult.length > 0) {
                        const maxWorkOutId = maxWorkOutIdResult[0].maxId || 0;
                        console.log('maxWorkOutId:', maxWorkOutId);
                        setWorkoutId(maxWorkOutId + 1);
                    }
                    else {
                        console.log('No workoutId found, starting at 1');
                        setWorkoutId(0);
                    }
                }
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once on component mount 
    if (!db) {
        return
        <View style={styles.container}>
            <View style={styles.entriesContainer}>
                <Text style={styles.text}>Loading...</Text>;
            </View >
        </View >
    }

    const onSubmitSet = async () => {
        try {
            await db.runAsync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'pullups', $numPullUps)`, { $workoutId: workoutId, $numSet: numSet, $numPullUps: numPullUps });
            await db.runAsync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'rows', $numRows)`, { $workoutId: workoutId, $numSet: numSet, $numRows: numRows });
            await db.runAsync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'dips', $numDips)`, { $workoutId: workoutId, $numSet: numSet, $numDips: numDips });
            await db.runAsync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'pushups', $numPushUps)`, { $workoutId: workoutId, $numSet: numSet, $numPushUps: numPushUps });
            const allRows = await db.getAllAsync('SELECT * FROM lifts WHERE numSet IS $numSet AND workoutId is $workoutId', { $numSet: numSet, $workoutId: workoutId });
            for (const row of allRows) {
                console.log(row.id, row.workoutId, row.dateTime, row.numSet, row.lift, row.numReps);
            }
            setNumSet(numSet + 1);
            setLastNumPullUps(numPullUps);
            setLastNumRows(numRows);
            setLastNumDips(numDips);
            setLastNumPushUps(numPushUps);
        }
        catch (error) {
            console.error('Database error:', error);
        }

    };

    if (numSet < 4) {
        return (
            <View style={styles.container}>
                <View style={styles.entriesContainer}>
                    <Text style={styles.text}>Set # {numSet}/3</Text>
                    <Text style={styles.text}>Last  Current</Text>
                    <ExerciseRow label="Pull-Ups" lastNumReps={lastNumPullUps} numReps={numPullUps} setNumReps={setNumPullUps}></ExerciseRow>
                    <ExerciseRow label="S. Rows" lastNumReps={lastNumRows} numReps={numRows} setNumReps={setNumRows}></ExerciseRow>
                    <ExerciseRow label="Dips" lastNumReps={lastNumDips} numReps={numDips} setNumReps={setNumDips}></ExerciseRow>
                    <ExerciseRow label="Push-Ups" lastNumReps={lastNumPushUps} numReps={numPushUps} setNumReps={setNumPushUps}></ExerciseRow>
                    <Button label="Submit Set" onPress={onSubmitSet}></Button>
                </View>
            </View >
        );
    }
    else {
        return (
            <View style={styles.container}>
                <View style={styles.entriesContainer}>
                    <Text style={styles.text}>Set # {numSet}/3</Text>
                    <Text style={styles.text}>Last  Current</Text>
                    <ExerciseRow label="Pull-Ups" lastNumReps={lastNumPullUps} numReps={numPullUps} setNumReps={setNumPullUps}></ExerciseRow>
                    <ExerciseRow label="S. Rows" lastNumReps={lastNumRows} numReps={numRows} setNumReps={setNumRows}></ExerciseRow>
                    <ExerciseRow label="Dips" lastNumReps={lastNumDips} numReps={numDips} setNumReps={setNumDips}></ExerciseRow>
                    <ExerciseRow label="Push-Ups" lastNumReps={lastNumPushUps} numReps={numPushUps} setNumReps={setNumPushUps}></ExerciseRow>
                    <Button label="Submit Set" onPress={onSubmitSet}></Button>
                </View>
            </View >
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
