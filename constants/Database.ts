import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync('local_storage.db');

const setupDatabaseAsync = async (): Promise<void> => {
    try {
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS lifts (
                id INTEGER PRIMARY KEY NOT NULL, 
                workoutId INTEGER NOT NULL, 
                dateTime INTEGER NOT NULL, 
                set INTEGER NOT NULL, 
                liftId INTEGER NOT NULL, 
                numReps INTEGER
            );`
        );
        console.log("Database setup complete");
    } catch (error) {
        console.log("db error creating tables");
        console.log(error);
    }
};

const dropDatabaseTablesAsync = async (): Promise<void> => {
    try {
        await db.execAsync(`DROP TABLE lifts`);
        console.log("Dropped lifts table");
    } catch (error) {
        console.log("error dropping lifts table");
        console.log(error);
    }
};

const insertSet = async (workoutId: number, set: number, liftId: number, numReps: number, successFunc: () => void): Promise<void> => {
    try {
        await db.runAsync(`INSERT INTO lifts (workoutId, dateTime, numSet, lift, numReps) VALUES ($workoutId, datetime(), $numSet, $lift, $numReps)`,
            {
                $workoutId: workoutId,
                $numSet: set,
                $lift: liftId,
                $numReps: numReps,
            });
        successFunc();
    } catch (error) {
        console.log("db error insertSet");
        console.log(error);
    }
};

interface Set {
    numSet: number;
    liftId: number;
    numReps: number;
}
// Define the type for setUserFunc
type SetSetArrayFunc = (sets: Set[]) => void;

const getWorkout = async (workoutId: number, setSetArrayFunc: SetSetArrayFunc): Promise<void> => {
    try {
        const data = db?.getAllSync(
            `SELECT * FROM lifts WHERE workoutId IS $workoutId ORDER BY numSet, liftID`,
            { $workoutId: workoutId },
        );
        if (data) {
            const sets: Set[] = data.map((row: any) => ({
                numSet: row.numSet,
                liftId: row.liftId,
                numReps: row.numReps
            }));
            setSetArrayFunc(sets);
        }
    }
    catch (error) {
        console.log("db error load workout");
        console.log(error);
    }
};

export const database = {
    setupDatabaseAsync,
    dropDatabaseTablesAsync,
    getWorkout,
    insertSet,
};

