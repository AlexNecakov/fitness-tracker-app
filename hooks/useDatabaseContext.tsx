import React, { useEffect, createContext, useState, ReactNode, FC } from 'react';
import { database } from '@/constants/Database';

export default function useDatabase(): boolean {
    const [isDBLoadingComplete, setDBLoadingComplete] = useState(false);

    useEffect(() => {
        const loadDataAsync = async () => {
            try {
                await database.dropDatabaseTablesAsync();
                await database.setupDatabaseAsync();
                await database.setupLiftsAsync();

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
    liftId: number;
    numReps: number;
    children: ReactNode;
}

interface LiftsContextType {
    users: any[];
    addNewUser: (userName: string) => Promise<void>;
}

export const LiftsContext = createContext<LiftsContextType | undefined>(undefined);

export const LiftsContextProvider: FC<LiftProps> = ({ liftId, numReps, children }) => {
    const [numRepsState, setNumReps] = useState<number>(numReps);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        refreshUsers();
    }, []);

    const addNewUser = async (userName: string): Promise<void> => {
        return database.insertSet(userName, refreshUsers);
    };

    const refreshUsers = async (): Promise<void> => {
        const usersList = await database.getWorkout(0);
        setUsers(usersList);
    };

    const liftsContext: LiftsContextType = {
        users,
        addNewUser,
    };

    return <LiftsContext.Provider value={liftsContext}>{children}</LiftsContext.Provider>;
};

