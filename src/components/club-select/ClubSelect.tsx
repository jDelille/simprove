import React, { useEffect, useRef, useState } from "react";
import styles from "./ClubSelect.module.scss";
import { FaChevronDown } from "react-icons/fa6";

type ClubSelectProps = {
  clubs: string[];
  setSelectedClub: (club: string) => void;
  selectedClub: string;
};

const ClubSelect: React.FC<ClubSelectProps> = ({
  clubs,
  setSelectedClub,
  selectedClub,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [openUp, setOpenUp] = useState(false);

  const handleClubSelect = (club: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClub(club);
    setIsOpen(false);
  };

  return (
    <div className={styles.clubSelect}>
      <div className={styles.selectedClub} onClick={() => setIsOpen(!isOpen)}>
        <p>{selectedClub}</p>
        <FaChevronDown />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul>
            {clubs.map((club) => (
              <li className={styles.club} key={club} onClick={(e) => handleClubSelect(club, e)}>{club}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClubSelect;
