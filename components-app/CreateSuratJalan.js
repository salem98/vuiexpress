import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "./CreateSuratJalan.module.css";
import LoadingSpinner from "../public/icons/loading-spinner";
import Check from "../public/icons/check";
import Button from "./ui/Button";
import generateNoSuratJalan from "../helpers/generateNoSuratJalan";
import LoadingPage from "./ui/LoadingPage";

const CreateSuratJalan = () => {
  const { data, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [listCabang, setListCabang] = useState([]);
  const [cabangAsal, setCabangAsal] = useState("");
  const [cabangTujuan, setCabangTujuan] = useState("");
  const [namaDriver, setNamaDriver] = useState("");
  const [nopolDriver, setNopolDriver] = useState("");
  const [fetchDataManifest, setFetchDataManifest] = useState([]);
  const [fetchDataManifestTransit, setFetchDataManifestTransit] = useState([]);
  const [listManifest, setListManifest] = useState([]);

  useEffect(() => {
    fetch("/api/cabang")
      .then((response) => response.json())
      .then((data) => setListCabang(data));
  }, []);

  useEffect(() => {
    if (cabangAsal) {
      setIsLoading(true);

      fetch("/api/data-manifest/belum-surat-jalan/" + cabangAsal)
        .then((response) => response.json())
        .then((data) => {
          setFetchDataManifest(data);
          setIsLoading(false);
        });

      fetch("/api/data-manifest/cabang-transit/" + cabangAsal)
        .then((response) => response.json())
        .then((data) => setFetchDataManifestTransit(data));
    }

    setCabangTujuan("");
    setFetchDataManifest([]);
    setFetchDataManifestTransit([]);
    setNamaDriver("");
    setNopolDriver("");
    setFetchDataManifest([]);
    setListManifest([]);
  }, [cabangAsal]);

  useEffect(() => {
    const checkbox = document.querySelectorAll("#checkbox");
    for (let item of checkbox) {
      item.checked = false;
    }
  }, [cabangAsal, cabangTujuan]);

  const cabangAsalChangeHandler = (e) => {
    setCabangAsal(e.target.value);
    setCabangTujuan("");
    setNamaDriver("");
    setNopolDriver("");
    setListManifest([]);
  };

  const cabangTujuanChangeHandler = (e) => {
    setCabangTujuan(e.target.value);
    setNamaDriver("");
    setNopolDriver("");
    setListManifest([]);
  };

  const namaDriverChangeHandler = (e) => {
    setNamaDriver(e.target.value);
  };
  const nopolDriverChangeHandler = (e) => {
    setNopolDriver(e.target.value);
  };

  const checkboxChangeHandler = (e, dataManifestChecked) => {
    if (e.target.checked) {
      setListManifest((prevListManifest) => [...prevListManifest, dataManifestChecked]);
    }

    if (!e.target.checked) {
      setListManifest((prevListManifest) =>
        prevListManifest.filter((d) => d.noManifest !== dataManifestChecked.noManifest)
      );
    }
  };

  const submitHandler = (e) => {
    setIsLoadingPage(true);
    e.preventDefault();
    const listNoManifest = listManifest.map((d) => d.noManifest);
    const cabangAsalTlc = listCabang.filter((d) => d.cab === cabangAsal)[0].tlc;
    const cabangTujuanTlc = listCabang.filter((d) => d.cab === cabangTujuan)[0].tlc;
    const noSuratJalan = generateNoSuratJalan(cabangAsalTlc, cabangTujuanTlc);
    const tgl = new Date().toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const beratBarang = listManifest.reduce((total, obj) => Number(obj.beratBarang) + total, 0);
    const konsolidasi = listManifest.reduce((total, obj) => Number(obj.konsolidasi) + total, 0);
    const petugasInput = data.nama;

    const dataSuratJalan = {
      noSuratJalan: noSuratJalan,
      tglSuratJalan: tgl,
      cabangAsal: cabangAsal,
      cabangAsalTlc: cabangAsalTlc,
      cabangTujuan: cabangTujuan,
      cabangTujuanTlc: cabangTujuanTlc,
      namaDriver: namaDriver,
      nopolDriver: nopolDriver,
      konsolidasi: konsolidasi,
      beratBarang: beratBarang,
      petugasInput: petugasInput,
      dataManifest: listManifest,
    };

    // post dataSuratJalan
    fetch("/api/data-surat-jalan/post-surat-jalan", {
      method: "POST",
      body: JSON.stringify(dataSuratJalan),
      headers: { "Content-Type": "application/json" },
    });

    // update dataManifest
    fetch("/api/data-manifest/update-many-manifest", {
      method: "PATCH",
      body: JSON.stringify({
        filter: listNoManifest,
        update: { suratJalan: [dataSuratJalan] },
      }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status == 201) {
        setCabangTujuan("");
        setNamaDriver("");
        setNopolDriver("");
        setFetchDataManifest([]);
        setFetchDataManifestTransit([]);
        setListManifest([]);
        setIsLoadingPage(false);
        alert("Berhasil Create Surat Jalan \n" + noSuratJalan);
      } else {
        setIsLoadingPage(false);
        alert("Surat Jalan Tidak Berhasil di Create \nCek Kembali Inputan Anda!");
      }
    });
  };

  return (
    <div className={styles["container"]}>
      {isLoadingPage ? <LoadingPage /> : null}
      {status === "authenticated" ? (
        <>
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
              <label className={styles["label"]} htmlFor="cabangTujuan">
                Cabang Tujuan
              </label>
              <select name="cabangTujuan" id="cabangTujuan" value={cabangTujuan} onChange={cabangTujuanChangeHandler}>
                <option value=""></option>
                {cabangAsal
                  ? listCabang.map((d, i) => (
                      <option key={i} value={d.cab}>
                        {d.cab.toUpperCase()}
                      </option>
                    ))
                  : null}
              </select>
            </div>

            <div className={styles["field"]}>
              <label className={styles["label"]} htmlFor="namaDriver">
                Nama Driver / Vendor
              </label>
              <input
                type="text"
                id="namaDriver"
                name="namaDriver"
                value={namaDriver}
                onChange={namaDriverChangeHandler}
                required
              />
            </div>

            <div className={styles["field"]}>
              <label className={styles["label"]} htmlFor="nopolDriver">
                Nopol Driver / No AWB Vendor
              </label>
              <input
                type="text"
                id="nopolDriver"
                name="nopolDriver"
                value={nopolDriver}
                onChange={nopolDriverChangeHandler}
                required
              />
            </div>
          </form>

          {/* -- Display Table Manifest Origin-- */}
          {isLoading ? (
            <div className="center-loading">
              <LoadingSpinner />
            </div>
          ) : fetchDataManifest.length !== 0 ? (
            <table className="table-container">
              <thead className="table-head">
                <tr>
                  <td>No</td>
                  <td>No Manifest Origin</td>
                  <td>Asal</td>
                  <td>Tujuan</td>
                  <td>Coveran</td>
                  <td>Pilih</td>
                </tr>
              </thead>
              <tbody className="table-body">
                {cabangAsal && fetchDataManifest
                  ? fetchDataManifest.map((d, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.noManifest}</td>
                        <td>{d.cabangAsal.toUpperCase()}</td>
                        <td>{d.cabangTujuan.toUpperCase()}</td>
                        <td>{d.coveranArea.toUpperCase()}</td>
                        <td className="center-element">
                          <input
                            id="checkbox"
                            type="checkbox"
                            disabled={!cabangAsal || !cabangTujuan || !namaDriver || !nopolDriver}
                            onChange={(e) =>
                              checkboxChangeHandler(e, {
                                noManifest: d.noManifest,
                                cabangAsal: d.cabangAsal,
                                cabangAsalTlc: d.cabangAsalTlc,
                                cabangTujuan: d.cabangTujuan,
                                cabangTujuanTlc: d.cabangTujuanTlc,
                                coveranArea: d.coveranArea,
                                coveranAreaTlc: d.coveranAreaTlc,
                                beratBarang: d.dataResi.reduce((total, obj) => Number(obj.beratBarang) + total, 0),
                                konsolidasi: d.konsolidasi,
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          ) : null}

          {/* -- Display Table Manifest TRANSIT-- */}
          {isLoading ? (
            <div className="center-loading">
              <LoadingSpinner />
            </div>
          ) : fetchDataManifestTransit.length !== 0 ? (
            <table className="table-container">
              <thead className="table-head">
                <tr>
                  <td>No</td>
                  <td>No Manifest Transit</td>
                  <td>Asal</td>
                  <td>Tujuan</td>
                  <td>Coveran</td>
                  <td>Pilih</td>
                </tr>
              </thead>
              <tbody className="table-body">
                {cabangAsal && fetchDataManifestTransit
                  ? fetchDataManifestTransit.map((d, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.noManifest}</td>
                        <td>{d.cabangAsal.toUpperCase()}</td>
                        <td>{d.cabangTujuan.toUpperCase()}</td>
                        <td>{d.coveranArea.toUpperCase()}</td>
                        <td className="center-element">
                          <input
                            id="checkbox"
                            type="checkbox"
                            disabled={!cabangAsal || !cabangTujuan || !namaDriver || !nopolDriver}
                            onChange={(e) =>
                              checkboxChangeHandler(e, {
                                noManifest: d.noManifest,
                                cabangAsal: d.cabangAsal,
                                cabangAsalTlc: d.cabangAsalTlc,
                                cabangTujuan: d.cabangTujuan,
                                cabangTujuanTlc: d.cabangTujuanTlc,
                                coveranArea: d.coveranArea,
                                coveranAreaTlc: d.coveranAreaTlc,
                                beratBarang: d.dataResi.reduce((total, obj) => Number(obj.beratBarang) + total, 0),
                                konsolidasi: d.konsolidasi,
                              })
                            }
                          />
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          ) : null}

          {/* -- Display Create surat jalan Description */}

          <div className={styles["container-manifest"]}>
            {listManifest.length > 0 ? (
              <>
                <div>
                  {cabangAsal.toUpperCase()} - {cabangTujuan.toUpperCase()}
                </div>
                <div className={styles["container-manifest-detail"]}>
                  <div>{listManifest.length} Manifest</div>
                  <div>{listManifest.reduce((total, obj) => Number(obj.beratBarang) + total, 0)} Kg</div>
                  <div>{listManifest.reduce((total, obj) => Number(obj.konsolidasi) + total, 0)} Koli</div>
                </div>
              </>
            ) : (
              <div></div>
            )}
            <div>
              <Button
                label="Create Surat Jalan"
                width="full"
                color="black"
                icon={isLoading ? <LoadingSpinner /> : <Check />}
                disabled={
                  !cabangAsal || !cabangTujuan || listManifest.length === 0 || !namaDriver || !nopolDriver
                    ? true
                    : false
                }
                clickHandler={submitHandler}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CreateSuratJalan;
