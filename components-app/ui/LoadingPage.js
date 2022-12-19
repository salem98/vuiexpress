import LoadingSpinner from "../../public/icons/loading-spinner";
import styles from "./LoadingPage.module.css";

const LoadingPage = () => {
  return (
    <div className={styles["container"]}>
      <LoadingSpinner />
    </div>
  );
};

export default LoadingPage;
