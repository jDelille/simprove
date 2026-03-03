import styles from './SortBy.module.scss';
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

type SortByProps = {
    options?: string[];
}

const SortBy: React.FC<SortByProps> = ({ options }) => {
  return (
    <div className={styles.sortBy}>
        <p className={styles.label}>Sort by:</p>
        <ul>
            {options && options.map((option, index) => (
                <li key={index}>{option} <FaArrowDown size={8} /></li>
            ))}
        </ul>
    </div>
  )
}

export default SortBy