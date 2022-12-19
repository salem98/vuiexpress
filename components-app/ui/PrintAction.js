import resiPdf from "../../helpers/resiPdf";
import labelPdf from "../../helpers/labelPdf";
import strukPdf from "../../helpers/strukPdf";

import Button from "../../components-app/ui/Button";
import Printer from "../../public/icons/printer";
import Check from "../../public/icons/check";
import CloseCircle from "../../public/icons/close-circle";

import styles from "./PrintAction.module.css";

const PrintAction = (props) => {
  return (
    <div className={styles["container"]}>
      <div
        className={styles["close-icon"]}
        onClick={() => {
          props.onClose();
          props.onReset();
        }}
      >
        <CloseCircle />
      </div>
      <div className={styles["success-icon"]}>
        <Check />
        <p>Data Resi Berhasil Disimpan</p>
      </div>
      <div className={styles["action-btn"]}>
        <Button clickHandler={() => resiPdf(props.data)} label="Cetak Resi" color="red" width="" icon={<Printer />} />
        <Button
          clickHandler={() => labelPdf(props.data)}
          label="Cetak Label"
          color="blue"
          width=""
          icon={<Printer />}
        />
        <Button
          clickHandler={() => strukPdf(props.data)}
          label="Cetak Struk"
          color="orange"
          width=""
          icon={<Printer />}
        />
      </div>
    </div>
  );
};

export default PrintAction;
