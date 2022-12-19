import { connectDatabase, findManyResiActive } from "../../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { cabang } = req.query;
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
    result = await findManyResiActive(client, "dataResi", cabang);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data resi tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
