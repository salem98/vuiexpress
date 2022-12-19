const getDate = () => {
  const tgl = new Date().toLocaleString("en-UK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return tgl;
};

export default getDate;
