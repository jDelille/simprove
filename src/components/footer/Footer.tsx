import Link from 'next/link';
import styles from './Footer.module.scss';

const Footer = () => {
    
    // const links = ["Privacy Policy", "Terms of Service", "Contact Us", "Status"];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>&copy; 2023 simprove. All rights reserved.</p>
        <div className={styles.links}>
            {/* <ul>
                {links.map((link) => (
                    <li key={link}>
                        <Link href="#">{link}</Link>
                    </li>
                ))}
            </ul> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer