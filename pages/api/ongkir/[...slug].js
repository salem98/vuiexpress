import fs from "fs";
import path from "path";

const handler = async (req, res) => {
  const filePath = await path.join(process.cwd(), "data", "ongkir", `${req.query.slug[0]}.json`);
  let fileData;
  try {
    fileData = fs.readFileSync(filePath);
  } catch (error) {
    res.status(500).json({ message: "Data cabang asal tidak ditemukan" });
    return;
  }
  const data = JSON.parse(fileData);

  let dataOngkir;
  try {
    dataOngkir = data.find((d) => d.id == req.query.slug[1]);
  } catch (error) {
    res.status(500).json({ message: "Data kecamatan tidak ditemukan" });
    return;
  }
  if (dataOngkir) {
    res.status(200).json({ ongkir: dataOngkir });
  } else {
    res.status(204).json({ message: "Kecamatan tersebut belum tercover" });
  }
};

export default handler;
