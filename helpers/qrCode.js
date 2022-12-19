import QRCode from "qrcode";
import { useEffect, useState } from "react";

const UseQrcode = (link) => {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(link).then((data) => setSrc(data));
  }, [link]);

  return src;
};
export default UseQrcode;
