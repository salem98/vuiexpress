import { hashPassword } from "../../../helpers/auth";
import { connectDatabase } from "../../../helpers/mongodbConnect";

const handler = async (req, res) => {
  const data = req.body;

  const { nama, posisi, posisiDesc, cabang, cabangDesc, email, password } = data;

  if (!email || !email.includes("@") || !password || password.trim().length < 6) {
    res.status(422).json({ message: "Invalid Input, cek kembali" });
    client.close();
    return;
  }

  const client = await connectDatabase();

  const db = client.db("bista");

  const existingUser = await db.collection("users").findOne({ email: email });
  const idUser = await db.collection("users").find({ cabang: cabang, posisi: posisi }).toArray();

  if (existingUser) {
    res.status(422).json({ message: "email sudah pernah terdaftar" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection("users").insertOne({
    id: idUser.length + 1,
    nama: nama,
    posisi: posisi,
    posisiDesc: posisiDesc,
    cabang: cabang,
    cabangDesc: cabangDesc,
    email: email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User berhasil didaftarkan" });
  client.close();
};

export default handler;
