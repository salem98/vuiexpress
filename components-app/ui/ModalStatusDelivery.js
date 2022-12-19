import Check from "../../public/icons/check";
import CloseCircle from "../../public/icons/close-circle";
import LoadingSpinner from "../../public/icons/loading-spinner";
import Refresh from "../../public/icons/refresh";
import Button from "./Button";
import styles from "./ModalStatusDelivery.module.css";

const ModalStatusDelivery = (props) => {
  return (
    <div className={styles["container"]}>
      <div>
        <form className={styles["form-container"]}>
          <>
            <div className={styles["form-title"]}>Status Delivery</div>
            <div className={styles["form-text"]}>{props.getValue.noResi}</div>
            <div
              className={
                props.getValue.statusDelivery === "gagal" ? styles["form-icon-error"] : styles["form-icon-success"]
              }
            >
              {props.getValue.statusDelivery === "gagal" && <CloseCircle />}
              {props.getValue.statusDelivery === "diterima" && <Check />}
            </div>
            <div
              className={
                props.getValue.statusDelivery === "gagal" ? styles["form-field-error"] : styles["form-field-success"]
              }
            >
              {props.getValue.statusDelivery === "gagal" && "Paket Gagal Dikirim"}
              {props.getValue.statusDelivery === "diterima" && "Paket Telah Diterima"}
            </div>
            <div className={styles["form-foot-note"]}>
              {props.getValue.statusDelivery === "gagal" && "Note: " + props.getValue.keteranganDelivery}
              {props.getValue.statusDelivery === "diterima" && "Oleh: " + props.getValue.keteranganDelivery}
            </div>
          </>
        </form>
      </div>
      <div className={styles["backdrop"]} onClick={props.onCloseModal}></div>
    </div>
  );
};

export default ModalStatusDelivery;
