"use client";
import { useEffect, useState } from "react";

export default function GSProData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/gspro/ingest");
      const json = await res.json();
      setData(json);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}