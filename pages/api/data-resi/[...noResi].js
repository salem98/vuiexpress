import { connectDatabase, findResi } from "../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { noResi } = req.query;
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
    result = await findResi(client, "dataResi", noResi[0]);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Nomor Resi tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
