import { useEffect, useState } from "react";
import { Text, View, StyleSheet, } from "react-native";
import * as SQLite from "expo-sqlite";

import ExerciseRow from '@/components/ExerciseRow';
import ResultsRow from '@/components/ResultsRow';
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

    const [pullUpsArray, setPullUpsArray] = useState<number[]>([]);
    const [rowsArray, setRowsArray] = useState<number[]>([]);
    const [dipsArray, setDipsArray] = useState<number[]>([]);
    const [pushUpsArray, setPushUpsArray] = useState<number[]>([]);

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

    const onSubmitSet = () => {
        try {
            db.runSync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'pullups', $numPullUps)`, { $workoutId: workoutId, $numSet: numSet, $numPullUps: numPullUps });
            db.runSync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'rows', $numRows)`, { $workoutId: workoutId, $numSet: numSet, $numRows: numRows });
            db.runSync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'dips', $numDips)`, { $workoutId: workoutId, $numSet: numSet, $numDips: numDips });
            db.runSync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, 'pushups', $numPushUps)`, { $workoutId: workoutId, $numSet: numSet, $numPushUps: numPushUps });
            setNumSet(numSet + 1);
            setLastNumPullUps(numPullUps);
            setLastNumRows(numRows);
            setLastNumDips(numDips);
            setLastNumPushUps(numPushUps);
            if (numSet >= 3) {
                const pullUps = db.getAllSync(`SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'pullups' ORDER BY numSet`, { $workoutId: workoutId });
                const rows = db.getAllSync(`SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'rows' ORDER BY numSet`, { $workoutId: workoutId });
                const dips = db.getAllSync(`SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'dips' ORDER BY numSet`, { $workoutId: workoutId });
                const pushUps = db.getAllSync(`SELECT * FROM lifts WHERE workoutId IS $workoutId AND lift IS 'pushups' ORDER BY numSet`, { $workoutId: workoutId });

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

            }
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
                    <ResultsRow label="Pull-Ups" numReps={pullUpsArray} ></ResultsRow>
                    <ResultsRow label="Rows" numReps={rowsArray} ></ResultsRow>
                    <ResultsRow label="Dips" numReps={dipsArray} ></ResultsRow>
                    <ResultsRow label="Push-Ups" numReps={pushUpsArray} ></ResultsRow>
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
