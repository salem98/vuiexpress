import { connectDatabase, findManifestBelumSuratJalan } from "../../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { cabangAsal } = req.query;
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
    result = await findManifestBelumSuratJalan(client, "dataManifest", cabangAsal);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data manifest tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
