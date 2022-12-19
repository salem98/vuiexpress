import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import DashboardNav from "./ui/data-dashboard/DashboardNav";
import ResiActive from "./ui/data-dashboard/ResiActive";

const Dashboard = () => {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [resiActive, setResiActive] = useState([]);
  const [listCabang, setListCabang] = useState([]);
  const [selectedCabang, setSelectedCabang] = useState("");
  const [resiAktifSelected, setResiAktifSelected] = useState(false);
  const [resiBelumManifestSelected, setResiBelumManifestSelected] = useState(false);
  const [resiBelumSuratJalanSelected, setResiBelumSuratJalanSelected] = useState(false);

  const resiAktifHandler = () => {
    setResiAktifSelected(true);
    setResiBelumManifestSelected(false);
    setResiBelumSuratJalanSelected(false);
  };
  const resiBelumManifestHandler = () => {
    setResiAktifSelected(false);
    setResiBelumManifestSelected(true);
    setResiBelumSuratJalanSelected(false);
  };
  const resiBelumSuratJalanHandler = () => {
    setResiAktifSelected(false);
    setResiBelumManifestSelected(false);
    setResiBelumSuratJalanSelected(true);
  };

  const selectCabangHandler = (e) => {
    setSelectedCabang(e.target.value);
  };

  useEffect(() => {
    fetch("/api/cabang")
      .then((response) => response.json())
      .then((data) => {
        setListCabang(data);
      });
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/data-resi/find-resi-aktif/" + selectedCabang)
      .then((response) => response.json())
      .then((data) => {
        setResiActive(data);
        setIsLoading(false);
      });
  }, [selectedCabang]);

  return (
    <div className={styles["container"]}>
      <DashboardNav
        onResi={resiAktifHandler}
        onManifest={resiBelumManifestHandler}
        onSuratJalan={resiBelumSuratJalanHandler}
        resiAktifSelected={resiAktifSelected}
        resiBelumManifestSelected={resiBelumManifestSelected}
        resiBelumSuratJalanSelected={resiBelumSuratJalanSelected}
      />
      <main className={styles["content"]}>
        {resiAktifSelected || resiBelumManifestSelected || resiBelumSuratJalanSelected ? (
          <div className={styles["cabang-option"]}>
            <label htmlFor="cabang">Cabang</label>
            <select name="cabang" id="cabang" value={selectedCabang} onChange={selectCabangHandler}>
              <option value="" disabled={true}>
                --Pilih Cabang--
              </option>
              {!data ? null : data.posisi === "GEN" ? (
                listCabang.map((d, i) => (
                  <option key={i} value={d.cab}>
                    {d.cab.toUpperCase()}
                  </option>
                ))
              ) : (
                <option value={data.cabangDesc}>{data.cabangDesc.toUpperCase()}</option>
              )}
            </select>
          </div>
        ) : null}

        {!resiAktifSelected && !resiBelumManifestSelected && !resiBelumSuratJalanSelected ? (
          <div className={styles["welcome-page"]}></div>
        ) : null}

        {resiAktifSelected ? <ResiActive dataResi={resiActive} isLoading={isLoading} /> : null}
      </main>
    </div>
  );
};

export default Dashboard;
