import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { uploadSession } from "@/services/sessions/uploadSession";
import Button from "../button/Button";
import Papa from "papaparse";
import styles from "./UploadCsv.module.scss";

type UploadCsvProps = {
  userId: string;
  onClose: () => void;
};

const UploadCsv = ({ userId, onClose }: UploadCsvProps) => {
  const [sessionName, setSessionName] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString());
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    shotCount: number;
    clubs: string[];
  } | null>(null);
  const [shots, setShots] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const REQUIRED_COLUMNS = [
    "AoA",
    "BackSpin",
    "BallSpeed",
    "Carry",
    "Club",
    "Decent",
    "DistanceToPin",
    "DynamicLoft",
    "FaceToPath",
    "FaceToTarget",
    "HI",
    "HLA",
    "Loft",
    "Offline",
    "Path",
    "PeakHeight",
    "SideSpin",
    "TotalDistance",
    "VI",
    "VLA",
  ];

  const extractDateFromFilename = (filename: string): string => {
    const regex = /(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/;
    const match = filename.match(regex);

    if (match) {
      const [, month, day, year, hour, minute, second] = match;

      const fullYear = `20${year}`;

      const isoDate = new Date(
        `${fullYear}-${month}-${day}T${hour}:${minute}:${second}`,
      ).toISOString();

      return isoDate;
    }

    console.warn("No date found in filename. Using current date.");
    return new Date().toISOString();
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!userId) return console.error("User not logged in");

      for (const file of acceptedFiles) {
        const text = await file.text();

        const newDate = extractDateFromFilename(file.name);

        const result = Papa.parse(text, { header: true, skipEmptyLines: true });

        const headers = result.meta.fields ?? [];
        const missingColumns = REQUIRED_COLUMNS.filter(
          (col) => !headers.includes(col),
        );

        if (missingColumns.length > 0) {
          setError(
            `Invalid file. Missing columns: ${missingColumns.join(", ")}`,
          );
          return;
        }

        setError(null);

        const parsedShots = result.data.map((row: any) => ({
          aoa: Number(row["AoA"]),
          backSpin: Number(row["BackSpin"]),
          ballSpeed: Number(row["BallSpeed"]),
          carry: Number(row["Carry"]),
          club: String(row["Club"]),
          decent: Number(row["Decent"]),
          distanceToPin: String(row["DistanceToPin"]),
          dynamicloft: Number(row["DynamicLoft"]),
          faceToPath: Number(row["FaceToPath"]),
          faceToTarget: Number(row["FaceToTarget"]),
          hi: Number(row["HI"]),
          hla: Number(row["HLA"]),
          loft: Number(row["Loft"]),
          offline: Number(row["Offline"]),
          path: Number(row["Path"]),
          peakHeight: Number(row["PeakHeight"]),
          sideSpin: Number(row["SideSpin"]),
          totalDistance: Number(row["TotalDistance"]),
          vi: Number(row["VI"]),
          vla: Number(row["VLA"]),
        }));

        setShots(parsedShots);
        setSessionDate(newDate);

        setFileInfo({
          name: file.name,
          shotCount: parsedShots.length,
          clubs: [...new Set(parsedShots.map((s) => s.club))],
        });
      }
    },
    [userId],
  );

  const handleUpload = async () => {
    if (!userId) return;
    if (!sessionName) return setError("Session name is required");
    if (!shots.length) return setError("Please upload a valid CSV file first");

    try {
      const jsonString = JSON.stringify({ sessionName, shots });
      const session = await uploadSession({
        userId,
        jsonString,
        sessionName,
        sessionDate,
      });

      if (!session?.id) {
        throw new Error("Session not created properly");
      }
    } catch (error) {
      console.error("Error uploading session:", error);
      throw error;
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
  });

  return (
    <div className={styles.container}>
      {error && <p className={styles.error}>{error}</p>}

      <label htmlFor="name">Session Name:</label>
      <input
        type="text"
        id="name"
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
      />

      {fileInfo && (
        <div className={styles.fileInfo}>
          <p>{fileInfo.name}</p>
          {/* <p>
            <strong>Shots:</strong> {fileInfo.shotCount}
          </p>
          <p>
            <strong>Clubs:</strong> {fileInfo.clubs.join(", ")}
          </p> */}

          <div className={styles.removeFile} onClick={() => setFileInfo(null)}>
            
          </div>
        </div>
      )}

      {!fileInfo && (
        <div {...getRootProps()} className={styles.dropzone}>
          <input {...getInputProps()} />
          <MdOutlineFileUpload size={50} color="#4a556541" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className={styles.text}>
              <p className={styles.label}>
                <span>Click to upload</span> or drag and drop
              </p>
              <p className={styles.description}>Supports CSV files only</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.buttons}>
        <Button children="Cancel" onClick={onClose} variant="secondary" />
        <Button children="Upload" onClick={handleUpload} variant="lessonCard" />
      </div>
    </div>
  );
};

export default UploadCsv;
