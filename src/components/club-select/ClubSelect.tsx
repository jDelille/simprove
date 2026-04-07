import React, { useEffect, useRef, useState } from "react";
import styles from "./ClubSelect.module.scss";
import { FaChevronDown } from "react-icons/fa6";

type ClubSelectProps = {
  clubs: string[];
  setSelectedClub: (club: string) => void;
  selectedClub: string;
};

const ClubSelect: React.FC<ClubSelectProps> = ({ clubs, setSelectedClub, selectedClub }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [openUp, setOpenUp] = useState(false);

  const handleClubSelect = (club: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClub(club);
    setIsOpen(false);
  };


  return (
    <ul className={styles.clubSelect}>
      {clubs.map((club) => (
        <li
          key={club}
          className={selectedClub === club ? styles.selected : ""}
          onClick={(e) => handleClubSelect(club, e)}
        >
          {club}
        </li>
      ))}
    </ul>
  );
};

export default ClubSelect;
