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
  const {user} = useUser();

  const handleProfileClick = () => {
    router.push(`/profile/${user?.id}`);
    setOpenMenu(false);
  }

  return (
    <div className={styles.menu}>
      <ul>
        <li className={styles.name}>
          <p>John Doe</p>
          <p className={styles.handle}>@john.doe</p>
        </li>
        <li onClick={handleProfileClick}>Profile</li>
        <li>Settings</li>
        <li onClick={onLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default UserMenu;
