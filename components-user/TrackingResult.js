import styles from "./TrackingResult.module.css";
import Check from "../public/icons/check";

const TrackingResult = (props) => {
  return (
    <div>
      {/* Transaksi */}
      <div className={styles["content"]}>
        <div className={styles["content__icon"]}>
          <Check />
        </div>
        <div className={styles["content__detail"]}>
          <div className={styles["content__title"]}>
            Transaksi Pengiriman [Cabang {props.dataResi.resiCreatedIn.toUpperCase()}]
          </div>
          <div className={styles["content__date"]}>{props.dataResi.tglResi}</div>
        </div>
      </div>

      {/* Manifest */}
      {props.dataResi.noManifest === "" ? null : (
        <div className={styles["content"]}>
          <div className={styles["content__icon"]}>
            <Check />
          </div>
          <div className={styles["content__detail"]}>
            <div className={styles["content__title"]}>
              Proses Pemberangkatan [Gateway {props.dataResi.manifestCreatedIn.toUpperCase()}]
            </div>
            <div className={styles["content__date"]}>{props.dataResi.tglManifest}</div>
          </div>
        </div>
      )}

      {/* Surat Jalan */}
      {props.dataResi.listSuratJalan.length === 0
        ? null
        : props.dataResi.listSuratJalan.map((d, i) => (
            <div key={i}>
              <div className={styles["content"]}>
                <div className={styles["content__icon"]}>
                  <Check />
                </div>
                <div className={styles["content__detail"]}>
                  <div className={styles["content__title"]}>Paket Berangkat Menuju {d.cabangTujuan.toUpperCase()}</div>
                  <div className={styles["content__date"]}>{d.tglSuratJalan}</div>
                </div>
              </div>
              {d.receivedAt ? (
                <div className={styles["content"]}>
                  <div className={styles["content__icon"]}>
                    <Check />
                  </div>
                  <div className={styles["content__detail"]}>
                    <div className={styles["content__title"]}>Paket Telah Sampai di {d.receivedIn.toUpperCase()}</div>
                    <div className={styles["content__date"]}>{d.receivedAt}</div>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

      {/* Receive Manifest */}
      {props.dataResi.noManifest === "" ? null : (
        <div className={styles["content"]}>
          <div className={styles["content__icon"]}>
            <Check />
          </div>
          <div className={styles["content__detail"]}>
            <div className={styles["content__title"]}>
              Proses Sorting [Gateway {props.dataResi.receivedManifestIn.toUpperCase()}]
            </div>
            <div className={styles["content__date"]}>{props.dataResi.receivedManifestAt}</div>
          </div>
        </div>
      )}

      {/* Delivery */}
      {props.dataResi.listDelivery.map((d, i) => (
        <div key={i}>
          <div className={styles["content"]}>
            <div className={styles["content__icon"]}>
              <Check />
            </div>
            <div className={styles["content__detail"]}>
              <div className={styles["content__title"]}>Paket Sedang Diantar [{d.namaKurir}]</div>
              <div className={styles["content__date"]}>{d.tglDelivery}</div>
            </div>
          </div>
          {d.deliveredAt ? (
            <div className={styles["content"]}>
              <div className={styles["content__icon"]}>
                <Check />
              </div>
              <div className={styles["content__detail"]}>
                <div className={styles["content__title"]}>
                  {d.statusDelivery === "diterima"
                    ? "Paket Telah Diterima Oleh - " + d.keteranganDelivery
                    : d.statusDelivery === "gagal"
                    ? "Paket Tidak Terantar - " + d.keteranganDelivery
                    : ""}
                </div>
                <div className={styles["content__date"]}>{d.deliveredAt}</div>
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default TrackingResult;
