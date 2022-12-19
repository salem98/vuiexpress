import { useState, useEffect } from "react";
import styles from "./TextSlider.module.css";

const jumboText = [
  {
    title: "Percayakan Pengiriman Paket Anda Kepada Kami",
    subtitle:
      "Bista Cargo adalah perusahaan jasa angkutan yang profesional, kami pastikan pengiriman Anda menjadi MUDAH, MURAH, AMAN & CEPAT",
  },
  {
    title: "Jasa Kiriman Terbaik",
    subtitle:
      "Bista Cargo didukung oleh SDM yang berpengalaman yang akan memberikan pelayanan terbaik untuk pengiriman paket Anda",
  },
  {
    title: "Kembangkan bisnis anda bersama kami",
    subtitle:
      "Dengan layanan dan jaringan yang luas, Bista Cargo dapat menjadi solusi logistik terbaik untuk membantu meningkatkan bisnis Anda",
  },
];

const TextSlider = () => {
  const [radioChecked, setRadioChecked] = useState("radio3");
  const [counter, setCounter] = useState(1);
  const radioChangeHandler = (e) => {
    setRadioChecked(e.target.id);
  };

  useEffect(() => {
    // create a interval and get the id
    const myInterval = setInterval(() => {
      setCounter((prevCounter) => (prevCounter > 2 ? 1 : prevCounter + 1));
      setRadioChecked("radio" + counter);
    }, 5000);
    // clear out the interval using the id when unmounting the component
    return () => clearInterval(myInterval);
  }, [counter]);

  return (
    <div className={styles["slider"]}>
      <div className={`${styles["slides"]} ${radioChecked}`}>
        <input type="radio" name="radio-btn" id="radio1" onChange={radioChangeHandler} />
        <input type="radio" name="radio-btn" id="radio2" onChange={radioChangeHandler} />
        <input type="radio" name="radio-btn" id="radio3" onChange={radioChangeHandler} />

        <div className={styles["slide"]}>
          <h1>{jumboText[0].title}</h1>
          <p>{jumboText[0].subtitle}</p>
        </div>
        <div className={styles["slide"]}>
          <h1>{jumboText[1].title}</h1>
          <p>{jumboText[1].subtitle}</p>
        </div>
        <div className={styles["slide"]}>
          <h1>{jumboText[2].title}</h1>
          <p>{jumboText[2].subtitle}</p>
        </div>
      </div>

      <div className={styles["nav-manual"]}>
        <label
          htmlFor="radio1"
          className={
            radioChecked === "radio1" ? styles["manual-btn-checked"] : styles["manual-btn"]
          }
        ></label>
        <label
          htmlFor="radio2"
          className={
            radioChecked === "radio2" ? styles["manual-btn-checked"] : styles["manual-btn"]
          }
        ></label>
        <label
          htmlFor="radio3"
          className={
            radioChecked === "radio3" ? styles["manual-btn-checked"] : styles["manual-btn"]
          }
        ></label>
      </div>
    </div>
  );
};

export default TextSlider;
