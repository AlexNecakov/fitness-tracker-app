import { useEffect, useState } from "react";
import { Text, View, StyleSheet, } from "react-native";
import * as SQLite from "expo-sqlite";

import ExerciseRow from '@/components/ExerciseRow';
import Button from "@/components/Button";


export default function Index() {

    const [db, setDb] = useState<SQLite.SQLiteDatabase | undefined>(undefined);
    const [numPullUps, setNumPullUps] = useState<number>(5);
    const [numRows, setNumRows] = useState<number>(5);
    const [numDips, setNumDips] = useState<number>(5);
    const [numPushUps, setNumPushUps] = useState<number>(5);

    useEffect(() => {
        const fetchData = async () => {
            try { // Replace with your async function 
                const datab = await SQLite.openDatabaseAsync('databaseName');
                setDb(datab);
                if (db) {
                    await db.execAsync(`
                    PRAGMA journal_mode = WAL;
                    CREATE TABLE IF NOT EXISTS lifts (id INTEGER PRIMARY KEY NOT NULL, lift TEXT NOT NULL, numReps INTEGER);
                `);
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
            await db.runAsync(`INSERT INTO lifts (lift, numReps) VALUES ('pullups', $numPullUps)`, { $numPullUps: numPullUps });
            await db.runAsync(`INSERT INTO lifts (lift, numReps) VALUES ('rows', $numRows)`, { $numRows: numRows });
            await db.runAsync(`INSERT INTO lifts (lift, numReps) VALUES ('dips', $numDips)`, { $numDips: numDips });
            await db.runAsync(`INSERT INTO lifts (lift, numReps) VALUES ('pushups', $numPushUps)`, { $numPushUps: numPushUps });
            const allRows = await db.getAllAsync('SELECT * FROM lifts');
            for (const row of allRows) {
                console.log(row.id, row.lift, row.numReps);
            }
        }
        catch (error) {
            console.error('Database error:', error);
        }

    };

    return (
        <View style={styles.container}>
            <View style={styles.entriesContainer}>
                <Text style={styles.text}>Set # 2/3</Text>
                <Text style={styles.text}>Last  Current</Text>
                <ExerciseRow label="Pull-Ups" numReps={numPullUps} setNumReps={setNumPullUps}></ExerciseRow>
                <ExerciseRow label="S. Rows" numReps={numRows} setNumReps={setNumRows}></ExerciseRow>
                <ExerciseRow label="Dips" numReps={numDips} setNumReps={setNumDips}></ExerciseRow>
                <ExerciseRow label="Push-Ups" numReps={numPushUps} setNumReps={setNumPushUps}></ExerciseRow>
                <Button label="Submit Set" onPress={onSubmitSet}></Button>
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
