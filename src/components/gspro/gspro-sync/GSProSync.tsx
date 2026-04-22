"use client";

import { useEffect, useState } from "react";
import styles from "./GSProSync.module.scss";
import moment from "moment";
import Button from "@/components/button/Button";
import { uploadGSProRound } from "@/services/gspro/uploadGSProRound";
import { MdInfoOutline } from "react-icons/md";
import { FaLongArrowAltDown, FaLongArrowAltRight } from "react-icons/fa";

const STORAGE_KEY = "pendingRounds";

type GSProSyncProps = {
  onClose: () => void;
  userId: string;
};

const GSProSync = ({ onClose, userId }: GSProSyncProps) => {
  const [rounds, setRounds] = useState<any[]>([]);
  const [hideIncomplete, setHideIncomplete] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rawData, setRawData] = useState<any>(null);

  const fetchRounds = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedRaw = localStorage.getItem("gsproRawData");

    if (saved) {
      setRounds(JSON.parse(saved));
      if (savedRaw) setRawData(JSON.parse(savedRaw));
      return;
    }

    fetch("/api/gspro/ingest")
      .then((res) => res.json())
      .then((json) => {
        const incoming = json?.[0]?.Rounds_Rounds ?? [];
        if (incoming.length > 0) {
          setRounds(incoming);
          setRawData(json[0]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
          localStorage.setItem("gsproRawData", JSON.stringify(json[0]));
        }
      });
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const displayedRounds = hideIncomplete
    ? rounds.filter((r) => r.holeCount > 0)
    : rounds;

  const toggleSelect = (roundKey: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(roundKey) ? next.delete(roundKey) : next.add(roundKey);
      return next;
    });
  };

  const handleImport = async () => {
    const toImport = displayedRounds.filter((r) => selected.has(r.roundKey));
    await uploadGSProRound({
      userId,
      rounds: toImport,
      allScores: rawData?.RoundScores ?? [],
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("gsproRawData");
    setRounds([]);
    setSelected(new Set());
    onClose();
  };

  return (
    <div className={styles.gsproSync}>
      <div className={styles.disclaimer}>
        <div className={styles.icon}>
          <MdInfoOutline size={16} />
        </div>
        <div className={styles.text}>
          <p>
            Requires the GSPro Sync Chrome Extension. Visit the portal, click
            sync, then refresh below.
          </p>
          <div className={styles.links}>
            <div>
              <FaLongArrowAltDown size={12} /> Download extension
            </div>
            <div>
              <FaLongArrowAltRight size={12} /> GSPro Portal
            </div>
          </div>
        </div>
      </div>

      <div className={styles.pending}>
        <div className={styles.label}>
          <p className={styles.title}>Pending Rounds</p>
          <button onClick={fetchRounds} className={styles.refreshBtn}>
            ↻ Refresh
          </button>
        </div>

        {displayedRounds.length > 0 && (
          <div className={styles.filter}>
            <button
              onClick={() => setHideIncomplete(!hideIncomplete)}
              className={hideIncomplete ? styles.active : ""}
            >
              Hide incomplete
            </button>
          </div>
        )}

        <div className={styles.pendingRounds}>
          {displayedRounds.length === 0 ? (
            <p className={styles.empty}>You have no pending rounds</p>
          ) : (
            <div className={styles.rounds}>
              <ul>
                {displayedRounds.map((round) => (
                  <li
                    key={round.roundKey}
                    className={`${styles.round} ${selected.has(round.roundKey) ? styles.selected : ""}`}
                    onClick={() => toggleSelect(round.roundKey)}
                  >
                    <div className={styles.roundInfo}>
                      <p className={styles.name}>{round.courseName}</p>
                      <div className={styles.settings}>
                        <div className={styles.setting}>
                          {moment(round.roundBegin).format("MMM DD, YYYY")}
                        </div>
                        <div className={styles.setting}>Par {round.par}</div>
                        <div className={styles.setting}>
                          {round.holeCount} holes
                        </div>
                        <div className={styles.setting}>
                          Score {round.total}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.buttons}>
          <Button children="Cancel" onClick={onClose} variant="secondary" />
          <Button
            children="Upload"
            onClick={handleImport}
            variant="lessonCard"
            disabled={rounds.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default GSProSync;
