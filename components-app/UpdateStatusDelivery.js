import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import styles from "./UpdateStatusDelivery.module.css";
import LoadingPage from "./ui/LoadingPage";
import LoadingSpinner from "../public/icons/loading-spinner";
import Button from "../components-app/ui/Button";
import Check from "../public/icons/check";
import CloseCircle from "../public/icons/close-circle";
import Stack from "../public/icons/stack";
import Refresh from "../public/icons/refresh";
import ModalUpdateDelivery from "../components-app/ui/ModalUpdateDelivery";
import ModalStatusDelivery from "../components-app/ui/ModalStatusDelivery";

const CreateDelivery = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSession();
  const [listCabang, setListCabang] = useState([]);

  const [cabangTujuan, setCabangTujuan] = useState("");
  const [namaKurir, setNamaKurir] = useState("");
  const [listDelivery, setListDelivery] = useState([]);
  const [listKurir, setListKurir] = useState([]);
  const [noResiClicked, setNoResiClicked] = useState("");
  const [noDeliveryClicked, setNoDeliveryClicked] = useState("");
  const [valueStatusDelivery, setValueStatusDelivery] = useState({});

  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [showStatusDelivery, setShowStatusDelivery] = useState(false);

  const resetInput = () => {
    setCabangTujuan("");
    setNamaKurir("");
    setNoResiClicked("");
    setNoDeliveryClicked("");
    setCabangTujuan("");
    setNamaKurir("");
  };

  const setInput = (cabang, kurir) => {
    setCabangTujuan(cabang);
    setNamaKurir(kurir);
  };

  useEffect(() => {
    const checkbox = document.querySelectorAll("#checkbox");
    for (let item of checkbox) {
      item.checked = false;
    }
  }, [cabangTujuan]);

  useEffect(() => {
    fetch("/api/cabang")
      .then((response) => response.json())
      .then((data) => setListCabang(data));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (cabangTujuan) {
      fetch("/api/data-delivery/proses/" + cabangTujuan)
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          setListDelivery(data);
        });
    } else {
      setIsLoading(false);
    }
  }, [cabangTujuan]);

  useEffect(() => {
    setIsLoading(true);
    if (cabangTujuan) {
      fetch("/api/data-resi/belum-update-status/" + cabangTujuan)
        .then((response) => response.json())
        .then((data) => {
          console.log();
          setListKurir([
            ...new Set(
              data
                .map((d) => d.delivery.map((d) => d.namaKurir))
                .join()
                .split(",")
            ),
          ]);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [cabangTujuan]);

  const cabangTujuanChangeHandler = (e) => {
    setCabangTujuan(e.target.value);
    setNamaKurir("");
  };

  const kurirChangeHandler = (e) => {
    setNamaKurir(e.target.value);
  };

  const showUpdateHandler = (noResi, noDelivery) => {
    setShowModalUpdate(true);
    setNoResiClicked(noResi);
    setNoDeliveryClicked(noDelivery);
  };

  const showStatusHandler = (val) => {
    setShowStatusDelivery(true);
    setValueStatusDelivery(val);
  };

  const closeUpdateHandler = () => {
    setShowModalUpdate(false);
    setNoResiClicked("");
    setNoDeliveryClicked("");
  };

  const closeStatusHandler = () => {
    setShowStatusDelivery(false);
    setValueStatusDelivery({});
  };

  const closeDelivery = (noDelivery) => {
    setIsLoadingPage(true);
    const cabang = cabangTujuan;
    const kurir = namaKurir;
    const noResi = noResiClicked;

    resetInput();
    const tgl = new Date().toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const update = { closedAt: tgl, closedBy: data.nama };
    const filter = noDelivery;
    const filterResi = { noResi: noResi, noDelivery: noDelivery };

    fetch("/api/data-resi/update-one-resi-by-delivery", {
      method: "PATCH",
      body: JSON.stringify({ filter: filterResi, update: update }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 201) {
        fetch("/api/data-delivery/close-delivery", {
          method: "PATCH",
          body: JSON.stringify({ filter: filter, update: update }),
          headers: { "Content-Type": "application/json" },
        }).then((response) => {
          if (response.status === 201) {
            setInput(cabang, kurir);
            setIsLoadingPage(false);
            alert("Delivery berhasil di close");
          } else {
            setInput(cabang, kurir);
            setIsLoadingPage(false);
            alert("Gagal Close Delivery");
          }
        });
      } else {
        alert("Gagal Update Status Resi");
        setIsLoadingPage(false);
      }
    });
  };
  return (
    <div className={styles["container"]}>
      {isLoadingPage ? <LoadingPage /> : null}
      {/* -- Display Form Selection -- */}
      {status === "authenticated" ? (
        <form className={styles["form-wrapper"]}>
          <div className={styles["field"]}>
            <label className={styles["label"]} htmlFor="cabang">
              Cabang
            </label>
            <select name="cabang" id="cabang" defaultValue={""} onChange={cabangTujuanChangeHandler}>
              <option value="" disabled={true}>
                -- Pilih Cabang --
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

          <div className={styles["field"]}>
            <label className={styles["label"]} htmlFor="kurir">
              Kurir
            </label>
            <select name="kurir" id="kurir" value={namaKurir} onChange={kurirChangeHandler}>
              <option value="" disabled={true}>
                -- Pilih Kurir --
              </option>
              {listKurir.length > 0
                ? listKurir.map((d, i) => (
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
      ) : listDelivery.length > 0 ? (
        listDelivery
          .filter((d) => (namaKurir ? d.namaKurir === namaKurir : d.namaKurir))
          .map((d, i) => (
            <div key={i}>
              <div className={styles["table-title"]}>
                <span className={styles["table-title__icon"]}>
                  <Stack />
                </span>
                <span className={styles["table-title__text"]}>{d.noDelivery}</span>
                <span className={styles["table-title__date"]}>{d.tglDelivery}</span>
              </div>
              <table className="table-container">
                <thead className="table-head">
                  <tr>
                    <td>No</td>
                    <td>No Resi</td>
                    <td>Penerima</td>
                    <td>Isi Paket</td>
                    <td>Jlh Paket</td>
                    <td>Berat Paket</td>
                    <td style={{ width: "160px" }}>Status</td>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {d.dataResi.map((val, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{val.noResi}</td>
                      <td>
                        <div className={styles["table-penerima"]}>
                          <span className={styles["table-penerima__nama"]}>{val.namaPenerima}</span>
                          <span className={styles["table-penerima__nohp"]}>{val.nohpPenerima}</span>
                          <span className={styles["table-penerima__alamat"]}>{val.alamatPenerima}</span>
                        </div>
                      </td>
                      <td>{val.keteranganBarang}</td>
                      <td>{val.jumlahBarang} Koli</td>
                      <td>{val.beratBarang} Kg</td>
                      <td>
                        {val.statusDelivery === "proses" && (
                          <Button
                            type="submit"
                            label="Pengantaran"
                            color="orange"
                            width="full"
                            icon={<Refresh />}
                            clickHandler={() => showUpdateHandler(val.noResi, d.noDelivery)}
                          />
                        )}
                        {val.statusDelivery === "diterima" && (
                          <Button
                            type="submit"
                            label="Diterima"
                            color="cornflowerblue"
                            width="full"
                            icon={<Check />}
                            clickHandler={() => showStatusHandler(val)}
                          />
                        )}
                        {val.statusDelivery === "gagal" && (
                          <Button
                            type="submit"
                            label="Gagal"
                            color="red"
                            width="full"
                            icon={<CloseCircle />}
                            clickHandler={() => showStatusHandler(val)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-foot">
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", fontWeight: "800" }}>
                      <div>
                        <span>
                          Paket Diterima : {d.dataResi.filter((val) => val.statusDelivery === "diterima").length} resi
                        </span>
                        <span> || </span>
                        <span>
                          Gagal Kirim : {d.dataResi.filter((val) => val.statusDelivery === "gagal").length} resi
                        </span>
                        <span> || </span>
                        <span>
                          Proses Pengiriman : {d.dataResi.filter((val) => val.statusDelivery === "proses").length} resi{" "}
                        </span>
                        <div className="center-element">
                          <Button
                            label="Selesaikan Delivery"
                            color="greenoutlined"
                            icon={<Check />}
                            clickHandler={() => closeDelivery(d.noDelivery)}
                            disabled={d.dataResi.filter((val) => val.statusDelivery === "proses").length > 0}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
              {showModalUpdate ? (
                <ModalUpdateDelivery
                  onCloseModal={closeUpdateHandler}
                  noResi={noResiClicked}
                  noDelivery={noDeliveryClicked}
                  cabang={cabangTujuan}
                  kurir={namaKurir}
                  onReset={resetInput}
                  onSet={setInput}
                />
              ) : null}
              {showStatusDelivery ? (
                <ModalStatusDelivery onCloseModal={closeStatusHandler} getValue={valueStatusDelivery} />
              ) : null}
            </div>
          ))
      ) : (
        <div className="center-element" style={{ marginTop: "20px", color: "red" }}>
          {!cabangTujuan
            ? "Nama Cabang belum dipilih"
            : listDelivery.length === 0
            ? "Tidak ada data Delivery"
            : !namaKurir
            ? "Nama Kurir belum dipilih"
            : null}
        </div>
      )}
    </div>
  );
};

export default CreateDelivery;
