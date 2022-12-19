import qrCode from "../../helpers/qrCode";
import styles from "./PrintoutLabel.module.css";

const PrintoutLabel = ({ data }) => {
  const barcodeLink = "https://bistacargo.com/cek/paket/" + data.noResi;
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <img src="/images/bista-header.png" alt="logo bista" />
        <div>
          <h2>{data.pembayaran.toUpperCase()}</h2>
          <h2>Rp. {Number(data.grandTotal).toLocaleString("id-ID")}</h2>
        </div>
      </div>

      <div className={styles["tujuan"]}>
        <h1>
          {data.cabangAsal.toUpperCase()} - {data.cabangTujuan.toUpperCase()}
        </h1>
      </div>

      <div className={styles["nomor-resi"]}>
        <h1>{data.noResi}</h1>
      </div>

      <div className={styles["pengirim"]}>
        <p>
          <b>Pengirim:</b>
        </p>
        <p>{data.namaPengirim}</p>
        <p>{data.alamatPengirim}</p>
        <p>No Telp. {data.nohpPengirim}</p>
      </div>

      <div className={styles["penerima"]}>
        <p>
          <b>Penerima:</b>
        </p>
        <p>{data.namaPenerima}</p>
        <p>{data.alamatPenerima}</p>
        <p>No Telp. {data.nohpPenerima}</p>
      </div>

      <div className={styles["detail-and-barcode"]}>
        <table className={styles["detail"]}>
          <tbody>
            <tr>
              <td>Jlh Paket</td>
              <td>:</td>
              <td>{data.jumlahBarang} Koli</td>
            </tr>
            <tr>
              <td className={styles["no-wrap"]}>Tgl Transaksi</td>
              <td>:</td>
              <td>{data.tglTransaksi}</td>
            </tr>
            <tr>
              <td>Layanan</td>
              <td>:</td>
              <td>{data.layanan.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Berat</td>
              <td>:</td>
              <td>{data.beratBarang} Kg</td>
            </tr>
            <tr>
              <td>Keterangan</td>
              <td>:</td>
              <td className={styles["text-top"]}>{data.keteranganBarang}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles["barcode-resi"]}>
          <p>Scan Barcode untuk tracking posisi paket</p>
          <span>{qrCode(barcodeLink)}</span>
        </div>
      </div>

      <div className={styles["footer"]}>
        <div>
          <p>
            Periksa kembali paket yang anda terima bersama dengan kurir yang mengantar, karena komplain setelah barang
            diterima tidak akan ditanggapi. Dengan ini Anda telah menyetujui syarat dan ketentuan pengiriman menggunakan
            jasa Bista Cargo. Syarat dan ketentuan pengiriman dapat dilihat di website www.bistacargo.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintoutLabel;
