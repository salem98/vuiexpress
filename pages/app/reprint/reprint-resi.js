import { useState } from "react";

import Layouts from "../_layouts";
import UseQrcode from "../../../helpers/qrCode";
import resiPdf from "../../../helpers/resiPdf";
import labelPdf from "../../../helpers/labelPdf";
import strukPdf from "../../../helpers/strukPdf";

import Button from "../../../components-app/ui/Button";
import Printer from "../../../public/icons/printer";
import LoadingSpinner from "../../../public/icons/loading-spinner";
import Search from "../../../public/icons/search";

import styles from "../../../styles/reprint-resi.module.css";

const ReprintResiPage = () => {
  const [nomorResi, setNomorResi] = useState("");
  const [getDataResi, setGetDataResi] = useState("");
  const [dataNotFound, setDataNotFound] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const base64qrcode = UseQrcode("https://bistacargo.com/cek/paket/" + nomorResi);

  const changeHandler = (e) => {
    setNomorResi(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!nomorResi) {
      setDataNotFound("Nomor Resi Tidak Ditemukan");
      setIsLoading(false);
      setGetDataResi("");
      return;
    }
    setIsLoading(true);
    fetch("/api/data-resi/" + nomorResi)
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          setDataNotFound("Nomor Resi Tidak Ditemukan");
          setIsLoading(false);
          setGetDataResi("");
          return;
        }
        setGetDataResi(data);
        setIsLoading(false);
        setDataNotFound("");
      });
  };

  return (
    <Layouts>
      <div id="bungkus" className={styles["bungkus"]}>
        <div className={styles["container"]}>
          <form className={styles["wrapper"]} onSubmit={submitHandler}>
            <label htmlFor="reprintResi">
              <h2>Reprint Resi</h2>
            </label>
            <div className={styles["action"]}>
              <input
                type="text"
                id="reprintResi"
                name="reprintResi"
                placeholder="Masukkan Nomor Resi"
                onChange={changeHandler}
              />
              {!isLoading ? (
                <Button type="submit" label="Cari Resi" color="red" icon={<Search />} />
              ) : (
                <div>
                  <LoadingSpinner />
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </form>
          {dataNotFound ? <p>{dataNotFound}</p> : null}
          {getDataResi ? (
            <table className={styles["container"]}>
              <tbody>
                <tr>
                  <th>Nomor Resi</th>
                  <th>Tgl Transaksi</th>
                  <th>Nama Pengirim</th>
                  <th>Nama Penerima</th>
                  <th>Tujuan</th>
                  <th>Actions</th>
                </tr>
                <tr>
                  <td>{getDataResi.noResi}</td>
                  <td>{getDataResi.tglTransaksi}</td>
                  <td>{getDataResi.namaPengirim}</td>
                  <td>{getDataResi.namaPenerima}</td>
                  <td>
                    {getDataResi.tujuan.kec} - {getDataResi.tujuan.ibukota}
                  </td>
                  <td className={styles["btn-table"]}>
                    <Button
                      clickHandler={() => resiPdf(getDataResi, base64qrcode)}
                      label="Cetak Resi"
                      color="red"
                      width="full"
                      icon={<Printer />}
                    />
                    <Button
                      clickHandler={() => labelPdf(getDataResi)}
                      label="Cetak Label"
                      color="blue"
                      width="full"
                      icon={<Printer />}
                    />
                    <Button
                      clickHandler={() => strukPdf(getDataResi, base64qrcode)}
                      label="Cetak Struk"
                      color="orange"
                      width="full"
                      icon={<Printer />}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </Layouts>
  );
};

export default ReprintResiPage;
