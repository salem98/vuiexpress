import { useState, useEffect } from "react";
import styles from "./ResiBelumManifest.module.css";
import LoadingSpinner from "../../../public/icons/loading-spinner";
import LoadingPage from "../LoadingPage";
import Button from "../Button";
import Search from "../../../public/icons/search";
import ModalDetailResi from "./ModalDetailResi";

const ResiBelumManifest = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [showModalDetailResi, setShowModalDetailResi] = useState(false);
  const [resiActive, setResiActive] = useState([]);
  const [dataResi, setDataResi] = useState({});

  const detailClickHandler = (noResi) => {
    setIsLoadingPage(true);
    fetch("/api/data-resi/cek-resi/" + noResi)
      .then((response) => response.json())
      .then((data) => {
        setDataResi(data);
        setShowModalDetailResi(true);
        setIsLoadingPage(false);
      });
  };

  const closeModalDetailResi = () => {
    setShowModalDetailResi(false);
    setDataResi({});
  };

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/data-resi/find-resi-aktif/" + props.cabang)
      .then((response) => response.json())
      .then((data) => {
        setResiActive(data);
        setIsLoading(false);
      });
  }, [props.cabang]);

  return (
    <>
      <table className="table-container">
        <thead className="table-head">
          <tr>
            <td>No</td>
            <td>No Resi</td>
            <td>Pengirim</td>
            <td>Penerima</td>
            <td>Isi Paket</td>
            <td>Jlh Paket</td>
            <td>Berat Paket</td>
            <td>Layanan</td>
            <td>Pembayaran</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody className="table-body">
          {!resiActive ? null : isLoading ? (
            <tr>
              <td colSpan={10}>
                <LoadingSpinner />
              </td>
            </tr>
          ) : (
            resiActive.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  <div className={styles["table-resi"]}>
                    <span className={styles["table-resi__noResi"]}>{d.noResi}</span>
                    <span className={styles["table-resi__tgl"]}>{d.tglTransaksi}</span>
                  </div>
                </td>
                <td>
                  <div className={styles["table-penerima"]}>
                    <span className={styles["table-penerima__nama"]}>{d.namaPengirim}</span>
                    <span className={styles["table-penerima__nohp"]}>{d.nohpPengirim}</span>
                    <span className={styles["table-penerima__alamat"]}>{d.alamatPengirim}</span>
                  </div>
                </td>
                <td>
                  <div className={styles["table-penerima"]}>
                    <span className={styles["table-penerima__nama"]}>{d.namaPenerima}</span>
                    <span className={styles["table-penerima__nohp"]}>{d.nohpPenerima}</span>
                    <span className={styles["table-penerima__alamat"]}>{d.alamatPenerima}</span>
                  </div>
                </td>
                <td>{d.keteranganBarang}</td>
                <td>{d.jumlahBarang} Koli</td>
                <td>{d.beratBarang} Kg</td>
                <td>{d.layanan.toUpperCase()}</td>
                <td>
                  <div className={styles["table-pembayaran"]}>
                    <span className={styles["table-pembayaran__option"]}>{d.pembayaran.toUpperCase()}</span>
                    <span className={styles["table-pembayaran__total"]}>
                      Rp. {Number(d.grandTotal).toLocaleString("id-ID")} ,-
                    </span>
                  </div>
                </td>
                <td>
                  <Button
                    label="Detail"
                    color="cornflowerblue"
                    icon={<Search />}
                    clickHandler={() => detailClickHandler(d.noResi)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isLoadingPage ? <LoadingPage /> : null}
      {showModalDetailResi ? <ModalDetailResi dataResi={dataResi} onClose={closeModalDetailResi} /> : null}
    </>
  );
};

export default ResiBelumManifest;
