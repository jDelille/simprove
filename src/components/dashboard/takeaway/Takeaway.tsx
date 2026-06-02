import styles from "./Takeaway.module.scss";

const Takeaway = ({ takeaway }: { takeaway: any }) => {
  return (
    <div className={styles.takeaway}>
      <div className={styles.icon}>
        <p>⚡</p>
      </div>
      <div className={styles.content}>
        <span>Todays Takeaway</span>
        <p>
          {takeaway.insight}
        </p>
      </div>
    </div>
  );
};

export default Takeaway;
