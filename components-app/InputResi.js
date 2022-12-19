import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import generateNoResi from "../helpers/generateNoResi";
import styles from "./InputResi.module.css";
import ModalPrintResi from "./ui/ModalPrintResi";

const toRupiah = (val) => {
  const convert = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" });
  return convert.format(val);
};

const initState = {
  noResi: "",
  tglTransaksi: "",
  nohpPengirim: "",
  namaPengirim: "",
  alamatPengirim: "",
  nohpPenerima: "",
  namaPenerima: "",
  alamatPenerima: "",
  layanan: "",
  cabangAsal: "",
  tujuan: "",
  dataOngkir: "",
  cabangTujuan: "",
  pembayaran: "",
  jumlahBarang: "",
  beratBarang: "",
  keteranganBarang: "",
  ongkirPerkilo: "",
  subtotalOngkir: "",
  diskon: "",
  ongkirSetelahDiskon: "",
  biayaPacking: "",
  biayaSurat: "",
  biayaAsuransi: "",
  grandTotal: "",
  petugasInput: "",
};

const InputResi = (props) => {
  const { data, status } = useSession();
  const [inputValue, setInputValue] = useState(initState);
  const [inputKecamatan, setInputKecamatan] = useState("");
  const [beratIsValid, setBeratIsValid] = useState(false);
  const [getData, setGetData] = useState([]);
  const [filteredKecamatan, setFilteredKecamatan] = useState();
  const [dataOngkir, setDataOngkir] = useState();
  const [showModal, setShowModal] = useState(false);
  const [listCabangAsal, setListCabangAsal] = useState([]);

  const [touchedField, setTouchedField] = useState({});
  const [notBlank, setNotBlank] = useState({});

  const blurFields = (e) => {
    setTouchedField((touchedField) => ({ ...touchedField, [e.target.name]: true }));
    if (e.target.value === "") {
      setNotBlank((prevNotBlank) => ({ ...prevNotBlank, [e.target.name]: false }));
    } else {
      setNotBlank((prevNotBlank) => ({ ...prevNotBlank, [e.target.name]: true }));
    }
  };

  const inputIsValid = {
    nohpPengirim: (notBlank.nohpPengirim && inputValue.nohpPengirim.length < 16) || !touchedField.nohpPengirim,
    namaPengirim: (notBlank.namaPengirim && inputValue.namaPengirim.length < 41) || !touchedField.namaPengirim,
    alamatPengirim: (notBlank.alamatPengirim && inputValue.alamatPengirim.length < 121) || !touchedField.alamatPengirim,
    nohpPenerima: (notBlank.nohpPenerima && inputValue.nohpPenerima.length < 16) || !touchedField.nohpPenerima,
    namaPenerima: (notBlank.namaPenerima && inputValue.namaPenerima.length < 41) || !touchedField.namaPenerima,
    alamatPenerima: (notBlank.alamatPenerima && inputValue.alamatPenerima.length < 121) || !touchedField.alamatPenerima,
    layanan: notBlank.layanan || !touchedField.layanan,
    cabangAsal: notBlank.cabangAsal || !touchedField.cabangAsal,
    tujuan: notBlank.tujuan || !touchedField.tujuan,
    cabangTujuan: notBlank.cabangTujuan || !touchedField.cabangTujuan,
    pembayaran: notBlank.pembayaran || !touchedField.pembayaran,
    jumlahBarang: notBlank.jumlahBarang || !touchedField.jumlahBarang,
    beratBarang: (notBlank.beratBarang || !touchedField.beratBarang) && !beratIsValid,
    keteranganBarang:
      (notBlank.keteranganBarang && inputValue.keteranganBarang.length < 81) || !touchedField.keteranganBarang,
    ongkirPerkilo: notBlank.ongkirPerkilo || !touchedField.ongkirPerkilo,
    subtotalOngkir: notBlank.subtotalOngkir || !touchedField.subtotalOngkir,
    diskon: notBlank.diskon || !touchedField.diskon,
    ongkirSetelahDiskon: notBlank.ongkirSetelahDiskon || !touchedField.ongkirSetelahDiskon,
    biayaPacking: notBlank.biayaPacking || !touchedField.biayaPacking,
    biayaSurat: notBlank.biayaSurat || !touchedField.biayaSurat,
    biayaAsuransi: notBlank.biayaAsuransi || !touchedField.biayaAsuransi,
    grandTotal: notBlank.grandTotal || !touchedField.grandTotal,
  };

  const onChange = (e) => {
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });
  };

  const kecamatanChangeHandler = (val) => {
    setInputKecamatan(val);
    if (val.length > 2) {
      setFilteredKecamatan(() => getData.filter((d) => d.kec.toLowerCase().includes(val.toLowerCase())));
    } else {
      setFilteredKecamatan([]);
    }
  };

  const layananChangeHandler = (e) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      layanan: e.target.value,
      cabangAsal: "",
      tujuan: "",
      dataOngkir: "",
      cabangTujuan: "",
      pembayaran: "",
      jumlahBarang: "",
      beratBarang: "",
      keteranganBarang: "",
      ongkirPerkilo: "",
      subtotalOngkir: "",
      diskon: "",
      ongkirSetelahDiskon: "",
      biayaPacking: "",
      biayaSurat: "",
      biayaAsuransi: "",
      grandTotal: "",
      petugasInput: "",
    }));
    setDataOngkir("");
    setInputKecamatan("");
  };

  useEffect(() => {
    fetch("/api/cabang")
      .then((response) => response.json())
      .then((data) => setListCabangAsal(data));
  }, []);

  useEffect(() => {
    if (inputValue.layanan !== "") {
      const minimumCharges = "min" + inputValue.layanan[0].toUpperCase() + inputValue.layanan.substring(1);
      if (Number(inputValue.beratBarang) < Number(inputValue.dataOngkir[minimumCharges])) {
        setBeratIsValid(true);
      } else {
        setBeratIsValid(false);
      }
    }
  }, [inputValue.beratBarang]);
  useEffect(() => {
    fetch("/api/kecamatan")
      .then((response) => response.json())
      .then((data) => setGetData(data.kecamatan));
  }, []);

  useEffect(() => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      subtotalOngkir: (inputValue.ongkirPerkilo * inputValue.beratBarang).toString(),
    }));
  }, [inputValue.beratBarang, inputValue.ongkirPerkilo]);

  useEffect(() => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      ongkirSetelahDiskon: Math.round(
        inputValue.ongkirPerkilo * inputValue.beratBarang * (1 - inputValue.diskon / 100)
      ).toString(),
    }));
  }, [inputValue.subtotalOngkir, inputValue.diskon]);

  useEffect(() => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      grandTotal: Math.round(
        inputValue.ongkirPerkilo * inputValue.beratBarang * (1 - inputValue.diskon / 100) +
          Number(inputValue.biayaAsuransi) +
          Number(inputValue.biayaPacking) +
          Number(inputValue.biayaSurat)
      ).toString(),
    }));
  }, [
    inputValue.subtotalOngkir,
    inputValue.ongkirSetelahDiskon,
    inputValue.biayaAsuransi,
    inputValue.biayaPacking,
    inputValue.biayaSurat,
  ]);

  useEffect(() => {
    if (inputValue.cabangAsal !== "" && inputValue.tujuan !== "") {
      fetch("/api/ongkir/" + inputValue.cabangAsal.toLowerCase() + "/" + inputValue.tujuan.id)
        .then((response) => {
          if (response.status == 204) {
            setInputValue((prevInputValue) => ({ ...prevInputValue, dataOngkir: "" }));
            throw new Error("Data tidak ditemukan");
          }
          return response.json();
        })
        .then((data) => {
          setDataOngkir(data.ongkir);
          setInputValue((prevInputValue) => ({ ...prevInputValue, dataOngkir: data.ongkir }));
        })
        .catch((error) => console.log(error));
    }
  }, [inputValue.cabangAsal, inputValue.tujuan]);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    const noResi = generateNoResi(data.cabang, data.posisi);
    const tgl = new Date().toLocaleString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (dataOngkir) {
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        cabangTujuan: dataOngkir.ibukota,
        ongkirPerkilo: dataOngkir[`${inputValue.layanan}`].toString(),
        noResi: noResi,
        tglTransaksi: tgl,
        petugasInput: data.nama,
      }));
    }
  }, [inputValue.beratBarang]);

  const submitHandler = (e) => {
    e.preventDefault();
    setShowModal(showModal ? false : true);
  };

  const resetFormHandler = () => {
    setInputValue(initState);
    setDataOngkir("");
    setInputKecamatan("");
    setTouchedField({});
    setFilteredKecamatan("");
    document.getElementsByName("pembayaran")[0].checked = false;
    document.getElementsByName("pembayaran")[1].checked = false;
    document.getElementsByName("pembayaran")[2].checked = false;
  };

  const onSelectKecamatan = (id) => {
    const selectedKecamatan = filteredKecamatan.filter((d) => d.id === id)[0];
    setInputKecamatan(`${selectedKecamatan.kec} - ${selectedKecamatan.kabkot} - ${selectedKecamatan.prov}`);
    setInputValue((prevInputValue) => ({ ...prevInputValue, tujuan: selectedKecamatan }));
    setFilteredKecamatan([]);
  };

  const hideModalHandler = () => {
    setShowModal(false);
  };

  return (
    <>
      <form className={styles["container"]} onSubmit={submitHandler}>
        <fieldset className={styles["card"]}>
          <label htmlFor="nohpPengirim">No. HP Pengirim</label>
          <input
            className={inputIsValid.nohpPengirim ? null : styles["error-field"]}
            type="number"
            id="nohpPengirim"
            name="nohpPengirim"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.nohpPengirim}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.nohpPengirim ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Nomor Handphone harus seusai</p>
          )}

          <label htmlFor="namaPengirim">Nama Pengirim</label>
          <input
            className={inputIsValid.namaPengirim ? null : styles["error-field"]}
            type="text"
            id="namaPengirim"
            name="namaPengirim"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.namaPengirim}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.namaPengirim ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>
              Tidak boleh ada karakter spesial dan tidak boleh lebih dari 40 karakter
            </p>
          )}

          <label htmlFor="alamatPengirim">Alamat Pengirim</label>
          <textarea
            className={inputIsValid.alamatPengirim ? null : styles["error-field"]}
            type="text"
            id="alamatPengirim"
            name="alamatPengirim"
            rows="5"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.alamatPengirim}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.alamatPengirim ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>
              Tidak boleh ada karakter spesial dan tidak boleh lebih dari 200 karakter
            </p>
          )}
        </fieldset>

        <fieldset className={styles["card"]}>
          <label htmlFor="nohpPenerima">No. HP Penerima</label>
          <input
            className={inputIsValid.nohpPenerima ? null : styles["error-field"]}
            type="number"
            id="nohpPenerima"
            name="nohpPenerima"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.nohpPenerima}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.nohpPenerima ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Nomor Handphone harus seusai</p>
          )}

          <label htmlFor="namaPenerima">Nama Penerima</label>
          <input
            className={inputIsValid.namaPenerima ? null : styles["error-field"]}
            type="text"
            id="namaPenerima"
            name="namaPenerima"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.namaPenerima}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.namaPenerima ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>
              Tidak boleh ada karakter spesial dan tidak boleh lebih dari 40 karakter
            </p>
          )}

          <label htmlFor="alamatPenerima">Alamat Penerima</label>
          <textarea
            className={inputIsValid.alamatPenerima ? null : styles["error-field"]}
            type="text"
            id="alamatPenerima"
            name="alamatPenerima"
            rows="5"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.alamatPenerima}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.alamatPenerima ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>
              Tidak boleh ada karakter spesial dan tidak boleh lebih dari 200 karakter
            </p>
          )}
        </fieldset>

        <fieldset className={styles["card"]}>
          <label htmlFor="layanan">Layanan</label>
          <select
            className={inputIsValid.layanan ? null : styles["error-field"]}
            name="layanan"
            id="layanan"
            onBlur={blurFields}
            onChange={layananChangeHandler}
            value={inputValue.layanan}
          >
            <option value=""></option>
            <option value="cargo">Cargo</option>
            <option value="express">Express</option>
          </select>
          <span></span>
          {inputIsValid.layanan ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib dipilih, tidak boleh kosong</p>
          )}

          <label htmlFor="cabangAsal">Cabang Asal</label>
          <select
            className={inputIsValid.cabangAsal ? null : styles["error-field"]}
            type="search"
            name="cabangAsal"
            id="cabangAsal"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.cabangAsal}
            placeholder="Pilih cabang asal"
          >
            <option value=""></option>
            {status === "authenticated"
              ? data.posisi === "GEN"
                ? listCabangAsal.map((d, i) => (
                    <option value={d.cab} key={i}>
                      {d.cab.toUpperCase()}
                    </option>
                  ))
                : listCabangAsal
                    .filter((d) => d.tlc === data.cabang)
                    .map((d, i) => (
                      <option value={d.cab} key={i}>
                        {d.cab.toUpperCase()}
                      </option>
                    ))
              : null}
          </select>
          <span></span>
          {inputIsValid.cabangAsal ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="tujuan">Tujuan</label>
          <input
            className={inputIsValid.tujuan ? null : styles["error-field"]}
            type="search"
            name="tujuan"
            id="tujuan"
            onBlur={blurFields}
            onChange={(e) => kecamatanChangeHandler(e.target.value)}
            value={inputKecamatan}
            autoComplete="off"
          />
          <span></span>
          {inputIsValid.tujuan ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}
          <span></span>
          {touchedField.tujuan && inputValue.dataOngkir[inputValue.layanan] === "" ? (
            <p className={styles["error-note"]}>Kecamatan tersebut belum tercover</p>
          ) : (
            <span></span>
          )}
          <span></span>
          <span className={styles["dropdown-container"]}>
            {inputKecamatan === "" ? null : (
              <div className={styles["dropdown-list"]}>
                {filteredKecamatan.map((data, idx) => (
                  <div className={styles["dropdown-select"]} key={idx} onClick={() => onSelectKecamatan(data.id)}>
                    {data.kec + " - " + data.kabkot + " - " + data.prov}
                  </div>
                ))}
              </div>
            )}
          </span>

          <label htmlFor="cabangTujuan">Cabang Tujuan</label>
          <input
            className={inputIsValid.cabangTujuan ? null : styles["error-field"]}
            type="text"
            id="cabangTujuan"
            name="cabangTujuan"
            onBlur={blurFields}
            onChange={onChange}
            value={dataOngkir && inputValue.dataOngkir[inputValue.layanan] ? dataOngkir.ibukota : ""}
            readOnly
          />
          <span></span>
          {inputIsValid.cabangTujuan ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}
          <label htmlFor="pembayaran">Metode Pembayaran</label>
          <section className={styles["card__radio"]}>
            <input type="radio" name="pembayaran" id="cash" value="cash" onBlur={blurFields} onChange={onChange} />
            <label htmlFor="cash">Cash</label>
            <input type="radio" name="pembayaran" id="cod" value="cod" onBlur={blurFields} onChange={onChange} />
            <label htmlFor="cod">COD</label>
            <input type="radio" name="pembayaran" id="top" value="top" onBlur={blurFields} onChange={onChange} />
            <label htmlFor="top">TOP</label>
          </section>
          <span></span>
          {!touchedField.pembayaran || inputValue.pembayaran !== "" ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="jumlahBarang">Jumlah Barang</label>
          <input
            className={inputIsValid.jumlahBarang ? null : styles["error-field"]}
            type="number"
            onWheel={(e) => e.target.blur()}
            min="1"
            id="jumlahBarang"
            name="jumlahBarang"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.jumlahBarang}
          />
          <span></span>
          {inputIsValid.jumlahBarang ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="beratBarang">Berat Barang</label>
          <input
            className={inputIsValid.beratBarang ? null : styles["error-field"]}
            type="number"
            onWheel={(e) => e.target.blur()}
            name="beratBarang"
            id="beratBarang"
            min="1"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.beratBarang}
          />
          <span></span>
          {inputIsValid.beratBarang ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>
              Wajib diisi, minimal berat{" "}
              {inputValue.layanan
                ? inputValue.dataOngkir["min" + inputValue.layanan[0].toUpperCase() + inputValue.layanan.substring(1)]
                : "~"}{" "}
              Kg
            </p>
          )}

          <label htmlFor="keteranganBarang">Keterangan Barang</label>
          <input
            className={inputIsValid.keteranganBarang ? null : styles["error-field"]}
            type="text"
            onWheel={(e) => e.target.blur()}
            name="keteranganBarang"
            id="keteranganBarang"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.keteranganBarang}
          />
          <span></span>
          {inputIsValid.keteranganBarang ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, maksimal 80 karakter</p>
          )}
        </fieldset>

        <fieldset className={styles["card"]}>
          <label htmlFor="ongkirPerkilo">Ongkir Per-Kilo</label>
          <input
            className={inputIsValid.ongkirPerkilo ? null : styles["error-field"]}
            type="text"
            onWheel={(e) => e.target.blur()}
            name="ongkirPerkilo"
            id="ongkirPerkilo"
            min="1"
            onBlur={blurFields}
            onChange={onChange}
            value={dataOngkir ? toRupiah(+dataOngkir[`${inputValue.layanan}`]) : ""}
            readOnly
          />
          <span></span>
          {inputIsValid.ongkirPerkilo ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}
          <label htmlFor="subtotalOngkir">Subtotal Ongkir</label>
          <input
            className={inputIsValid.subtotalOngkir ? null : styles["error-field"]}
            type="text"
            name="subtotalOngkir"
            id="subtotalOngkir"
            onBlur={blurFields}
            value={toRupiah(inputValue.subtotalOngkir)}
            readOnly
          />
          <label htmlFor="diskon">Diskon</label>
          <input
            className={inputIsValid.diskon ? null : styles["error-field"]}
            type="number"
            onWheel={(e) => e.target.blur()}
            min="0"
            max="100"
            step="0.01"
            name="diskon"
            id="diskon"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.diskon}
          />
          <span></span>
          {inputIsValid.diskon ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="ongkirSetelahDiskon">Ongkir Setelah Diskon</label>
          <input
            className={inputIsValid.ongkirSetelahDiskon ? null : styles["error-field"]}
            type="text"
            name="ongkirSetelahDiskon"
            id="ongkirSetelahDiskon"
            onBlur={blurFields}
            value={toRupiah(inputValue.ongkirSetelahDiskon)}
            readOnly
          />
          <span></span>
          {inputIsValid.ongkirSetelahDiskon ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="biayaPacking">Biaya Packing</label>
          <input
            className={inputIsValid.biayaPacking ? null : styles["error-field"]}
            type="number"
            onWheel={(e) => e.target.blur()}
            name="biayaPacking"
            id="biayaPacking"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.biayaPacking}
          />
          <span></span>
          {inputIsValid.biayaPacking ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="biayaSurat">Biaya Surat</label>
          <input
            className={inputIsValid.biayaSurat ? null : styles["error-field"]}
            type="number"
            onWheel={(e) => e.target.blur()}
            name="biayaSurat"
            id="biayaSurat"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.biayaSurat}
          />
          <span></span>
          {inputIsValid.biayaSurat ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="biayaAsuransi">Biaya Asuransi</label>
          <input
            className={inputIsValid.biayaAsuransi ? null : styles["error-field"]}
            type="number"
            onWheel={(e) => e.target.blur()}
            name="biayaAsuransi"
            id="biayaAsuransi"
            onBlur={blurFields}
            onChange={onChange}
            value={inputValue.biayaAsuransi}
          />
          <span></span>
          {inputIsValid.biayaAsuransi ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <label htmlFor="grandTotal">Grand Total</label>
          <input
            className={inputIsValid.grandTotal ? null : styles["error-field"]}
            type="text"
            name="grandTotal"
            id="grandTotal"
            onBlur={blurFields}
            value={toRupiah(inputValue.grandTotal)}
            readOnly
          />
          <span></span>
          {inputIsValid.grandTotal ? (
            <span></span>
          ) : (
            <p className={styles["error-note"]}>Wajib diisi, tidak boleh kosong</p>
          )}

          <span></span>
          <button
            className={styles["btn-order"]}
            type="submit"
            disabled={
              !Object.values(inputValue).every((d) => d !== "") || !Object.values(inputIsValid).every((d) => d == true)
            }
          >
            Create Order
          </button>
        </fieldset>
      </form>
      {showModal ? <ModalPrintResi onEdit={hideModalHandler} data={inputValue} onPrint={resetFormHandler} /> : null}
    </>
  );
};

export default InputResi;
