import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import styles from "./CreateDelivery.module.css";
import LoadingPage from "./ui/LoadingPage";
import LoadingSpinner from "../public/icons/loading-spinner";
import Button from "../components-app/ui/Button";
import Check from "../public/icons/check";
import generateNoDelivery from "../helpers/generateNoDelivery";

const CreateDelivery = () => {
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSession();
  const [listCabang, setListCabang] = useState([]);
  const [listUserCabang, setListUserCabang] = useState([]);

  const [cabangTujuan, setCabangTujuan] = useState("");
  const [namaKurir, setNamaKurir] = useState("");
  const [resiBelumDelivery, setResiBelumDelivery] = useState([]);
  const [resiBelumCloseDelivery, setResiBelumCloseDelivery] = useState([]);
  const [listCheckedResi, setListCheckedResi] = useState([]);

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
    if (cabangTujuan) {
      const cabang = listCabang.filter((d) => d.cab === cabangTujuan)[0];
      fetch("/api/users/" + cabang.tlc)
        .then((response) => response.json())
        .then((data) => setListUserCabang(data));
    }
  }, [cabangTujuan]);

  useEffect(() => {
    if (cabangTujuan) {
      const cabang = listCabang.filter((d) => d.cab === cabangTujuan)[0];
      fetch("/api/users/" + cabang.tlc)
        .then((response) => response.json())
        .then((data) => setListUserCabang(data));
    }
  }, [cabangTujuan]);

  useEffect(() => {
    setIsLoading(true);
    if (cabangTujuan !== "") {
      fetch("/api/data-resi/belum-delivery/" + cabangTujuan)
        .then((response) => response.json())
        .then((data) => {
          setResiBelumDelivery(data);
          setIsLoading(false);
        });

      fetch("/api/data-delivery/proses/" + cabangTujuan)
        .then((response) => response.json())
        .then((data) => {
          const listResi = data
            .map((d) => d.dataResi.map((d) => d.noResi))
            .join()
            .split(",");
          setResiBelumCloseDelivery(listResi);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [cabangTujuan]);

  const cabangTujuanChangeHandler = (e) => {
    setCabangTujuan(e.target.value);
    setListCheckedResi([]);
    setNamaKurir("");
  };

  const kurirChangeHandler = (e) => {
    setNamaKurir(e.target.value);
    setListCheckedResi([]);
  };

  const checkboxChangeHandler = (e, checked) => {
    if (e.target.checked) {
      setListCheckedResi((prevListCheckedResi) => [...prevListCheckedResi, checked]);
    }

    if (!e.target.checked) {
      setListCheckedResi((prevListCheckedResi) => prevListCheckedResi.filter((d) => d.noResi !== checked.noResi));
    }
  };

  const submitHandler = (e) => {
    const cabang = cabangTujuan;
    const kurir = namaKurir;

    e.preventDefault();
    setIsLoadingPage(true);
    const listNoResi = listCheckedResi.map((d) => d.noResi);
    const noDelivery = generateNoDelivery(namaKurir.split("-")[1].trim());
    const tgl = new Date().toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const dataDelivery = {
      noDelivery: noDelivery,
      cabang: cabang,
      tglDelivery: tgl,
      userDelivery: data.nama,
      namaKurir: namaKurir,
      dataResi: listCheckedResi,
    };

    setCabangTujuan("");
    setNamaKurir("");

    fetch("/api/data-delivery/post-delivery", {
      method: "POST",
      body: JSON.stringify(dataDelivery),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 201) {
        fetch("/api/data-resi/update-many-resi-by-delivery", {
          method: "PATCH",
          body: JSON.stringify({
            filter: listNoResi,
            update: {
              noDelivery: noDelivery,
              tglDelivery: tgl,
              userDelivery: data.nama,
              namaKurir: namaKurir,
              statusDelivery: "proses",
              keteranganDelivery: "",
              deliveredAt: "",
              deliveredBy: "",
            },
          }),
          headers: { "Content-Type": "application/json" },
        }).then((response) => {
          if (response.status == 201) {
            setIsLoadingPage(false);
            setResiBelumDelivery([]);
            setListCheckedResi([]);
            setCabangTujuan(cabang);
            setNamaKurir(kurir);
            alert("Berhasil assign delivery dengan nomor " + noDelivery);
          } else {
            setIsLoadingPage(false);
            alert("Terjadi kesalahan, silahkan refresh halaman dan coba kembali");
          }
        });
      } else {
        alert("Gagal Create Delivery");
      }
    });
  };

  console.log();
  return (
    <div className={styles["container"]}>
      {isLoadingPage ? <LoadingPage /> : null}

      {/* -- Display Form Selection -- */}
      {status === "authenticated" ? (
        <form className={styles["form-wrapper"]}>
          <div className={styles["field"]}>
            <label className={styles["label"]} htmlFor="cabangAsal">
              Cabang
            </label>
            <select name="cabangAsal" id="cabangAsal" value={cabangTujuan} onChange={cabangTujuanChangeHandler}>
              <option value="" disabled>
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
              <option value="">-- Pilih Kurir --</option>
              {listUserCabang.length > 0
                ? listUserCabang.map((d, i) => (
                    <option key={i} value={d.nama + " - " + d.cabang + d.posisi + d.id}>
                      {d.nama}
                      {" - "}
                      {d.cabang.toUpperCase()}
                      {d.posisi.toUpperCase()}
                      {d.id}
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
      ) : cabangTujuan ? (
        <table className="table-container">
          <thead className="table-head">
            <tr>
              <td>No</td>
              <td>No Resi</td>
              <td>Asal-Tujuan</td>
              <td>Kecamatan</td>
              <td>Jumlah Paket</td>
              <td>Berat Paket</td>
              <td>Pilih</td>
            </tr>
          </thead>
          <tbody className="table-body">
            {resiBelumDelivery.length === 0 ? (
              <tr>
                <td colSpan="6" className="error-txt">
                  Data Tidak Ditemukan...
                </td>
              </tr>
            ) : resiBelumDelivery.filter((d) => !resiBelumCloseDelivery.includes(d.noResi)).length === 0 ? (
              <tr>
                <td colSpan="6" className="error-txt">
                  Ditemukan {resiBelumCloseDelivery.length} Resi GAGAL KIRIM yang masih dibawa kurir, silahkan close
                  status delivery untuk melakukan delivery ulang...
                </td>
              </tr>
            ) : (
              resiBelumDelivery
                .filter((d) => !resiBelumCloseDelivery.includes(d.noResi))
                .map((d, i) => (
                  <tr key={i}>
                    <td className="center-element">{i + 1}</td>
                    <td>{d.noResi}</td>
                    <td>
                      {d.cabangAsal.toUpperCase()} - {d.cabangTujuan}
                    </td>
                    <td>{d.dataOngkir.kec.toUpperCase()}</td>
                    <td>{d.jumlahBarang} koli</td>
                    <td>{d.beratBarang} Kg</td>
                    <td className="center-element">
                      <input
                        id="checkbox"
                        type="checkbox"
                        disabled={!namaKurir}
                        onChange={(e) =>
                          checkboxChangeHandler(e, {
                            noResi: d.noResi,
                            statusDelivery: "proses",
                            keteranganDelivery: "",
                            deliveredAt: "",
                            deliveredBy: "",
                            namaPengirim: d.namaPengirim,
                            namaPenerima: d.namaPenerima,
                            nohpPengirim: d.nohpPengirim,
                            nohpPenerima: d.nohpPenerima,
                            alamatPenerima: d.alamatPenerima,
                            alamatPengirim: d.alamatPengirim,
                            beratBarang: d.beratBarang,
                            jumlahBarang: d.jumlahBarang,
                            cabangAsal: d.cabangAsal,
                            cabangTujuan: d.cabangTujuan,
                            tujuanKecamatan: d.tujuan.kec,
                            keteranganBarang: d.keteranganBarang,
                            layanan: d.layanan,
                            pembayaran: d.pembayaran,
                            grandTotal: d.grandTotal,
                          })
                        }
                      />
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      ) : null}

      {/* -- Display Create Delivery Description */}
      <div className={styles["container-manifest"]}>
        {listCheckedResi.length > 0 ? (
          <>
            <div>Assign Delivery to {namaKurir}</div>
            <div className={styles["container-manifest-detail"]}>
              <div>{listCheckedResi.length} Resi</div>
              <div>{listCheckedResi.reduce((total, obj) => Number(obj.beratBarang) + total, 0)} Kg</div>
              <div>{listCheckedResi.reduce((total, obj) => Number(obj.jumlahBarang) + total, 0)} Koli</div>
            </div>
          </>
        ) : (
          <div></div>
        )}
        <div>
          <Button
            label="Create Delivery"
            width="full"
            color="black"
            icon={isLoading ? <LoadingSpinner /> : <Check />}
            disabled={!cabangTujuan || listCheckedResi.length === 0 || !namaKurir}
            clickHandler={submitHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateDelivery;
