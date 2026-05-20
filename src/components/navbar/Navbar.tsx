"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import useModal from "@/hooks/useModal";
import UploadCsv from "../upload-csv/UploadCsv";
import React, { useState } from "react";
import UserMenu from "../user-menu/UserMenu";
import { FaChevronDown } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types/profile";
import GSProSync from "../gspro/gspro-sync/GSProSync";
import Avatar from "../ui/avatar/Avatar";
import Modal from "../ui/modal/Modal";
import { LiaSyncAltSolid } from "react-icons/lia";
import { GrUploadOption } from "react-icons/gr";
import { FaRegBell } from "react-icons/fa6";
import NotificationsDropdown from "../notifications-dropdown/NotificationsDropdown";
import { getInitials } from "@/lib/getInitials";

type AuthAction = "login" | "signup" | "logout";

type NavbarProps = {
  profile: Profile | null;
  notifications: any[];
};

const Navbar: React.FC<NavbarProps> = ({ profile, notifications }) => {
  const { openModal, modals, closeModal } = useModal();
  const [openMenu, setOpenMenu] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleAuthClick = async (type: AuthAction) => {
    if (type === "login") {
      router.push("/auth/login");
    } else if (type === "signup") {
      router.push("/auth/signup");
    } else if (type === "logout") {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        router.push("/auth/login");
      }
    }

    setOpenMenu(false);
  };

const hasNotifications = notifications.filter((n) => n.is_read).length;
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", key: 1 },
    { href: "/activities", label: "Activities", key: 3 },
    { href: "/missions", label: "Missions", key: 4 },
    { href: `/profile/${profile?.username}`, label: "Profile", key: 5 },
  ];

  const hiddenPaths = ["/auth/login", "/auth/signup"];
  if (hiddenPaths.includes(pathname)) return null;

  const initials = getInitials(profile && profile.display_name || "");

  const handleOpenDropdown = async () => {
    const isOpening = !openNotifications;
    setOpenNotifications(isOpening);
  };

  return (
    <nav className={styles.navbar} id="navbar">
      <div className={styles.navbarContent}>
        <Link href={"/dashboard"} className={styles.logo}>
          simprove
        </Link>

        <div className={styles.navbarActions}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link
                  className={
                    pathname.includes(link.href)
                      ? styles.activeNavLink
                      : styles.navLink
                  }
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.navbarAuth}>
          <div className={styles.navbarAuth}>
            {!profile && (
              <>
                <button
                  className={styles.authButton}
                  onClick={() => handleAuthClick("login")}
                >
                  Login
                </button>
                <button
                  className={styles.authButton}
                  onClick={() => handleAuthClick("signup")}
                >
                  Sign Up
                </button>
              </>
            )}
            {profile && (
              <>
                <div className={styles.notificationContainer}>
                  <FaRegBell
                    size={19}
                    color="var(--lightgray)"
                    onClick={handleOpenDropdown}
                    className={styles.bellIcon}
                  />
                  {hasNotifications < 0 && <div className={styles.dot}>{hasNotifications}</div>}

                  {openNotifications && (
                    <NotificationsDropdown
                      notifications={notifications}
                      userId={profile.id}
                    />
                  )}
                </div>
                <div className={styles.uploadBtnContainer} id="upload-btn">
                  <GrUploadOption
                    onClick={() => openModal("upload")}
                    size={18}
                    color="var(--lightgray)"
                  />
                </div>
                <div className={styles.syncBtnContainer} id="sync-btn">
                  <LiaSyncAltSolid
                    onClick={() => openModal("sync")}
                    size={20}
                    color="var(--lightgray)"
                  />
                </div>
                <div
                  className={styles.userAvatar}
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  {profile && (
                    <Avatar
                      src={profile?.avatar_path}
                      initials={initials}
                      size="small"
                    />
                  )}
                  <FaChevronDown size={16} color="var(--lightgray)" />
                </div>

                {openMenu && (
                  <UserMenu
                    onLogout={() => handleAuthClick("logout")}
                    setOpenMenu={setOpenMenu}
                    profile={profile}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modals["upload"] || false}
        onClose={() => closeModal("upload")}
        title="Upload your session data"
        body={
          <UploadCsv
            userId={profile?.id as string}
            onClose={() => closeModal("upload")}
          />
        }
        description="Upload a CSV file from your launch monitor software."
      />

      <Modal
        isOpen={modals["sync"] || false}
        onClose={() => closeModal("sync")}
        title="Sync your GSPro Data"
        body={
          <GSProSync
            userId={profile?.id as string}
            syncToken={profile?.sync_token || ""}
            onClose={() => closeModal("sync")}
          />
        }
        description="Sync with GSPro Portal and import your round data"
      />
    </nav>
  );
};

export default Navbar;
