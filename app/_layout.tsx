import { LiftsContextProvider } from '@/hooks/useDatabaseContext';

export default function Layout() {

    return (
        <LiftsContextProvider >
            <Stack />
        </LiftsContextProvider >);
}

