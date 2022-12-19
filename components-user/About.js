import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles["container"]}>
      <div className={styles["img-container"]}>
        <img src="images/bista-logo-300.png" alt="bista logo" />
      </div>
      <svg className={styles["waves"]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#fff"
          fillOpacity="1"
          d="M0,192L26.7,176C53.3,160,107,128,160,133.3C213.3,139,267,181,320,213.3C373.3,245,427,267,480,250.7C533.3,235,587,181,640,181.3C693.3,181,747,235,800,234.7C853.3,235,907,181,960,144C1013.3,107,1067,85,1120,90.7C1173.3,96,1227,128,1280,133.3C1333.3,139,1387,117,1413,106.7L1440,96L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
        ></path>
      </svg>
      <div className={styles["txt-container"]}>
        <h1 id="about">Kenapa Harus Menggunakan Bista Cargo?</h1>
        <p>
          Bista Cargo adalah perusahaan yang bergerak dalam bidang usaha jasa angkutan barang yang
          profesional, dengan jangkauan pengiriman yang luas, dengan pilihan layanan darat atau
          laut, kami pastikan pengiriman barang Anda akan terasa sangat mudah dan murah, tidak hanya
          itu, dengan dukungan SDM yang berpengalaman, kami jamin kecepatan, ketepatan dan keamanan
          barang Anda
        </p>
      </div>
    </div>
  );
};

export default About;
