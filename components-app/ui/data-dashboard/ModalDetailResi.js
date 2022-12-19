import TrackingResult from "../../../components-user/TrackingResult";
import styles from "./ModalDetailResi.module.css";

const ModalDetailResi = (props) => {
  return (
    <div className={styles["container"]}>
      <div className={styles["content"]}>
        <TrackingResult dataResi={props.dataResi} />
      </div>
      <div className={styles["backdrop"]} onClick={props.onClose}></div>
    </div>
  );
};

export default ModalDetailResi;
