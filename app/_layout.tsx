import { Stack } from 'expo-router';
import { useDatabaseContext } from '@/hooks/useDatabaseContext';

export default function Layout() {

    return (
        <useDatabaseContext>
            <Stack />
        </useDatabaseContext>);
}

