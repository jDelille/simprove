import { Shot } from "@/types/shot";
import { calculateAverages } from "../shots/averages";


type CalculateProfileStatsProps = {
    userId: string;
    shots: Shot[];
    sessionLength: number;
    club?: string;
};

export function calculateProfileStats({ userId, shots, sessionLength, club   }: CalculateProfileStatsProps) {
    const averages = calculateAverages(shots);

    return {
        ...averages,
        sessionLength,
    }
}