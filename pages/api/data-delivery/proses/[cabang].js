import { connectDatabase, findDeliveryOnProses } from "../../../../helpers/mongodbConnect";

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
    result = await findDeliveryOnProses(client, "dataDelivery", cabang);
  } catch (error) {
    client.close();
    res.status(500).json({ message: "Data kurir tidak ditemukan" });
    return;
  }
  res.status(201).json(result);
};

export default handler;
