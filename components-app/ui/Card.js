import React from "react";
import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>{props.title}</div>
      <div className={styles["content"]}>{props.children}</div>
    </div>
  );
};

export default Card;
