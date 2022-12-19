import React from "react";
import styles from "./MainMenu.module.css";
import Search from "../public/icons/search";
import Home from "../public/icons/home";
import Money from "../public/icons/money";
import { useRouter } from "next/router";
const MainMenu = () => {
  const router = useRouter();

  const ongkirHandler = () => {
    router.push("/cek-tarif");
  };

  const trackingHandler = () => {
    router.push("/cek-paket");
  };

  return (
    <section className={styles["container"]}>
      <div className={`${styles["card"]} ${styles["black"]}`}>
        <div className={styles["icon"]}>
          <Search />
        </div>
        <div className={styles["text"]} onClick={trackingHandler}>
          <h1>Check Shipment</h1>
          <p>Kiểm tra vận đơn của bạn</p>
        </div>
      </div>
      <div className={`${styles["card"]} ${styles["red"]}`} onClick={ongkirHandler}>
        <div className={styles["icon"]}>
          <Money />
        </div>
        <div className={styles["text"]}>
          <h1>Check Rates</h1>
          <p>Xem giá cước Shipmai</p>
        </div>
      </div>
      <div className={`${styles["card"]} ${styles["black"]}`}>
        <div className={styles["icon"]}>
          <Home />
        </div>
        <div className={styles["text"]}>
          <h1>Kho</h1>
          <p>Xem địa chỉ kho</p>
        </div>
      </div>
    </section>
  );
};

export default MainMenu;
