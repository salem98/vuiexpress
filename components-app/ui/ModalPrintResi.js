import PrintoutResi from "./PrintoutResi";
import PrintoutStruk from "./PrintoutStruk";
import PrintAction from "./PrintAction";
import LoadingSaveResi from "./LoadingSaveResi";
import styles from "./ModalPrintResi.module.css";
import { useEffect, useState } from "react";

const ModalPrintResi = ({ onEdit, onPrint, data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 760) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);
  const uploadDataHandler = () => {
    setIsLoading(true);
    fetch("/api/data-resi/post-resi", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setUploadDone(true);
      });
  };
  return (
    <div className={styles["container"]}>
      <div className={styles["backdrop"]}></div>
      {uploadDone || isLoading ? null : (
        <div className={styles["head-note"]}>
          <p>
            Cek & konfirmasi kembali terkait data yang diberikan pelanggan, jika sudah sesuai silahkan klik tombol
            "SIMPAN" maka transaksi akan tersimpan dan tidak dapat dibatalkan. Silahkan klik tombol "EDIT" jika masih
            ada data yang harus direvisi.
          </p>
          <button className={styles["btn-primary"]} onClick={uploadDataHandler}>
            Simpan
          </button>
          <button className={styles["btn-secondary"]} onClick={onEdit}>
            Edit
          </button>
        </div>
      )}

      <div className={styles["display"]}>
        {!isLoading && !uploadDone ? isMobile ? <PrintoutStruk data={data} /> : <PrintoutResi data={data} /> : null}
        {isLoading && !uploadDone ? <LoadingSaveResi /> : null}
        {uploadDone ? <PrintAction data={data} onClose={onEdit} onReset={onPrint} /> : null}
      </div>
    </div>
  );
};

export default ModalPrintResi;
