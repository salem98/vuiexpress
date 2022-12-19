import fs from "fs";
import path from "path";

const handler = async (req, res) => {
  const filePath = await path.join(process.cwd(), "data", "cabang.json");
  const fileData = fs.readFileSync(filePath);
  const data = await JSON.parse(fileData);

  const getCabang = data.map((d) => ({ tlc: d.covTlc, cab: d.cov }));
  const tlcCabang = getCabang.map((d) => d.tlc);
  const listCabang = getCabang.filter(({ tlc }, index) => !tlcCabang.includes(tlc, index + 1));
  res.status(201).json(listCabang);
};

export default handler;
