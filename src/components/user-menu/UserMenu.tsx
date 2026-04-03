"use client";

import { useRouter } from "next/navigation";
import styles from "./UserMenu.module.scss";
import { useUser } from "@/hooks/useUser";
import { MdOutlineSpaceDashboard, MdOutlineLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineSchool } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { BsFileBarGraph } from "react-icons/bs";
import { MdOutlineHelpOutline } from "react-icons/md";
import { RiComputerLine } from "react-icons/ri";
import { IoSunnyOutline } from "react-icons/io5";
import { LuMoonStar } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";

type UserMenuProps = {
  onLogout: () => void;
  setOpenMenu: (open: boolean) => void;
};

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, setOpenMenu }) => {
  const router = useRouter();
  const { user, profile } = useUser();

  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleLinkClick = (href: string) => {
    router.push(href);
    setOpenMenu(false);
  };

  return (
    <div className={styles.menu}>
      <ul>
        <div className={styles.name}>
          <p>{profile?.display_name}</p>
          <p className={styles.handle}>@{profile?.username}</p>
        </div>
        <div className={styles.links}>
          <li
            onClick={() => handleLinkClick("/dashboard")}
            className={styles.mobile}
          >
            Dashboard
            <MdOutlineSpaceDashboard size={18} color="var(--lightgray)" />
          </li>
          <li
            onClick={() => handleLinkClick("/sessions")}
            className={styles.mobile}
          >
            Sessions
            <BsFileBarGraph size={18} color="var(--lightgray)" />
          </li>
          <li
            onClick={() => handleLinkClick("/training")}
            className={styles.mobile}
          >
            Training
            <MdOutlineSchool size={18} color="var(--lightgray)" />
          </li>
          <li onClick={() => handleLinkClick(`/profile/${profile?.id}`)}>
            Profile
            <FaRegUserCircle size={17} color="var(--lightgray)" />
          </li>
          <li onClick={() => handleLinkClick("/settings/edit-profile")}>
            Settings
            <IoSettingsOutline size={18} color="var(--lightgray)" />
          </li>
          <li onClick={() => handleThemeToggle()}>
            Theme
            {theme === "dark" ? (
              <IoSunnyOutline size={18} color="var(--lightgray)" />
            ) : (
              <LuMoonStar size={18} color="var(--lightgray)" />
            )}
          </li>
          <li onClick={() => handleLinkClick("/about")}>
            About <MdOutlineHelpOutline size={18} color="var(--lightgray)" />
          </li>
          <li onClick={onLogout}>
            Logout <MdOutlineLogout size={18} color="var(--lightgray)" />
          </li>
        </div>
      </ul>
    </div>
  );
};

export default UserMenu;
