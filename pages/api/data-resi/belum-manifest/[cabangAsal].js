import { connectDatabase, findResiBelumManifest } from "../../../../helpers/mongodbConnect";

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
    result = await findResiBelumManifest(client, "dataResi", cabangAsal);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data cabang tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
