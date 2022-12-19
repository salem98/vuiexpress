import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

import Link from "next/link";
import styles from "./MainNav.module.css";
import Bars from "../public/icons/bars";
import Close from "../public/icons/close";
import MenuModal from "./MenuModal";

const MainNav = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [status]);

  const showMenuHandler = () => {
    setShowMenu(showMenu ? false : true);
  };

  return (
    <>
      <nav className={styles["container"]}>
        <div className={styles["img-wrapper"]}>
          <Link href="/">
            <img className={styles["img-logo"]} src="/images/bista-header.png" alt="Bista Cargo Logo" />
          </Link>
        </div>
        <ul className={showMenu ? styles["list-menu-mobile"] : styles["list-menu"]}>
          <li className={styles["list-item"]} onClick={showMenuHandler}>
            <Link href="/">Beranda</Link>
          </li>
          <li className={styles["list-item"]} onClick={showMenuHandler}>
            <Link href="/#about">Tentang</Link>
          </li>
          <li className={styles["list-item"]} onClick={showMenuHandler}>
            <Link href="/#layanan">Layanan</Link>
          </li>
          <li className={styles["list-item"]} onClick={showMenuHandler}>
            <Link href="/#lokasi">Lokasi</Link>
          </li>
          <li className={styles["list-item"]} onClick={showMenuHandler}>
            <Link href="/#kontak">Kontak</Link>
          </li>
          <li className={styles["list-item"]} onClick={showMenuHandler}>
            {status === "authenticated" ? <Link href="/app">Member Area</Link> : <Link href="/auth">Login</Link>}
          </li>
        </ul>
        <div className={styles["ham-menu-icon"]} onClick={showMenuHandler}>
          {showMenu ? <Close /> : <Bars />}
        </div>
      </nav>
      {showMenu ? <MenuModal onClick={showMenuHandler} /> : null}
    </>
  );
};

export default MainNav;
