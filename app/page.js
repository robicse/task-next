import styles from "./page.module.css";
import Category from "./components/Category";

export default function Home() {
  return (
    <div className={styles.page}>
      <Category />
    </div>
  );
}
