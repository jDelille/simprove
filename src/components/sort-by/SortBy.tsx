import styles from "./SortBy.module.scss";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

type SortByProps = {
  options?: string[];
  sortField?: "date" | "shots";
  setSortField?: (field: "date" | "shots") => void;
  sortOrder?: "asc" | "desc";
  setSortOrder?: (order: "asc" | "desc") => void;
  isEmpty: boolean;
};

const SortBy: React.FC<SortByProps> = ({
  options,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  isEmpty
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
                onClick={isEmpty ? undefined : () => handleClick(option)}
                style={isEmpty ? {cursor: "default", color: "var(--lightgray)"} : {cursor: "pointer"}}
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

    </div>
  );
};

export default SortBy;