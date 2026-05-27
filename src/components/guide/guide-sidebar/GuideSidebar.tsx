"use client";

import styles from "./GuideSidebar.module.scss";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaAngleDown } from "react-icons/fa6";

const GuideSidebar = () => {
  const pathname = usePathname();

  const initialOpen = guides.reduce(
    (acc, section) => {
      acc[section.slug] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(initialOpen);

  const toggleSection = (slug: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul>
          {guides.map((section) => (
            <li key={section.slug} className={styles.section}>
              <button
                className={`${styles.sectionLabel} ${
                  openSections[section.slug] ? styles.open : ""
                }`}
                onClick={() => toggleSection(section.slug)}
              >
                {section.section}

                <FaAngleDown
                  className={styles.chevron}
                  size={10}
                  style={{
                    transform: openSections[section.slug]
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections[section.slug] && (
                <ul className={styles.sectionList}>
                  {section.links.map((link) => {
                    const href = `/guide/${section.slug}/${link.slug}`;

                    const isActive = pathname === href;

                    return (
                      <li key={link.slug}>
                        <Link
                          href={href}
                          className={`${styles.link} ${
                            isActive ? styles.active : ""
                          }`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default GuideSidebar;
