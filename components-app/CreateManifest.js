import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import generateNoManifest from "../helpers/generateNoManifest";

import LoadingPage from "../components-app/ui/LoadingPage";
import styles from "./CreateManifest.module.css";
import Button from "../components-app/ui/Button";
import Check from "../public/icons/check";
import LoadingSpinner from "../public/icons/loading-spinner";

const CreateManifest = () => {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [listCabang, setListCabang] = useState([]);
  const [cabangAsal, setCabangAsal] = useState("");
  const [cabangTujuan, setCabangTujuan] = useState("");
  const [coveranArea, setCoveranArea] = useState("");
  const [listTujuan, setListTujuan] = useState([]);
  const [listCoveran, setListCoveran] = useState([]);
  const [dataResi, setDataResi] = useState([]);
  const [listResi, setListResi] = useState([]);
  const [konsolidasi, setKonsolidasi] = useState("");

  const cabangAsalChangeHandler = (e) => {
    setCabangAsal(e.target.value);
    setCabangTujuan("");
    setCoveranArea("");
    setListResi([]);
    setKonsolidasi("");
  };

  const coveranChangeHandler = (e) => {
    setCoveranArea(e.target.value);
    setCabangTujuan("");
    setListResi([]);
    setKonsolidasi("");
  };

  const tujuanChangeHandler = (e) => {
    setCabangTujuan(e.target.value);
    setListResi([]);
    setKonsolidasi("");
  };

  const checkboxChangeHandler = (e, dataResiChecked) => {
    if (e.target.checked) {
      setListResi((prevListResi) => [...prevListResi, dataResiChecked]);
      setKonsolidasi("");
    }

    if (!e.target.checked) {
      setListResi((prevListResi) => prevListResi.filter((d) => d.noResi !== dataResiChecked.noResi));
      setKonsolidasi("");
    }
  };

  const konsolidasiChangeHandler = (e) => {
    setKonsolidasi(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault;
    setIsLoadingPage(true);
    const tlc = {
      asal: listCabang.filter((d) => d.cab === cabangAsal)[0].tlc,
      coveran: listCabang.filter((d) => d.cab === coveranArea)[0].tlc,
      tujuan: dataResi.filter((d) => d.dataOngkir.ibukota === cabangTujuan)[0].dataOngkir.tlc,
    };
    const noManifest = generateNoManifest(tlc.asal, tlc.tujuan);
    const tgl = new Date().toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const listNoResi = listResi.map((d) => d.noResi);

    // update dataResi
    fetch("/api/data-resi/update-many-resi", {
      method: "PATCH",
      body: JSON.stringify({
        filter: listNoResi,
        update: { noManifest: noManifest, tglManifest: tgl },
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 201) {
        fetch("/api/data-manifest/post-manifest", {
          method: "POST",
          body: JSON.stringify({
            noManifest: noManifest,
            tglManifest: tgl,
            cabangAsal: cabangAsal,
            cabangAsalTlc: tlc.asal,
            cabangTujuan: cabangTujuan,
            cabangTujuanTlc: tlc.tujuan,
            coveranArea: coveranArea,
            coveranAreaTlc: tlc.coveran,
            jumlahBerat: listResi.reduce((total, obj) => Number(obj.beratBarang) + total, 0),
            jumlahBarang: listResi.reduce((total, obj) => Number(obj.jumlahBarang) + total, 0),
            konsolidasi: konsolidasi,
            petugasInput: data.nama,
            dataResi: listResi,
          }),
          headers: { "Content-Type": "application/json" },
        }).then((response) => {
          if (response.status === 201) {
            // reset all state
            setCabangAsal("");
            setCabangTujuan("");
            setCoveranArea("");
            setListTujuan([]);
            setListCoveran([]);
            setDataResi([]);
            setListResi([]);
            setKonsolidasi("");
            setIsLoadingPage(false);
            alert("Berhasil Create Manifest");
          } else {
            setIsLoadingPage(false);
            alert("Terjadi Kesalahan, silahkan ulangi proses");
          }
        });
      } else {
        setIsLoadingPage(false);
        alert("Gagal Update Data Resi");
      }
    });
  };

  useEffect(() => {
    const checkbox = document.querySelectorAll("#checkbox");
    for (let item of checkbox) {
      item.checked = false;
    }
  }, [cabangAsal, cabangTujuan, coveranArea]);

  useEffect(() => {
    fetch("/api/cabang")
      .then((response) => response.json())
      .then((data) => setListCabang(data));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/data-resi/belum-manifest/" + cabangAsal)
      .then((response) => response.json())
      .then((data) => {
        setDataResi(data);
        setIsLoading(false);
      });
  }, [cabangAsal]);

  useEffect(() => {
    setIsLoading(true);
    if (dataResi) {
      const getCabang = dataResi.map((d) => ({ ibukota: d.dataOngkir.ibukota, cov: d.dataOngkir.cov }));
      const coveran = getCabang.map((d) => d.cov);
      setListCoveran([...new Set(coveran)]);
      if (coveranArea) {
        const tujuan = getCabang.filter((d) => d.cov === coveranArea).map((d) => d.ibukota);
        setListTujuan([...new Set(tujuan)]);
      }
    }
    setIsLoading(false);
  }, [dataResi, coveranArea]);

  return (
    <div className={styles["container"]}>
      {isLoadingPage ? <LoadingPage /> : null}
      {/* -- Display Form Selection -- */}
      {status === "authenticated" ? (
        <form className={styles["form-wrapper"]}>
          <div className={styles["field"]}>
            <label className={styles["label"]} htmlFor="cabangAsal">
              Cabang Asal
            </label>
            <select name="cabangAsal" id="cabangAsal" value={cabangAsal} onChange={cabangAsalChangeHandler}>
              <option value=""></option>
              {data.posisi === "GEN"
                ? listCabang.map((d, i) => (
                    <option key={i} value={d.cab}>
                      {d.cab.toUpperCase()}
                    </option>
                  ))
                : listCabang
                    .filter((d) => d.tlc == data.cabang)
                    .map((d, i) => (
                      <option key={i} value={d.cab}>
                        {d.cab.toUpperCase()}
                      </option>
                    ))}
            </select>
          </div>

          <div className={styles["field"]}>
            <label className={styles["label"]} htmlFor="coveran">
              Coveran Area
            </label>
            <select name="coveran" id="coveran" value={coveranArea} onChange={coveranChangeHandler}>
              <option value=""></option>
              {cabangAsal
                ? listCoveran.map((d, i) => (
                    <option key={i} value={d}>
                      {d.toUpperCase()}
                    </option>
                  ))
                : null}
            </select>
          </div>

          <div className={styles["field"]}>
            <label className={styles["label"]} htmlFor="cabangTujuan">
              Cabang Tujuan
            </label>
            <select name="cabangTujuan" id="cabangTujuan" value={cabangTujuan} onChange={tujuanChangeHandler}>
              <option value=""></option>
              {coveranArea
                ? listTujuan.map((d, i) => (
                    <option key={i} value={d}>
                      {d.toUpperCase()}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </form>
      ) : (
        <LoadingPage />
      )}

      {/* --Display Tabel Options -- */}
      {isLoading ? (
        <div className="center-loading">
          <LoadingSpinner />
        </div>
      ) : dataResi ? (
        <table className="table-container">
          <thead className="table-head">
            <tr>
              <td>No</td>
              <td>No Resi</td>
              <td>Asal</td>
              <td>Tujuan</td>
              <td>Coveran</td>
              <td>Pilih</td>
            </tr>
          </thead>
          <tbody className="table-body">
            {cabangAsal && !coveranArea && !cabangTujuan ? (
              dataResi.length === 0 ? (
                <tr>
                  <td colSpan="6" className="error-txt">
                    Data Tidak Ditemukan...
                  </td>
                </tr>
              ) : (
                dataResi.map((d, i) => (
                  <tr key={i}>
                    <td className="center-element">{i + 1}</td>
                    <td>{d.noResi}</td>
                    <td>{d.cabangAsal.toUpperCase()}</td>
                    <td>{d.cabangTujuan}</td>
                    <td>{d.dataOngkir.cov.toUpperCase()}</td>
                    <td className="center-element">
                      <input
                        id="checkbox"
                        type="checkbox"
                        onChange={(e) =>
                          checkboxChangeHandler(e, {
                            noResi: d.noResi,
                            beratBarang: d.beratBarang,
                            jumlahBarang: d.jumlahBarang,
                          })
                        }
                        disabled={true}
                      />
                    </td>
                  </tr>
                ))
              )
            ) : cabangAsal && coveranArea && !cabangTujuan ? (
              dataResi
                .filter((d) => d.dataOngkir.cov === coveranArea)
                .map((d, i) => (
                  <tr key={i}>
                    <td className="center-element">{i + 1}</td>
                    <td>{d.noResi}</td>
                    <td>{d.cabangAsal.toUpperCase()}</td>
                    <td>{d.cabangTujuan}</td>
                    <td>{d.dataOngkir.cov.toUpperCase()}</td>
                    <td className="center-element">
                      <input
                        id="checkbox"
                        type="checkbox"
                        onChange={(e) =>
                          checkboxChangeHandler(e, {
                            noResi: d.noResi,
                            beratBarang: d.beratBarang,
                            jumlahBarang: d.jumlahBarang,
                          })
                        }
                        disabled={true}
                      />
                    </td>
                  </tr>
                ))
            ) : cabangAsal && coveranArea && cabangTujuan ? (
              dataResi
                .filter((d) => d.dataOngkir.ibukota === cabangTujuan)
                .map((d, i) => (
                  <tr key={i}>
                    <td className="center-element">{i + 1}</td>
                    <td>{d.noResi}</td>
                    <td>{d.cabangAsal.toUpperCase()}</td>
                    <td>{d.cabangTujuan}</td>
                    <td>{d.dataOngkir.cov.toUpperCase()}</td>
                    <td className="center-element">
                      <input
                        id="checkbox"
                        type="checkbox"
                        onChange={(e) =>
                          checkboxChangeHandler(e, {
                            noResi: d.noResi,
                            beratBarang: d.beratBarang,
                            jumlahBarang: d.jumlahBarang,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))
            ) : null}
          </tbody>
        </table>
      ) : null}
      {/* -- Display Create MAnifest Description */}
      <div className={styles["container-manifest"]}>
        {listResi.length > 0 ? (
          <>
            <div>
              {cabangAsal.toUpperCase()} - {cabangTujuan.toUpperCase()}
            </div>
            <div className={styles["container-manifest-detail"]}>
              <div>{listResi.length} Resi</div>
              <div>{listResi.reduce((total, obj) => Number(obj.beratBarang) + total, 0)} Kg</div>
              <div>{listResi.reduce((total, obj) => Number(obj.jumlahBarang) + total, 0)} Koli</div>
            </div>
            <div>
              Konsolidasi:{" "}
              <input
                type="number"
                className={styles["konsol-input"]}
                placeholder="jumlah konsol..."
                value={konsolidasi}
                onChange={konsolidasiChangeHandler}
              />
            </div>
          </>
        ) : (
          <div></div>
        )}
        <div>
          <Button
            label="Create Manifest"
            width="full"
            color="black"
            icon={isLoading ? <LoadingSpinner /> : <Check />}
            disabled={!cabangAsal || !cabangTujuan || listResi.length === 0 || !konsolidasi ? true : false}
            clickHandler={submitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateManifest;
