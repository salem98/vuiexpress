import styles from "./ModalPrintManifest.module.css";

const ModalPrintManifest = (props) => {
  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <img src="/images/bista-header.png" alt="logo bista" />
        <div>
          <h2>1 of 2</h2>
        </div>
      </div>
      <div>
        <h1>BKUBGL223344221133</h1>
        <div>Surabaya - Bengkulu</div>
      </div>
      <table>
        <tbody>
          <tr>
            <td>No Resi</td>
            <td>:</td>
            <td>BKU12123123, BKU12123123, BKU12123123,</td>
          </tr>
          <tr>
            <td>Jlh Resi</td>
            <td>:</td>
            <td>12 Resi</td>
          </tr>
          <tr>
            <td>Konsolidasi</td>
            <td>:</td>
            <td>1 Koli</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ModalPrintManifest;
