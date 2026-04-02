export function drillProgress(credited_shots: number, target_shots: number): number {
    const progressValue = (credited_shots / target_shots) * 100;
    return Math.min(progressValue, 100);
}