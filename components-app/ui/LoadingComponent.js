import LoadingSpinner from "../../public/icons/loading-spinner";
import styles from "./LoadingComponent.module.css";

const LoadingComponent = () => {
  return (
    <div className={styles["container"]}>
      <LoadingSpinner />
    </div>
  );
};

export default LoadingComponent;
