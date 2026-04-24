import React, { useState } from "react";
import styles from "./MyBag.module.scss";
import usePopup from "@/hooks/usePopup";
import { uploadGolfBag } from "@/services/golf-bag/uploadGolfBag";
import { MyClubs } from "@/types/myClubs";
import Button from "../ui/button/Button";
import Popup from "../ui/popup/Popup";

type MyBagProps = {
  userId: string;
  myClubs?: MyClubs[];
};

const MyBag: React.FC<MyBagProps> = ({ userId, myClubs }) => {
  const [selectedClub, setSelectedClub] = useState<{
    type: string;
    abbr: string;
  } | null>(null);

  const [clubName, setClubName] = useState("");
  const [clubModel, setClubModel] = useState("");

  const clubSlots = [
    { id: 1, type: "Driver", abbr: "DR", hasClub: false },
    { id: 2, type: "3-Wood", abbr: "3W", hasClub: false },
    { id: 3, type: "5-Wood", abbr: "5W", hasClub: false },
    { id: 4, type: "3-Iron", abbr: "3I", hasClub: false },
    { id: 5, type: "4-Iron", abbr: "4I", hasClub: false },
    { id: 6, type: "5-Iron", abbr: "5I", hasClub: false },
    { id: 7, type: "6-Iron", abbr: "6I", hasClub: false },
    { id: 8, type: "7-Iron", abbr: "7I", hasClub: false },
    { id: 9, type: "8-Iron", abbr: "8I", hasClub: false },
    { id: 10, type: "9-Iron", abbr: "9I", hasClub: false },
    { id: 11, type: "Pitching Wedge", abbr: "PW", hasClub: false },
    { id: 12, type: "Sand Wedge", abbr: "SW", hasClub: false },
    { id: 13, type: "Lob Wedge", abbr: "LW", hasClub: false },
  ];

  const clubs = clubSlots.map((slot) => {
    const existingClub = myClubs?.find(
      (c: MyClubs) => c.club_type === slot.abbr,
    );

    return {
      ...slot,
      hasClub: !!existingClub,
      clubData: existingClub || null,
    };
  });

  const { popups, openPopup, closePopup } = usePopup();

  const handleClubClick = (club: { type: string; abbr: string }) => {
    setSelectedClub(club);
    openPopup("editBag");
  };

  const handleAddClub = async () => {
    if (!selectedClub) return;

    try {
      const newClub = await uploadGolfBag({
        userId,
        club_name: clubName,
        club_type: selectedClub.abbr,
        average_yards: 0,
        club_model: clubModel,
      });

      closePopup("editBag");
    } catch (error) {
      console.error("Error adding club:", error);
    }
  };

  const editBagPopupBody = (
    <div className={styles.editBagPopup}>
      <div className={styles.inputGroup}>
        <label htmlFor="clubName">Club Name</label>
        <input
          type="text"
          placeholder="Club name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="clubLoft">Club Model</label>
        <input
          type="text"
          placeholder="Club model"
          value={clubModel}
          onChange={(e) => setClubModel(e.target.value)}
        />
      </div>
      <div className={styles.buttons}>
        <Button variant="lessonCard" children="Save" onClick={handleAddClub} />
        <Button
          variant="secondary"
          children="Cancel"
          onClick={() => closePopup("editBag")}
        />
      </div>
    </div>
  );

  return (
    <div className={styles.myBag}>
      <div className={styles.header}>
        <div className={styles.title}>
          <p>My Bag</p>
          <span>
            14 slots - {clubs.filter((c) => c.clubData).length} clubs set up
          </span>
        </div>
        <div className={styles.edit}>
          <Button variant="lessonCard" children="Edit Bag" />
        </div>
      </div>
      <ul>
        {clubs.map((club) => (
          <li
            key={club.id}
            className={styles.clubItem}
            onClick={() => handleClubClick(club)}
          >
            <div
              className={
                club.hasClub
                  ? styles.hasClub + " " + styles.icon
                  : styles.noClub + " " + styles.icon
              }
            >
              <p>{club.abbr}</p>
            </div>
            <div className={styles.clubText}>
              <p>{club.type}</p>
              {club.hasClub && (
                <span>
                  {club.clubData?.club_name ?? "Unnamed Club"} ·{" "}
                  {club.clubData?.club_model ?? "Unknown Model"}
                </span>
              )}
            </div>
            {!club.hasClub ? (
              <div className={styles.addClub}>
                <p>Add Club</p>
              </div>
            ) : (
              <div className={styles.shotNumbers}>
                <p>100 shots</p>
              </div>
            )}
          </li>
        ))}
        <li>
          <div className={styles.icon + " " + styles.noClub}>
            <p>+</p>
          </div>
          <div className={styles.clubText}>
            <p>Add Club</p>
          </div>
          <div className={styles.addClub}>
            <p>Add Club</p>
          </div>
        </li>
      </ul>

      <Popup
        isOpen={popups["editBag"] || false}
        title="Edit My Bag"
        body={editBagPopupBody}
      />
    </div>
  );
};

export default MyBag;
