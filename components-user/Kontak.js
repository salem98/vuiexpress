import styles from "./Kontak.module.css";
import Chat from "../public/icons/chat";

const Kontak = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["text"]}>
        <h1>Ayo, gunakan Bista Cargo sekarang...</h1>
        <p>Berbagai pilihan layanan dan harga yang dapat disesuaikan dengan kebutuhan Anda</p>
        <button className={styles["kontak-btn"]}>
          <span className={styles["btn-icon"]}>
            <Chat />
          </span>
          <p className={styles["btn-txt"]}>Hubungi kami</p>
        </button>
      </div>
      <img className={styles["indomap"]} src="images/indonesia-map.png" />
    </div>
  );
};

export default Kontak;
