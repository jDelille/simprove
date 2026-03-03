"use client";

import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase/client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import { useUser } from "@/hooks/useUser";
import { LuSun } from "react-icons/lu";
import useModal from "@/hooks/useModal";
import Modal from "../modal/Modal";
import UploadCsv from "../upload-csv/UploadCsv";

type AuthAction = "login" | "signup" | "logout";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openModal, modals, closeModal } = useModal();
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useUser();

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
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", key: 1 },
    { href: "/sessions", label: "Sessions", key: 2 },
    { href: "/training", label: "Training", key: 3 },
    { href: "/community", label: "Community", key: 4 },
    { href: "/challenges", label: "Challenges", key: 5 },
    { href: "/about", label: "About", key: 6 },
  ];

  const hiddenPaths = ["/auth/login", "/auth/signup"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <h1 className={styles.logo}>simprove</h1>

        <div className={styles.navbarActions}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link className={styles.navLink} href={link.href}>
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
            />

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
                  <button
                    children="Upload"
                    onClick={() => openModal("upload")}
                  />
                </div>
                <div
                  className={styles.userAvatar}
                  onClick={() => router.push("/profile")}
                ></div>
                <button
                  className={styles.authButton}
                  onClick={() => handleAuthClick("logout")}
                >
                  Logout
                </button>
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
