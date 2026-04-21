let latestGSProData: any = null;

export function setGSProData(data: any) {
  latestGSProData = data;
}

export function getGSProData() {
  return latestGSProData;
}