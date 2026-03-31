import { Shot } from "@/types/shot";
import { calculateAverages } from "../shots/averages";


type CalculateSessionStatsProps = {
    userId: string;
    shots: Shot[];
    sessionLength: number;
    club?: string;
};

export function calculateSessionStats({ userId, shots, sessionLength, club   }: CalculateSessionStatsProps) {
    const averages = calculateAverages(shots);

    return {
        ...averages,
        sessionLength,
    }
}