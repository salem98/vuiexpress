import { connectDatabase, findSuratJalanBelumReceive } from "../../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { cabangTujuan } = req.query;
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Gagal terhubung ke database" });
    return;
  }

  let result;
  try {
    result = await findSuratJalanBelumReceive(client, "dataSuratJalan", cabangTujuan);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data Surat Jalan tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
