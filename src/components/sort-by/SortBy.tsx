import styles from "./SortBy.module.scss";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

type SortByProps = {
  options?: string[];
  numOfSessions: number;
  sortField?: "date" | "shots";
  setSortField?: (field: "date" | "shots") => void;
  sortOrder?: "asc" | "desc";
  setSortOrder?: (order: "asc" | "desc") => void;
};

const SortBy: React.FC<SortByProps> = ({
  options,
  numOfSessions,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) => {
  const handleClick = (option: string) => {
    const field = option === "Date" ? "date" : option === "Shot count" ? "shots" : "date";

    if (!setSortField || !setSortOrder) return;

    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className={styles.sortBy}>
      <p className={styles.label}>Sort by:</p>
      <ul>
        {options &&
          options.map((option, index) => {
            const field = option === "Date" ? "date" : option === "Shot count" ? "shots" : "date";
            const isActive = field === sortField;

            return (
              <li
                key={index}
                className={isActive ? styles.active : ""}
                onClick={() => handleClick(option)}
              >
                {option}{" "}
                {isActive ? (
                  sortOrder === "asc" ? (
                    <IoIosArrowRoundDown size={14} />
                  ) : (
                    <IoIosArrowRoundUp size={14} />
                  )
                ) : (
                  <IoIosArrowRoundDown size={14} style={{ opacity: 0.3 }} />
                )}
              </li>
            );
          })}
      </ul>

      <p className={styles.numOfSessions}>{numOfSessions} sessions</p>
    </div>
  );
};

export default SortBy;