import { useState } from "react";
import { signOut } from "next-auth/react";
import styles from "./Topbar.module.css";
import UserIcon from "../public/icons/UserIcon";
import Bars from "../public/icons/bars";
import CloseCircle from "../public/icons/close-circle";
import Button from "./ui/Button";
import Check from "../public/icons/check";

const Topbar = (props) => {
  const [showSetting, setShowSetting] = useState(false);

  const showSettingHandler = (e) => {
    setShowSetting(!showSetting);
  };

  const onCloseIconHandler = () => {
    setShowSetting(false);
  };

  const onLogoutHandler = () => {
    signOut();
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["hamburger-icon"]} onClick={props.onToggle}>
        {props.onShow ? <CloseCircle /> : <Bars />}
      </div>
      <div onClick={showSettingHandler} className={styles["user-icon"]}>
        <UserIcon />
      </div>
      {showSetting ? (
        <div className={styles["menu-icon"]}>
          <div>Apakah Anda akan logout ?</div>
          <div className={styles["menu-icon__btn"]}>
            <Button label="Ya" color="blue" icon={<Check />} clickHandler={onLogoutHandler} />
            <Button label="Tidak" color="red" icon={<CloseCircle />} clickHandler={onCloseIconHandler} />
          </div>
        </div>
      ) : null}
      <div className={styles["user-detail"]}>
        <h5 className={styles["user-id"]}>{props.user.nama}</h5>
        <p className={styles["user-email"]}>{props.user.email}</p>
      </div>
    </div>
  );
};

export default Topbar;
