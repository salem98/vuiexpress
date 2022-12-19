import styles from "./DashboardNav.module.css";

const DashboardNav = (props) => {
  return (
    <header className={styles["head-nav"]}>
      <div className={props.resiAktifSelected ? styles["menu-nav-active"] : styles["menu-nav"]} onClick={props.onResi}>
        Resi Aktif
      </div>
      <div
        className={props.resiBelumManifestSelected ? styles["menu-nav-active"] : styles["menu-nav"]}
        onClick={props.onManifest}
      >
        Resi Belum Manifest
      </div>
      <div
        className={props.resiBelumSuratJalanSelected ? styles["menu-nav-active"] : styles["menu-nav"]}
        onClick={props.onSuratJalan}
      >
        Resi Belum Surat Jalan
      </div>
    </header>
  );
};

export default DashboardNav;
