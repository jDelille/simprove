import styles from './Stat.module.scss';

type StatProps = {
    label: string;
    value: string | number;
    metric: string;
}

const Stat: React.FC<StatProps> = ({ label, value, metric }) => {
  return (
    <div className={styles.stat}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value} <span className={styles.metric}>{metric}</span></p>
    </div>
  )
}

export default Stat