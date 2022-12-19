import { useRef, useState } from "react";
import MainNav from "./MainNav";

import Button from "../components-app/ui/Button";
import Search from "../public/icons/search";
import LoadingSpinner from "../public/icons/loading-spinner";

import styles from "./CekPaket.module.css";
import TrackingResult from "./TrackingResult";

const CekPaket = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [dataResi, setDataResi] = useState({});
  const [noResi, setNoResi] = useState("");

  const noResiChangeHandler = (e) => {
    setNoResi(e.target.value);
    setFetchSuccess(false);
    setDataResi({});
  };

  const submitHandler = (e) => {
    setFetchSuccess(false);
    e.preventDefault();
    setIsLoading(true);
    fetch("/api/data-resi/cek-resi/" + noResi.toUpperCase())
      .then((response) => response.json())
      .then((data) => {
        setFetchSuccess(true);
        setDataResi(data);
        setIsLoading(false);
      });
  };

  return (
    <div>
      <MainNav />
      <div className={styles["container"]}>
        <div className={styles["card-1"]}>
          <h2 className={styles["title"]}>Cek Paket</h2>
          <form className={styles["form-container"]} onSubmit={submitHandler}>
            <label htmlFor="noResi">Nomor Resi</label>
            <input
              type="text"
              id="noResi"
              name="noResi"
              placeholder="Ketik Nomor Resi..."
              onChange={noResiChangeHandler}
              value={noResi}
              required
              autoComplete="off"
            />
            {isLoading ? (
              <div className={styles["icon"]}>
                <LoadingSpinner />
              </div>
            ) : (
              <Button label="Cek Status Paket" color="red" icon={<Search />} width="full" />
            )}
          </form>
        </div>
        <div className={styles["card-2"]}>
          <h2 className={styles["title"]}>Detail Posisi Paket</h2>

          {fetchSuccess ? (
            dataResi.noResi === "" || noResi === "" ? (
              <div>Nomor Resi Tidak Terdaftar</div>
            ) : (
              <TrackingResult dataResi={dataResi} />
            )
          ) : isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>Silahkan ketik nomor resi...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CekPaket;
