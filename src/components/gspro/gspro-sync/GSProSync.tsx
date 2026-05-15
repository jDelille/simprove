"use client";

import { useEffect, useState } from "react";
import styles from "./GSProSync.module.scss";
import moment from "moment";
import { uploadGSProRound } from "@/services/gspro/uploadGSProRound";
import { MdInfoOutline } from "react-icons/md";
import { FaLongArrowAltDown, FaLongArrowAltRight } from "react-icons/fa";
import Button from "@/components/ui/button/Button";
import Link from "next/link";

const STORAGE_KEY = "pendingRounds";

type GSProSyncProps = {
  onClose: () => void;
  userId: string;
  syncToken: string;
};

const GSProSync = ({ onClose, userId, syncToken }: GSProSyncProps) => {
  const [rounds, setRounds] = useState<any[]>([]);
  const [hideIncomplete, setHideIncomplete] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rawData, setRawData] = useState<any>(null);

  const fetchRounds = async () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedRaw = localStorage.getItem("gsproRawData");

    // Instant UI hydration
    if (saved) {
      setRounds(JSON.parse(saved));

      if (savedRaw) {
        setRawData(JSON.parse(savedRaw));
      }
    }

    // Fresh backend fetch
    const res = await fetch("/api/gspro/ingest");
    const json = await res.json();

    const incoming = json?.[0]?.gsproData?.Rounds_Rounds ?? [];

    if (incoming.length > 0) {
      setRounds(incoming);
      setRawData(setRawData(json[0].gsproData));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming));
      localStorage.setItem("gsproRawData", JSON.stringify(json[0].gsproData));
    }

    console.log("Rounds state about to set:", incoming);
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

  const scorecardByRound = new Map<string, any[]>();

  rawData?.RoundScorecards?.forEach((row: any) => {
    if (!scorecardByRound.has(row.roundKey)) {
      scorecardByRound.set(row.roundKey, []);
    }
    scorecardByRound.get(row.roundKey)!.push(row);
  });

  const handleImport = async () => {
    const toImport = displayedRounds.filter((r) => selected.has(r.roundKey));

    const holeRows = toImport.flatMap((round) => {
      const scorecardRows = scorecardByRound.get(round.roundKey) ?? [];
      const teeLabels = [
        "Blue",
        "Green",
        "Red",
        "White",
        "Gold",
        "Black",
        "Yellow",
      ];

      const courseRow = scorecardRows.find(
        (s) => s.playerKey === null && teeLabels.includes(s.rowLabel),
      );
      const parRow = scorecardRows.find(
        (s) => s.playerKey === null && s.rowLabel === "Par",
      );

      const indexRow = scorecardRows.find(
        (s) => s.playerKey === null && s.rowLabel === "Index",
      );

      const playerRow = scorecardRows.find((s) => s.playerKey !== null);

      if (!courseRow || !playerRow) return [];

      const holeCount = playerRow?.holeValue
        ? Object.keys(playerRow.holeValue).filter(
            (k) =>
              playerRow.holeValue[k] !== null && playerRow.holeValue[k] !== "",
          ).length
        : 18;

      return Array.from({ length: holeCount }).map((_, i) => {
        const hole = i + 1;

        return {
          round_key: round.roundKey,
          hole_number: hole,

          // tee distance
          distance: courseRow?.holeValue?.[hole]
            ? Number(courseRow.holeValue[hole])
            : null,

          // player strokes
          strokes: playerRow?.holeValue?.[hole]
            ? Number(playerRow.holeValue[hole])
            : null,

          // par per hole
          par: parRow?.holeValue?.[hole]
            ? Number(parRow.holeValue[hole])
            : null,

          // hole index (handicap ranking)
          index: indexRow?.holeValue?.[hole]
            ? Number(indexRow.holeValue[hole])
            : null,
        };
      });
    });
    await uploadGSProRound({
      userId,
      rounds: toImport,
      allScores: rawData?.RoundScores ?? [],
      holes: holeRows,
    });

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("gsproRawData");
    setRounds([]);
    setSelected(new Set());
    onClose();
  };

  return (
    <div className={styles.gsproSync}>
      <div className={styles.token}>
        <p className={styles.title}>Your Sync Token</p>
        <div className={styles.tokenCopy}>
          <p className={styles.tokenValue}>{syncToken}</p>
          <button
            onClick={() => navigator.clipboard.writeText(syncToken)}
            className={styles.copyBtn}
          >
            Copy
          </button>
        </div>
        <div className={styles.tokenDescription}>
          <p>Paste this into the GSPro Sync extension to link your account.</p>
          <Link href="#" target="_blank">
            Get extension
          </Link>
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
