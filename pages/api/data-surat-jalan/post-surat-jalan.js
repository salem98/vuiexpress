import { connectDatabase, insertDocument } from "../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Gagal terhubung ke database" });
    return;
  }

  if (req.method === "POST") {
    let result;
    try {
      result = await insertDocument(client, "dataSuratJalan", req.body);
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Gagal menyimpan ke database" });
      return;
    }

    res.status(201).json({ message: "Data berhasil di upload" });
  }
};

export default handler;
