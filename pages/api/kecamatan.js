import fs from "fs";
import path from "path";

const handler = (req, res) => {
  const filePath = path.join(process.cwd(), "data", "detail-wilayah.json");
  const fileData = fs.readFileSync(filePath);
  const data = JSON.parse(fileData);
  res.status(201).json({ kecamatan: data });
};

export default handler;
