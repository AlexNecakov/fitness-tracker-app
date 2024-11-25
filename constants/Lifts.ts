export interface Lift {
    id: number;
    name: string;
    displayName: string;
    shortDisplayName?: undefined | string;
}

export const liftsTable: Lift[] = [
    { id: 1, name: "pullups", displayName: "Pull-Ups" },
    { id: 2, name: "suspensionrows", displayName: "Suspension Rows", shortDisplayName: "S. Rows" },
    { id: 3, name: "dips", displayName: "Dips" },
    { id: 4, name: "pushups", displayName: "Push-Ups" },
];

export const getLiftById = (id: number): Lift | undefined => {
    return liftsTable.find(Lift => Lift.id === id);
};
