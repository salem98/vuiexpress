import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import getDate from "../helpers/getDate";

import styles from "./ReceiveSuratJalan.module.css";
import Button from "./ui/Button";
import LoadingPage from "../components-app/ui/LoadingPage";
import LoadingSpinner from "../public/icons/loading-spinner";
import Check from "../public/icons/check";

const ReceiveSuratJalan = () => {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [listCabang, setListCabang] = useState([]);

  const [cabangTujuan, setCabangTujuan] = useState("");
  const [fetchDataSuratJalan, setFetchDataSuratJalan] = useState([]);
  const [suratJalanChecked, setSuratJalanChecked] = useState({});

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    fetch("/api/cabang")
      .then((response) => response.json())
      .then((data) => setListCabang(data));
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    if (!cabangTujuan) {
      setIsLoading(false);
      return;
    }
    fetch("/api/data-surat-jalan/belum-receive/" + cabangTujuan)
      .then((response) => response.json())
      .then((data) => {
        setFetchDataSuratJalan(data);
        setIsLoading(false);
      });
  }, [cabangTujuan]);

  const cabangTujuanChangeHandler = (e) => {
    setIsLoading(true);
    setCabangTujuan(e.target.value);
    setIsLoading(false);
    setSuratJalanChecked({});
  };

  const checkboxChangeHandler = (e, checked) => {
    setSuratJalanChecked(checked);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoadingPage(true);
    const tgl = getDate();
    const update = { receivedIn: cabangTujuan, receivedAt: tgl, receivedBy: data.nama };
    const filter = {
      noSuratJalan: suratJalanChecked.noSuratJalan,
      noManifest: suratJalanChecked.dataManifest.map((d) => d.noManifest),
    };

    fetch("/api/data-manifest/update-many-manifest-by-surat-jalan", {
      method: "PATCH",
      body: JSON.stringify({
        filter: filter,
        update: update,
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status == 201) {
        alert("Berhasil Receiving Data Surat Jalan \n");
      } else {
        alert("Surat Jalan Tidak Berhasil di Receive \nCek Kembali Inputan Anda!");
      }
    });

    fetch("/api/data-surat-jalan/update-surat-jalan", {
      method: "PATCH",
      body: JSON.stringify({ filter: filter, update: update }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 201) {
        setCabangTujuan("");
        setFetchDataSuratJalan([]);
        setSuratJalanChecked({});
        setIsLoadingPage(false);
      }
      setIsLoadingPage(false);
    });
  };
  console.log();
  return (
    <div className={styles["container"]}>
      {isLoadingPage ? <LoadingPage /> : null}
      {/* --- Show List Cabang Tujuan if user Role is GEN */}
      {status === "authenticated" ? (
        <div className={styles["cabang-option"]}>
          <label htmlFor="cabangTujuan">Cabang Tujuan</label>
          <select name="cabangTujuan" id="cabangTujuan" defaultValue="" onChange={cabangTujuanChangeHandler}>
            <option value="" disabled>
              --pilih cabang tujuan--
            </option>
            {data.posisi === "GEN"
              ? listCabang.map((d, i) => (
                  <option key={i} value={d.cab}>
                    {d.cab.toUpperCase()}
                  </option>
                ))
              : listCabang
                  .filter((d) => d.tlc === data.cabang)
                  .map((d, i) => (
                    <option key={i} value={d.cab}>
                      {d.cab.toUpperCase()}
                    </option>
                  ))}
          </select>
        </div>
      ) : null}

      {/* -- Display Table SURAT JALAN INCOMING -- */}
      <table className="table-container">
        <thead className="table-head">
          <tr>
            <td>No</td>
            <td>No Surat Jalan</td>
            <td>Asal</td>
            <td>Tujuan</td>
            <td>Tgl Berangkat</td>
            <td>Driver / Vendor</td>
            <td>Nopol / No AWB</td>
            <td>Terima</td>
          </tr>
        </thead>
        <tbody className="table-body">
          {cabangTujuan && fetchDataSuratJalan.length !== 0 ? (
            fetchDataSuratJalan.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d.noSuratJalan}</td>
                <td>{d.cabangAsal.toUpperCase()}</td>
                <td>{d.cabangTujuan.toUpperCase()}</td>
                <td>{d.tglSuratJalan.toUpperCase()}</td>
                <td>{d.namaDriver.toUpperCase()}</td>
                <td>{d.nopolDriver.toUpperCase()}</td>
                <td className="center-element">
                  <input id="selectSJ" name="selectSJ" type="radio" onChange={(e) => checkboxChangeHandler(e, d)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="error-txt">
                Tidak ada data yang ditampilkan
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* -- Display Create MAnifest Description */}
      <div className={styles["container-manifest"]}>
        {Object.keys(suratJalanChecked).length > 0 ? (
          <div className={styles["container-manifest-detail"]}>
            <span>Anda akan melakukan proses Recieve untuk {suratJalanChecked.noSuratJalan} </span>
            <span>yang terdiri dari {suratJalanChecked.dataManifest.length} manifest, </span>
            <span>total berat {suratJalanChecked.beratBarang} Kg, </span>
            <span>jumlah paket {suratJalanChecked.konsolidasi} koli</span>
          </div>
        ) : (
          <div />
        )}

        <div>
          <Button
            label="Receive Surat Jalan"
            width="full"
            color="black"
            icon={isLoading ? <LoadingSpinner /> : <Check />}
            disabled={!cabangTujuan || Object.keys(suratJalanChecked).length === 0 ? true : false}
            clickHandler={submitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiveSuratJalan;
