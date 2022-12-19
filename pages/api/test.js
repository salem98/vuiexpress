import { connectDatabase } from "../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { filter, update } = req.query;
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Gagal terhubung ke database" });
    return;
  }
  const db = client.db("bista");
  let result;
  try {
    result = await db.collection("dataManifest").updateMany(
      {
        noManifest: { $in: ["SBYBGL221211143833", "SBYNPH221211144002"] },
        "suratJalan.noSuratJalan": "SJSBYJKT2212111440",
      },
      {
        $set: {
          suratJalan: [
            {
              noSuratJalan: "SJSBYJKT2212111451",
              tglSuratJalan: "11 Dec 2022, 14:51",
              cabangAsal: "surabaya",
              cabangAsalTlc: "SBY",
              cabangTujuan: "jakarta",
              cabangTujuanTlc: "JKT",
              namaDriver: "INDAH CARGO",
              nopolDriver: "SBY120120120",
              konsolidasi: "1",
              beratBarang: "55",
              petugasInput: "Eri Andy Nata",
            },
          ],
        },
      }

      //   { $set: { "suratJalan.$.receivedIn": "jakarta", "suratJalan.$.receivedAt": "22-OCT-2022" } }
    );
    //   .updateOne(
    //     { noManifest: "SBYBGL221211143833", "dataManifest.id": "test" },
    //     { $set: { "dataManifest.$.type": "test" } }
    //   );
    //   $set: {receiveIn: "jakarta"});
    //   .find({
    // $set: { receivedIn: "jakarta" }
    //     noManifest: { $in: ["SBYBGL221211143833", "SBYNPH221211144002"] },
    //     suratJalan: { $elemMatch: { noSuratJalan: "SJSBYJKT2212111440" } },
    //   })
    //   .toArray();
    client.close();
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan ke database" });
    return;
  }

  res.status(201).json(result);
};

export default handler;
