import { connectDatabase, findManifestTransit } from "../../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { cabangTujuan } = req.query;
  //   console.log(cabangTujuan);
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
    result = await findManifestTransit(client, "dataManifest", cabangTujuan);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data manifest tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
