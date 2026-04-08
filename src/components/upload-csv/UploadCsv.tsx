import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { uploadSession } from "@/services/sessions/uploadSession";
import Button from "../button/Button";import Papa from "papaparse";
import styles from "./UploadCsv.module.scss";

type UploadCsvProps = {
  userId: string;
};

const UploadCsv = ({ userId }: UploadCsvProps) => {
  const [sessionName, setSessionName] = useState("");
  const [sessionDate, setSessionDate] = useState(new Date().toISOString());
  const [shots, setShots] = useState<any[]>([]);

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
      }
    },
    [userId],
  );

  const handleUpload = async () => {
    if (!userId) return;
    if (!sessionName) return console.error("Session name is required");
    if (!shots.length) return console.error("No shots to upload");

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className={styles.container}>
      <label htmlFor="name">Session Name:</label>
      <input
        type="text"
        id="name"
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
      />
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        <MdOutlineFileUpload size={50} color="#4a556541" />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drop your file here or click to browse <span>Supports CSV</span>
          </p>
        )}
      </div>
      <Button children="Upload" onClick={handleUpload} variant="primary" />
    </div>
  );
};

export default UploadCsv;
