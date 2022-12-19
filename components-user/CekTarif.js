import MainNav from "./MainNav";
import Select from "react-select";

import styles from "./CekTarif.module.css";
import Button from "../components-app/ui/Button";
import Money from "../public/icons/money";
import { useEffect, useState } from "react";
import TruckIcon from "../public/icons/truck-icon";
import PlaneIcon from "../public/icons/plane-icon";

const CekTarif = () => {
  const [initValue, setInitValue] = useState({ asal: "", tujuan: "", berat: "" });
  const [listCabang, setListCabang] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);
  const [dataOngkir, setDataOngkir] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [belumTercover, setBelumTercover] = useState(false);
  const [showListOngkir, setShowListOngkir] = useState(false);

  const asalChangeHandler = (e) => {
    setInitValue({ ...initValue, asal: e.value });
    setShowListOngkir(false);
    setDataOngkir({});
  };
  const tujuanChangeHandler = (e) => {
    setInitValue({ ...initValue, tujuan: e.value });
    setShowListOngkir(false);
    setDataOngkir({});
  };
  const beratChangeHandler = (e) => {
    setInitValue({ ...initValue, berat: e.target.value });
    setShowListOngkir(false);
    setDataOngkir({});
  };

  useEffect(() => {
    fetch("/api/ongkir/cabang")
      .then((response) => response.json())
      .then((data) => {
        setListCabang(data.listCabang.map((d) => ({ label: d.toUpperCase(), value: d })));
      });
  }, []);

  useEffect(() => {
    fetch("/api/kecamatan")
      .then((response) => response.json())
      .then((data) =>
        setListKecamatan(
          data.kecamatan.map((d) => ({ label: d.kec + " - " + d.ibukota + " - " + d.prov, value: d.id }))
        )
      );
  }, []);

  const filterKecamatanChange = (val) => {
    if (val.length > 2) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    fetch("/api/ongkir/" + initValue.asal + "/" + initValue.tujuan)
      .then((response) => response.json())
      .then((data) => {
        setBelumTercover(false);
        setDataOngkir(data.ongkir);
      })
      .catch((error) => setBelumTercover(true));
    setShowListOngkir(true);
  };

  function styleShowList() {
    if (showListOngkir) {
      return "list-ongkir";
    } else {
      return "list-hidden";
    }
  }

  return (
    <>
      <MainNav />
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>
          <h2 className={styles["title"]}>Cek Tarif Ongkir Bista Cargo</h2>
          <form onSubmit={submitHandler} className={styles["options"]}>
            <div className={styles["field"]}>
              <label htmlFor="cabangAsal" className={styles["field__label"]}>
                Kota Pengirim
              </label>
              <Select
                instanceId="1"
                options={listCabang}
                className={styles["field__select"]}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 6,
                  colors: {
                    ...theme.colors,
                    primary25: "red",
                    primary: "black",
                  },
                })}
                onChange={asalChangeHandler}
              />
            </div>
            <div className={styles["field"]}>
              <label htmlFor="tujuan" className={styles["field__label"]}>
                Kecamatan Tujuan
              </label>
              <Select
                instanceId="2"
                options={showOptions ? listKecamatan : []}
                onInputChange={filterKecamatanChange}
                className={styles["field__select"]}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 6,
                  colors: {
                    ...theme.colors,
                    primary25: "red",
                    primary: "black",
                  },
                })}
                placeholder="pilih kecamatan..."
                components={{
                  DropdownIndicator: () => null,
                  IndicatorSeparator: () => null,
                  NoOptionsMessage: () => (
                    <p style={{ fontSize: "12px", color: "#555", textAlign: "Center" }}>
                      Ketik 3 huruf pertama kecamatan tujuan
                    </p>
                  ),
                }}
                onChange={tujuanChangeHandler}
              />
            </div>
            <div className={styles["field"]}>
              <label htmlFor="berat" className={styles["field__label"]}>
                Berat (Kg)
              </label>
              <input
                type="number"
                min="1"
                step="0.1"
                className={styles["field__input"]}
                onChange={beratChangeHandler}
              />
            </div>
            <div className={styles["field"]}>
              <span className={styles["field__label"]}></span>
              <Button label="Cek Tarif" color="red" icon={<Money />} type="submit" />
            </div>
          </form>
        </div>

        <div className={styles[styleShowList()]}>
          {/* Card List Ongkir Cargo */}
          <div className={styles["list-ongkir__card"]}>
            <div className={styles["card__header"]}>
              <div className={styles["card__header-left"]}>
                <div>Ongkir Cargo</div>
                <div className={styles["card__icon"]}>
                  <TruckIcon />
                </div>
              </div>
            </div>
            <div className={styles["card__content"]}>
              {dataOngkir.cargo ? (
                <table className={styles["content__table"]}>
                  <tbody>
                    <tr>
                      <td>Kota Asal</td>
                      <td>:</td>
                      <td>{initValue.asal.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>Kecamatan Tujuan</td>
                      <td>:</td>
                      <td>{dataOngkir.kec}</td>
                    </tr>
                    <tr>
                      <td>Kota Tujuan</td>
                      <td>:</td>
                      <td>{dataOngkir.ibukota}</td>
                    </tr>
                    <tr>
                      <td>Provinsi Tujuan</td>
                      <td>:</td>
                      <td>{dataOngkir.prov}</td>
                    </tr>
                    <tr>
                      <td>Ongkir per-Kg</td>
                      <td>:</td>
                      <td>Rp. {Number(dataOngkir.cargo).toLocaleString("id-ID")}</td>
                    </tr>
                    <tr>
                      <td>Estimasi</td>
                      <td>:</td>
                      <td>
                        {Number(dataOngkir.slaCargo) - 1}-{dataOngkir.slaCargo} hari
                      </td>
                    </tr>
                    <tr>
                      <td>Minimum Charges</td>
                      <td>:</td>
                      <td>{dataOngkir.minCargo} Kg</td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
              <div className={styles["content__desc"]}>
                {dataOngkir.cargo
                  ? initValue.berat === ""
                    ? null
                    : `Tarif / ongkir untuk berat barang ${initValue.berat} Kg, adalah Rp. ${(Number(initValue.berat) >=
                      Number(dataOngkir.minCargo)
                        ? Number(initValue.berat) * Number(dataOngkir.cargo)
                        : Number(dataOngkir.minCargo) * Number(dataOngkir.cargo)
                      ).toLocaleString("id-ID")}
                `
                  : "Mohon maaf untuk tujuan ini belum tercover oleh layanan Cargo"}
              </div>
            </div>
          </div>
          {/* Card List Ongkir Express */}
          <div className={styles["list-ongkir__card"]}>
            <div className={styles["card__header"]}>
              <div className={styles["card__header-left"]}>
                <div>Ongkir Express</div>
                <div className={styles["card__icon"]}>
                  <PlaneIcon />
                </div>
              </div>
            </div>
            <div className={styles["card__content"]}>
              {dataOngkir.express ? (
                <table className={styles["content__table"]}>
                  <tbody>
                    <tr>
                      <td>Kota Asal</td>
                      <td>:</td>
                      <td>{initValue.asal.toUpperCase()}</td>
                    </tr>
                    <tr>
                      <td>Kecamatan Tujuan</td>
                      <td>:</td>
                      <td>{dataOngkir.kec}</td>
                    </tr>
                    <tr>
                      <td>Kota Tujuan</td>
                      <td>:</td>
                      <td>{dataOngkir.ibukota}</td>
                    </tr>
                    <tr>
                      <td>Provinsi Tujuan</td>
                      <td>:</td>
                      <td>{dataOngkir.prov}</td>
                    </tr>
                    <tr>
                      <td>Ongkir per-Kg</td>
                      <td>:</td>
                      <td>Rp. {Number(dataOngkir.express).toLocaleString("id-ID")}</td>
                    </tr>
                    <tr>
                      <td>Estimasi</td>
                      <td>:</td>
                      <td>
                        {Number(dataOngkir.slaExpress) - 1}-{dataOngkir.slaExpress} hari
                      </td>
                    </tr>
                    <tr>
                      <td>Minimum Charges</td>
                      <td>:</td>
                      <td>{dataOngkir.minExpress} Kg</td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
              <div className={styles["content__desc"]}>
                {dataOngkir.express
                  ? initValue.berat === ""
                    ? null
                    : `Tarif / ongkir untuk berat barang ${initValue.berat} Kg, adalah Rp. ${(Number(initValue.berat) >=
                      Number(dataOngkir.minExpress)
                        ? Number(initValue.berat) * Number(dataOngkir.express)
                        : Number(dataOngkir.minExpress) * Number(dataOngkir.express)
                      ).toLocaleString("id-ID")}
              `
                  : "Mohon maaf untuk tujuan ini belum tercover oleh layanan Express"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CekTarif;
