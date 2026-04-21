export async function fetchGSProData() {
  const res = await fetch("http://localhost:3000/api/gspro/ingest");
  return res.json();
}