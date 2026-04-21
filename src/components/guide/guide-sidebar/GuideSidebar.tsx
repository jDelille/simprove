import React from "react";
import guide from "@/lib/guide/guideContent.json";
import styles from "./GuideSidebar.module.scss";
import { FiTag } from "react-icons/fi";

type GuideSidebarProps = {
  setId: (path: string) => void;
  slug: string;
};

const GuideSidebar = ({ setId, slug }: GuideSidebarProps) => {
  const navGroups = [
    {
      id: "getting_started",
      label: "Getting started",
      links: [
        { id: 1, title: "User Guide", href: "user-guide", slug: "getting-started" },
        { id: 2, title: "Importing Data", href: "importing", slug: "importing" },
        { id: 3, title: "Setup", href: "setup", slug: "setup" },
      ],
    },
    // {
    //   id: "dashboard",
    //   label: "Dashboard",
    //   links: [
    //     { id: 4, title: "Your Data", href: "#your_data" },
    //     { id: 5, title: "Setup", href: "#setup" },
    //   ],
    // },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.version}>
        <div className={styles.icon}><FiTag size={16} /></div>
        <div className={styles.text}>
          <p>Latest Version</p>
          <span>Beta 1.0.7</span>
        </div>
      </div>
      {navGroups.map((group) => (
        <div className={styles.group} key={group.id}>
          <h4>{group.label}</h4>
          <ul>
            <li>
              {group.links.map((link) => (
                <div
                  key={link.id}
                  className={styles.link}
                  onClick={() => setId(link.href)}
                  style={slug === link.slug ? { color: "var(--text)" } : undefined}
                >
                  {link.title}
                </div>
              ))}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default GuideSidebar;
