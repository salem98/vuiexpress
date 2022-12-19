import { connectDatabase } from "../../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const { noResi } = req.query;
  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Gagal terhubung ke database" });
    return;
  }

  if (req.method === "GET") {
    const db = client.db("bista");
    let resi, manifest, suratJalan, delivery;

    try {
      resi = await db.collection("dataResi").findOne({ noResi: noResi });
    } catch (error) {
      resi = null;
    }

    try {
      manifest = await db.collection("dataManifest").findOne({ dataResi: { $elemMatch: { noResi: noResi } } });
    } catch (error) {
      manifest = null;
    }

    try {
      suratJalan = await db
        .collection("dataSuratJalan")
        .find({ dataManifest: { $elemMatch: { noManifest: manifest.noManifest } } })
        .toArray();
    } catch (error) {
      suratJalan = null;
    }

    try {
      delivery = await db
        .collection("dataDelivery")
        .find({ dataResi: { $elemMatch: { noResi: noResi } } })
        .toArray();
    } catch (error) {
      delivery = null;
    }

    const noResiCheck = !resi ? "" : resi.noResi;
    const tglResi = !resi ? "" : resi.tglTransaksi;
    const resiCreatedIn = !resi ? "" : resi.cabangAsal;
    const noManifest = !manifest ? "" : manifest.noManifest;
    const tglManifest = !manifest ? "" : manifest.tglManifest;
    const manifestCreatedIn = !manifest ? "" : manifest.cabangAsal;
    const receivedManifestAt = !manifest ? "" : manifest.receivedAt;
    const receivedManifestIn = !manifest ? "" : manifest.receivedIn;
    const listSuratJalan = !suratJalan
      ? []
      : suratJalan.map((d) => ({
          noSuratJalan: d.noSuratJalan,
          tglSuratJalan: d.tglSuratJalan,
          cabangAsal: d.cabangAsal,
          cabangTujuan: d.cabangTujuan,
          receivedIn: d.receivedIn,
          receivedAt: d.receivedAt,
        }));
    const listDelivery = !resi
      ? []
      : !resi.delivery
      ? []
      : resi.delivery.map((d) => ({
          noDelivery: d.noDelivery,
          tglDelivery: d.tglDelivery,
          namaKurir: d.namaKurir,
          statusDelivery: d.statusDelivery,
          keteranganDelivery: d.keteranganDelivery,
          deliveredAt: d.deliveredAt,
        }));

    res.json({
      noResi: noResiCheck,
      tglResi: tglResi,
      resiCreatedIn: resiCreatedIn,
      noManifest: noManifest,
      tglManifest: tglManifest,
      manifestCreatedIn: manifestCreatedIn,
      receivedManifestAt: receivedManifestAt,
      receivedManifestIn: receivedManifestIn,
      listSuratJalan: listSuratJalan,
      listDelivery: listDelivery,
    });
  }
};

export default handler;
