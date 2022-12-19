import { useSession } from "next-auth/react";
import { useState } from "react";
import Refresh from "../../public/icons/refresh";
import Button from "./Button";
import LoadingPage from "./LoadingPage";
import styles from "./ModalUpdateDelivery.module.css";

const ModalUpdateDelivery = (props) => {
  const { data, status } = useSession();
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [statusDelivery, setStatusDelivery] = useState("");
  const [keteranganDelivery, setKeteranganDelivery] = useState("");
  const [hubunganPenerima, setHubunganPenerima] = useState("");

  const statusChangeHandler = (e) => {
    setStatusDelivery(e.target.value);
  };

  const keteranganChangeHandler = (e) => {
    setKeteranganDelivery(e.target.value);
  };

  const hubunganChangeHandler = (e) => {
    setHubunganPenerima(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoadingPage(true);
    const keterangan =
      hubunganPenerima === "" ? keteranganDelivery : keteranganDelivery + " [" + hubunganPenerima + "]";

    props.onReset();
    const tgl = new Date().toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const filter = {
      noResi: props.noResi,
      noDelivery: props.noDelivery,
    };

    const update = {
      statusDelivery: statusDelivery,
      keteranganDelivery: keterangan,
      deliveredAt: tgl,
      deliveredBy: data.nama,
    };

    fetch("/api/data-resi/update-one-resi-by-delivery", {
      method: "PATCH",
      body: JSON.stringify({ filter: filter, update: update }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 201) {
        fetch("/api/data-delivery/update-delivery", {
          method: "PATCH",
          body: JSON.stringify({ filter: filter, update: update }),
          headers: { "Content-Type": "application/json" },
        }).then((response) => {
          if (response.status === 201) {
            setStatusDelivery("");
            setKeteranganDelivery("");
            setHubunganPenerima("");
            props.onCloseModal();
            props.onSet(props.cabang, props.kurir);
            setIsLoadingPage(false);
            alert("Status Delivery Resi Berhasil di Update");
          } else {
            setIsLoadingPage(false);
            alert("Gagal Update Data Delivery");
          }
        });
      } else {
        setIsLoadingPage(false);
        alert("Gagal Update Data Resi");
      }
    });
  };

  return (
    <div className={styles["container"]}>
      {isLoadingPage ? <LoadingPage /> : null}
      <div>
        <form className={styles["form-container"]}>
          <>
            <div className={styles["form-title"]}>Update Status Delivery</div>
            <div className={styles["form-text"]}>{props.noResi}</div>
            <div className={styles["form-field"]}>
              <label htmlFor="status">Status</label>
              <select name="status" id="status" onChange={statusChangeHandler} value={statusDelivery}>
                <option value="" disabled={true}>
                  --Pilih Status--
                </option>
                <option value="gagal">GAGAL</option>
                <option value="diterima">DITERIMA</option>
              </select>
            </div>

            {statusDelivery === "gagal" ? (
              <div className={styles["form-field"]}>
                <label htmlFor="keterangan"></label>
                <input
                  type="text"
                  id="keterangan"
                  name="keterangan"
                  autoComplete="off"
                  placeholder="isi Keterangan..."
                  required
                  value={keteranganDelivery}
                  onChange={keteranganChangeHandler}
                />
              </div>
            ) : null}

            {statusDelivery === "diterima" ? (
              <div className={styles["form-field"]}>
                <label htmlFor="keterangan">Penerima</label>
                <input
                  type="text"
                  id="keterangan"
                  name="keterangan"
                  autoComplete="off"
                  placeholder="nama penerima..."
                  required
                  value={keteranganDelivery}
                  onChange={keteranganChangeHandler}
                />
                <label htmlFor="hubungan">Keterangan</label>
                <select name="hubungan" id="hubungan" value={hubunganPenerima} onChange={hubunganChangeHandler}>
                  <option value="" disabled={true}>
                    --keterangan penerima--
                  </option>
                  <option value="yang bersangkutan">Yang bersangkutan</option>
                  <option value="suami / istri">Suami / Istri</option>
                  <option value="orang tua">Orang Tua</option>
                  <option value="anak">Anak</option>
                  <option value="kakak / adik / saudara">Kakak / Adik / Saudara</option>
                  <option value="rekan kerja">Rekan Kerja</option>
                  <option value="security / satpam">Security / Satpam</option>
                  <option value="tetangga">Tetangga</option>
                </select>
              </div>
            ) : null}

            <div>
              <Button
                label="Update Status"
                color="red"
                width="full"
                icon={<Refresh />}
                clickHandler={submitHandler}
                disabled={(!statusDelivery, !keteranganDelivery)}
              />
            </div>
          </>
        </form>
      </div>
      <div className={styles["backdrop"]} onClick={props.onCloseModal}></div>
    </div>
  );
};

export default ModalUpdateDelivery;
