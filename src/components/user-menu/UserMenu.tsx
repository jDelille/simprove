"use client";

import { useRouter } from "next/navigation";
import styles from "./UserMenu.module.scss";
import { useUser } from "@/hooks/useUser";

type UserMenuProps = {
  onLogout: () => void;
  setOpenMenu: (open: boolean) => void;
};

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, setOpenMenu }) => {

  const router = useRouter();
  const {user, profile} = useUser();

  const handleLinkClick = (href: string) => {
    router.push(href);
    setOpenMenu(false);
  }

  return (
    <div className={styles.menu}>
      <ul>
        <li className={styles.name}>
          <p>{profile?.display_name}</p>
          <p className={styles.handle}>@{profile?.username}</p>
        </li>
        <li onClick={() => handleLinkClick('/dashboard')}>Dashboard</li>
        <li onClick={() => handleLinkClick('/sessions')}>Sessions</li>
        <li onClick={() => handleLinkClick('/training')}>Training</li>
        <li onClick={() => handleLinkClick(`/profile/${profile?.id}`)}>Profile</li>
        <li onClick={() => handleLinkClick('/settings/edit-profile')}>Settings</li>
        <li onClick={() => handleLinkClick('/about')}>About</li>
        <li onClick={onLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default UserMenu;
