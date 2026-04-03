"use client";

import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import { useUser } from "@/hooks/useUser";
import { LuSun } from "react-icons/lu";
import useModal from "@/hooks/useModal";
import Modal from "../modal/Modal";
import UploadCsv from "../upload-csv/UploadCsv";
import { FaRegBell } from "react-icons/fa";
import Button from "../button/Button";
import { useState } from "react";
import UserMenu from "../user-menu/UserMenu";
import Avatar from "../avatar/Avatar";
import { FaChevronDown } from "react-icons/fa6";
import { createClient } from "@/lib/supabase/client";

type AuthAction = "login" | "signup" | "logout";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal, modals, closeModal } = useModal();
  const { theme, toggleTheme } = useTheme();
  const { user, loading, profile } = useUser();

  const supabase = createClient();

  const [openMenu, setOpenMenu] = useState(false);

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

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", key: 1 },
    { href: "/sessions", label: "Sessions", key: 2 },
    { href: "/training", label: "Training", key: 3 },
    // { href: "/community", label: "Community", key: 4 },
    // { href: "/challenges", label: "Challenges", key: 5 },
    // { href: "/about", label: "About", key: 6 },
  ];

  const hiddenPaths = ["/auth/login", "/auth/signup"];
  if (hiddenPaths.includes(pathname)) return null;

  const initials = profile?.display_name
    .split(/\s+/)
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <nav className={styles.navbar}>
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
            <LuSun
              size={18}
              className={styles.themeIcon}
              onClick={toggleTheme}
              color="var(--lightgray)"
            />

            {/* <FaRegBell color="var(--lightgray)" /> */}

            {!loading && !user && (
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
            {!loading && user && (
              <>
                <div className={styles.uploadBtnContainer}>
                  <Button
                    variant="lessonCard"
                    children="Upload"
                    onClick={() => openModal("upload")}
                  />
                </div>
                <div
                  className={styles.userAvatar}
                  onClick={() => setOpenMenu(!openMenu)}
                  style={
                    openMenu
                      ? {
                          outline: "1px solid var(--border)",
                        }
                      : undefined
                  }
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
        title="Upload Lauch Monitor Data"
        body={<UploadCsv />}
        description="Upload a CSV file file your launch monitor. (Trackman, FlightScope, Square Golf, etc.)"
      />
    </nav>
  );
};

export default Navbar;
