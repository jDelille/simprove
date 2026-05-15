let latestGSProData: any = null;

export function setGSProData(data: any) {
  latestGSProData = data;
}

export function getGSProData() {
  return latestGSProData;
}

declare global {
  var pendingRoundsStore: any[] | undefined;
}

export const pendingRounds =
  global.pendingRoundsStore ?? (global.pendingRoundsStore = []);