import React, { useEffect, useState } from "react";
import styles from "./Jumbotron.module.css";
import TextSlider from "./TextSlider";

const Jumbotron = () => {
  return (
    <header className={styles["container"]}>
      <div>
        <img
          className={styles["jumbo-img"]}
          src="images/jumbotron.jpg"
          alt="kepercayaan konsumen"
        ></img>
      </div>
      <div className={styles["jumbo-txt"]}>
        <TextSlider />
      </div>
    </header>
  );
};

export default Jumbotron;
