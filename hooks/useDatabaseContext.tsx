// force the state to clear with fast refresh in Expo
// @refresh reset
import React, { useEffect, createContext, useState, ReactNode } from 'react';

import { database } from '@/constants/Database'

export default function useDatabase() {
    const [isDBLoadingComplete, setDBLoadingComplete] = React.useState(false);

    useEffect(() => {
        async function loadDataAsync() {
            try {
                await database.dropDatabaseTablesAsync()
                await database.setupDatabaseAsync()
                await database.setupLiftsAsync()

                setDBLoadingComplete(true);
            } catch (e) {
                console.warn(e);
            }
        }

        loadDataAsync();
    }, []);

    return isDBLoadingComplete;
}

export const LiftsContext = createContext({});

type LiftProps = {
    liftId: number;
    numReps: number;
    children: ReactNode;
};

export const LiftsContextProvider = { props: LiftProps } => {
    // Initial values are obtained from the props
    const {
        liftId: liftId,
        numReps: numReps,
        children
    } = props;

    // Use State to store the values
    const [numReps, setNumReps] = useState(numReps);

    useEffect(() => {
        refreshUsers()
    }, [])

    const addNewUser = userName => {
        return database.insertSet(userName, refreshUsers)
    };

    const refreshUsers = () => {
        return database.getWorkout(setUsers)
    }

    // Make the context object:
    const liftsContext = {
        users,
        addNewUser
    };

    // pass the value in provider and return
    return <LiftsContext.Provider value={liftsContext}>{children}</LiftsContext.Provider>;
};
