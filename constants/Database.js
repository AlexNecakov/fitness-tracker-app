import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync('local_storage.db')

const getUsers = (setUserFunc) => {
    db.transaction(
        tx => {
            tx.executeSql(
                'select * from users',
                [],
                (_, { rows: { _array } }) => {
                    setUserFunc(_array)
                }
            );
        },
        (t, error) => { console.log("db error load users"); console.log(error) },
        (_t, _success) => { console.log("loaded users") }
    );
}

const insertUser = (userName, successFunc) => {
    db.transaction(tx => {
        tx.executeSql('insert into users (name) values (?)', [userName]);
    },
        (t, error) => { console.log("db error insertUser"); console.log(error); },
        (t, success) => { successFunc() }
    )
}

const dropDatabaseTablesAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'drop table users',
                [],
                (_, result) => { resolve(result) },
                (_, error) => {
                    console.log("error dropping users table"); reject(error)
                }
            )
        })
    })
}

const setupDatabaseAsync = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists users (id integer primary key not null, name text);'
            );
        },
            (_, error) => { console.log("db error creating tables"); console.log(error); reject(error) },
            (_, success) => { resolve(success) }
        )
        db.execSync(
            `CREATE TABLE IF NOT EXISTS lifts (
            id INTEGER PRIMARY KEY NOT NULL, 
            workoutId INTEGER NOT NULL, 
            dateTime INTEGER NOT NULL, 
            numSet INTEGER NOT NULL, 
            lift TEXT NOT NULL, 
            numReps INTEGER
        );`

        );

    })
}

const setupUsersAsync = async () => {
    return new Promise((resolve, _reject) => {
        db.transaction(tx => {
            tx.executeSql('insert into users (id, name) values (?,?)', [1, "john"]);
        },
            (t, error) => { console.log("db error insertUser"); console.log(error); resolve() },
            (t, success) => { resolve(success) }
        )
    })
}

export const database = {
    getUsers,
    insertUser,
    setupDatabaseAsync,
    setupUsersAsync,
    dropDatabaseTablesAsync,
}
