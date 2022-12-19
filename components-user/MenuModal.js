import React from "react";
import styles from "./MenuModal.module.css";

const MenuModal = (props) => {
  return (
    <>
      <div className={styles["backdrop"]} onClick={props.onClick}></div>
    </>
  );
};

export default MenuModal;
