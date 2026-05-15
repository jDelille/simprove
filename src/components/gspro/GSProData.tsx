"use client";

import { useEffect, useState } from "react";

export default function GSProData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/gspro/ingest");
      const json = await res.json();

      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? "Loading..." : "Refresh"}
      </button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}