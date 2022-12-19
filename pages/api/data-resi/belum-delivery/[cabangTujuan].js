import { connectDatabase, findResiBelumDelivery } from "../../../../helpers/mongodbConnect";

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
    result = await findResiBelumDelivery(client, "dataResi", cabangTujuan);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data cabang tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
