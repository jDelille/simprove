import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
    
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2026 simprove. All rights reserved.</p>
        <div className={styles.links}>
            <ul>
                <li>
                  <Link href="https://github.com/jDelille/simprove" target="_blank" rel="noopener noreferrer">
                    Github
                  </Link>
                </li>
                <li>Version 1.0.0</li>
                <li>Powered by GSPro data</li>
            </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer