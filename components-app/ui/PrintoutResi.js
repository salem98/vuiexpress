import React from "react";
import qrCode from "../../helpers/qrCode";
import styles from "./PrintoutResi.module.css";

const PrintoutResi = ({ data }) => {
  const barcodeLink = "https://bistacargo.com/cek/paket/";
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <div className={styles["logo-img"]}>
          <img src="/images/bista-header.png" alt="logo bista" />
        </div>
        <div className={styles["barcode-resi"]}>
          <img src={qrCode(barcodeLink)} />
          <div>
            <p>Nomor Resi:</p>
            <h3>Transaksi Belum Deal</h3>
            <p className={styles["note"]}> scan QR Code untuk cek posisi paket</p>
          </div>
        </div>
      </div>
      <div>
        <h4>Tanggal</h4>
        <p>{data.tglTransaksi}</p>
      </div>
      <div>
        <h4>Cabang Asal</h4>
        <p>{data.cabangAsal.toUpperCase()}</p>
      </div>
      <div>
        <h4>Cabang Tujuan</h4>
        <p>{data.cabangTujuan.toUpperCase()}</p>
      </div>
      <div>
        <h4>Kecamatan Tujuan</h4>
        <p>{data.tujuan.kec}</p>
      </div>
      <div>
        <h4>Jumlah Paket</h4>
        <p>{data.jumlahBarang} Koli</p>
      </div>
      <div>
        <h4>Berat Paket</h4>
        <p>{data.beratBarang} Kg</p>
      </div>
      <div>
        <h4>Ongkir per-Kg</h4>
        <p>Rp. {Number(data.ongkirPerkilo).toLocaleString("id-ID")}</p>
      </div>
      <div className={styles["span-2"]}>
        <h4>Pengirim</h4>
        <p>{data.namaPengirim}</p>
        <br></br>
        <p>{data.alamatPengirim}</p>
      </div>
      <div className={styles["span-2"]}>
        <h4>Penerima</h4>
        <p>{data.namaPenerima}</p>
        <br></br>
        <p>{data.alamatPenerima}</p>
      </div>
      <div>
        <h4>Metode Pembayaran</h4>
        <p>{data.pembayaran.toUpperCase()}</p>
      </div>
      <div className={styles["span-2"]}>
        <h4>Keterangan Paket</h4>
        <p>{data.keteranganBarang}</p>
      </div>
      <div className={styles["span-2"]}>
        <h4> No. Telp / No. Hp Pengirim:</h4>
        <p>{data.nohpPengirim}</p>
      </div>
      <div className={styles["span-2"]}>
        <h4> No. Telp / No. Hp Penerima:</h4>
        <p>{data.nohpPenerima}</p>
      </div>
      <div>
        <h4>Layanan</h4>
        <p>{data.layanan.toUpperCase()}</p>
      </div>
      <div>
        <h4>Subtotal Ongkir</h4>
        <h4>Diskon</h4>
      </div>
      <div>
        <p>Rp. {Number(data.subtotalOngkir).toLocaleString("id-ID")}</p>
        <p>{data.diskon.toLocaleString("id-ID")}%</p>
      </div>

      <h4>Ttd. Pengirim</h4>
      <h4>Ttd. Penenerima</h4>
      <h4>Ttd. Petugas</h4>
      <span></span>
      <span></span>
      <div>
        <h4>Biaya Surat</h4>
        <h4>Biaya Packing</h4>
        <h4>Biaya Asuransi</h4>
      </div>
      <div>
        <p>Rp. {Number(data.biayaSurat).toLocaleString("id-ID")}</p>
        <p>Rp. {Number(data.biayaPacking).toLocaleString("id-ID")}</p>
        <p>Rp. {Number(data.biayaAsuransi).toLocaleString("id-ID")}</p>
      </div>

      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <h4>Total Ongkir</h4>
      <h4>Rp. {Number(data.grandTotal).toLocaleString("id-ID")}</h4>
      <div className={styles["underline"]}></div>
      <div className={styles["underline"]}></div>
      <div className={styles["underline"]}></div>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <div className={styles["footer"]}>
        <p>
          *Periksa kembali paket yang anda terima bersama dengan kurir yang mengantar, karena komplain setelah barang
          diterima tidak akan ditanggapi
        </p>
        <p>*Dengan ini Anda telah menyetujui syarat dan ketentuan pengiriman menggunakan jasa Bista Cargo</p>
      </div>
    </div>
  );
};

export default PrintoutResi;
