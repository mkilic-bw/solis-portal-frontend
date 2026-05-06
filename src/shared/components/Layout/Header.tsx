import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <span className={styles.logo}>solis</span>
      <nav className={styles.nav}>
        {/* TODO: navigation */}
      </nav>
      <button type="button" className={styles.signIn}>
        Sign in
      </button>
    </header>
  );
}
