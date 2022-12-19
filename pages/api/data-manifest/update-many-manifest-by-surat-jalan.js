import { connectDatabase, updateManyManifestBySuratJalan } from "../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { filter, update } = req.body;

  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Gagal terhubung ke database" });
    return;
  }

  if (req.method === "PATCH") {
    let result;
    try {
      result = await updateManyManifestBySuratJalan(client, "dataManifest", filter, update);
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Gagal menyimpan ke database" });
      return;
    }

    res.status(201).json({ message: "Data berhasil di upload" });
  }
};

export default handler;
