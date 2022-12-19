const generateNoManifest = (tlcAsal, tlcTujuan) => {
  const cabangAsal = tlcAsal.toUpperCase();
  const cabangTujuan = tlcTujuan.toUpperCase();
  const date = new Date();
  const tahun = date.getFullYear().toString().slice(-2);
  const bulan = ("0" + (date.getMonth() + 1).toString()).slice(-2);
  const tanggal = ("0" + date.getDate().toString()).slice(-2);
  const jam = ("0" + date.getHours().toString()).slice(-2);
  const menit = ("0" + date.getMinutes().toString()).slice(-2);
  const detik = ("0" + date.getSeconds().toString()).slice(-2);
  return cabangAsal + cabangTujuan + tahun + bulan + tanggal + jam + menit + detik;
};

export default generateNoManifest;
