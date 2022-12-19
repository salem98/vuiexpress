import styles from "./Info.module.css";
import Phone from "../public/icons/phone";
import Email from "../public/icons/email";
import Chat from "../public/icons/chat";

const Info = () => {
  return (
    <div className={styles["wrapper"]}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#000000"
          fillOpacity="1"
          d="M0,32L26.7,69.3C53.3,107,107,181,160,181.3C213.3,181,267,107,320,96C373.3,85,427,139,480,149.3C533.3,160,587,128,640,112C693.3,96,747,96,800,85.3C853.3,75,907,53,960,69.3C1013.3,85,1067,139,1120,165.3C1173.3,192,1227,192,1280,181.3C1333.3,171,1387,149,1413,138.7L1440,128L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
        ></path>
      </svg>
      <div className={styles["container"]}>
        <div className={styles["kontak"]}>
          <div className={styles["detail-kontak"]}>
            <span className={styles["icon"]}>
              <Phone />
            </span>
            <div className={styles["text"]} id="kontak">
              <p>Call Center</p>
              <h5>0123-4567-8910</h5>
            </div>
          </div>
          <div className={styles["detail-kontak"]}>
            <span className={styles["icon"]}>
              <Email />
            </span>
            <div className={styles["text"]}>
              <p>Email</p>
              <h5>marketing@bistacargo.com</h5>
            </div>
          </div>
          <div className={styles["detail-kontak"]}>
            <span className={styles["icon"]}>
              <Chat />
            </span>
            <div className={styles["text"]}>
              <p>Whatsapp</p>
              <h5>0878-4621-4666</h5>
            </div>
          </div>
        </div>
        <div className={styles["link"]}>
          <h3>Informasi</h3>
          <ul>
            <li>Syarat & Ketentuan</li>
            <li>Kebijakan Privasi</li>
            <li>Lacak Pengiriman</li>
            <li>Cek Ongkir</li>
            <li>Pusat Bantuan</li>
          </ul>
        </div>
        <div className={styles["social"]}>
          <h3>Social Media</h3>
          <div className={styles["social-detail"]}>
            <img className={styles["socmed-icon"]} src="icons/facebook.svg" alt="facebook logo" />
            <img className={styles["socmed-icon"]} src="icons/instagram.svg" alt="instagram logo" />
            <img className={styles["socmed-icon"]} src="icons/twitter.svg" alt="twitter logo" />
            <img className={styles["socmed-icon"]} src="icons/tiktok.svg" alt="tiktok logo" />
            <img className={styles["socmed-icon"]} src="icons/linkedin.svg" alt="linkedin logo" />
            <img className={styles["socmed-icon"]} src="icons/whatsapp.svg" alt="whatsapp logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
