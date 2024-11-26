import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync('local_storage.db');

interface Workout {
    id: number;
}

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

const insertSet = async (userName: string, successFunc: () => void): Promise<void> => {
    try {
        await db.execAsync('insert into lifts values (?)');
        successFunc();
    } catch (error) {
        console.log("db error insertSet");
        console.log(error);
    }
};

const dropDatabaseTablesAsync = async (): Promise<void> => {
    try {
        await db.execAsync('drop table users');
        console.log("Dropped users table");
    } catch (error) {
        console.log("error dropping users table");
        console.log(error);
    }
};

const setupDatabaseAsync = async (): Promise<void> => {
    try {
        await db.execAsync(
            `CREATE TABLE IF NOT EXISTS lifts (
                id INTEGER PRIMARY KEY NOT NULL, 
                workoutId INTEGER NOT NULL, 
                dateTime INTEGER NOT NULL, 
                set INTEGER NOT NULL, 
                lift TEXT NOT NULL, 
                numReps INTEGER
            );`
        );
        console.log("Database setup complete");
    } catch (error) {
        console.log("db error creating tables");
        console.log(error);
    }
};

const setupLiftsAsync = async (): Promise<void> => {
    try {
        await db.execAsync('insert into users (id, name) values (?,?)');
        console.log("Setup lifts complete");
    } catch (error) {
        console.log("db error insertUser");
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

