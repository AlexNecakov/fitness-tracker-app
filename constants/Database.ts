import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync('local_storage.db');

interface Workout {
    id: number;
}
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

// Define the type for setUserFunc
type SetWorkoutFunc = (workouts: Workout[]) => void;

const getWorkout = async (setWorkoutFunc: SetWorkoutFunc): Promise<void> => {
    try {
        const result = await db.execAsync('select * from users');
        setWorkoutFunc(result.rows._array as Workout[]);
    } catch (error) {
        console.log("db error load users");
        console.log(error);
    }
};

export const database = {
    setupDatabaseAsync,
    dropDatabaseTablesAsync,
    setupLiftsAsync,
    getWorkout,
    insertSet,
};

