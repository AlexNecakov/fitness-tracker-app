import React, { useEffect, createContext, useState, ReactNode, FC } from 'react';
import { database } from '@/constants/Database';

export default function useDatabase(): boolean {
    const [isDBLoadingComplete, setDBLoadingComplete] = useState(false);

    useEffect(() => {
        const loadDataAsync = async () => {
            try {
                await database.dropDatabaseTablesAsync();
                await database.setupDatabaseAsync();

                setDBLoadingComplete(true);
            } catch (e) {
                console.warn(e);
            }
        };

        loadDataAsync();
    }, []);

    return isDBLoadingComplete;
}

interface LiftProps {
    workoutId: number;
    children: ReactNode;
}

interface LiftsContextType {
    users: any[];
    addNewUser: (userName: string) => Promise<void>;
}

export const LiftsContext = createContext<LiftsContextType | undefined>(undefined);

export const LiftsContextProvider: FC<LiftProps> = ({ workoutId, children }) => {
    const [numRepsState, setNumReps] = useState<number>(numReps);

    const insertSet = async (userName: string): Promise<void> => {
        return database.insertSet(userName, refreshUsers);
    };

    const getWorkout = async (): Promise<void> => {
        const setList = await database.getWorkout(0);
        getWorkout(setList);
    };

    const liftsContext: LiftsContextType = {
        workoutId,
        dbHandle,
    };

    return <LiftsContext.Provider value={liftsContext}>{children}</LiftsContext.Provider>;
};

