import React from "react";
import qrCode from "../../helpers/qrCode";
import styles from "./PrintoutStruk.module.css";

const PrintoutStruk = ({ data }) => {
  const barcodeLink = "https://bistacargo.com/cek-paket/";

  return (
    <div id="struk" className={styles["container"]}>
      <div className={styles["header"]}>
        <img src="/images/bista-header.png" alt="logo bista" />
        <div className={styles["barcode-resi"]}>
          <p>Scan Barcode untuk tracking posisi paket</p>
          <img src={qrCode(barcodeLink)} />
        </div>
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

      <table className={styles["detail"]}>
        <tbody>
          <tr>
            <td>Nomor Resi</td>
            <td>:</td>
            <td>Status Transaksi Belum Deal</td>
          </tr>
          <tr>
            <td>Tgl Transaksi</td>
            <td>:</td>
            <td>{data.tglTransaksi}</td>
          </tr>
          <tr>
            <td>Layanan</td>
            <td>:</td>
            <td>{data.layanan.toUpperCase()}</td>
          </tr>
          <tr>
            <td>Jlh Paket</td>
            <td>:</td>
            <td>{data.jumlahBarang} Koli</td>
          </tr>
          <tr>
            <td>Berat</td>
            <td>:</td>
            <td>{data.beratBarang} Kg</td>
          </tr>
          <tr>
            <td>Ongkir Per-Kg</td>
            <td>:</td>
            <td>Rp. {Number(data.ongkirPerkilo).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Subtotal Ongkir</td>
            <td>:</td>
            <td>Rp. {Number(data.subtotalOngkir).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Diskon</td>
            <td>:</td>
            <td>{data.diskon}%</td>
          </tr>
          <tr>
            <td className={styles["no-wrap"]}>Ongkir Setelah Diskon</td>
            <td>:</td>
            <td>Rp. {Number(data.ongkirSetelahDiskon).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Biaya Packing</td>
            <td>:</td>
            <td>Rp. {Number(data.biayaPacking).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Biaya Surat</td>
            <td>:</td>
            <td>Rp. {Number(data.biayaSurat).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Biaya Asuransi</td>
            <td>:</td>
            <td>Rp. {Number(data.biayaAsuransi).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Total Ongkir</td>
            <td>:</td>
            <td>Rp. {Number(data.grandTotal).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td>Metode Pembayaran</td>
            <td>:</td>
            <td>{data.pembayaran.toUpperCase()}</td>
          </tr>
          <tr>
            <td>Keterangan</td>
            <td>:</td>
            <td>{data.keteranganBarang}</td>
          </tr>
        </tbody>
      </table>

      <div className={styles["footer"]}>
        <div>
          <p>*Syarat dan ketentuan pengiriman dapat dilihat di website www.bistacargo.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrintoutStruk;
