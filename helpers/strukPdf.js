import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import QRCode from "qrcode";

const base64logo = () => {
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAuCAYAAAAWYZTNAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAEKtJREFUeJztnX+UVdV1xz/vzRt+2PnhkARmEAN1JDAmCqL2hxJ+dAAxaVBbzcK6stpYlERNidFFmmJFuuoqCxexxiat1anVFqqSgBYUrJlkcETjj2AU+ekQfojoAMOPGWbkx8zs/rHf67tz39n33vdmULH3u9ZZ771799l333PvPmfvffY5L0EfQGAwMAm4FBgNVAOfAUqBLqAdaAbeATYDLwJrE9DWF9ePESNGnhAoFbhRoFGgW0DyLCcFVgpcK1D8cd9PjBinIxLAlDzoO6bB8ZUwox/cCgzqIzl2AfcCDyXgRB/xjBHj/wVOApJPGQjyxyA/A+nOf+QNKpsEJn88zRAjxumJdvJUYG+ZCLKvb5W4W+B+gX4fQ1vEiHHa4RC9UGBALgI50bdKLAIvSt+Z6DFifGqxj14qMCCP9r0Ci8BGgbM+8haJEeM0QQLYg0NJkonEyUVf/zpt7e3F7x46xDMbNtDc2moyuu6SS1g6a5b+WLcOHnusr2TcBHw5AQf7imGMGJ8m/BbHiFpRXi5eHDx4UKqrq80RePLkyVniurq+HokbJZ5qihEjB0k0Cp2DAWec0eN3RUUFtbW1JqOqqqo+FcyH8cA9p/ICMWKcjkhizLsOGDAg59i+fftMRpdeemmfCWXgDoEJp/oiMWKcbliPwySuqanpYUKvWLFCUqmU03yurKyU9vb2U2lCZ8rbsSkdI0YWKYwRePv27VRXV1NSUsLx48fZunWrk0FpaSkrV67kDJ/JfYrwReAvgIcKrD8JvecwHEODeztD6MbhnupqA14JqVuDZsGdBXwWOIrmi+8FGtHYRAYTKbzjOgD8xnG8Fg1iuvAhsK7A63lxJur+fBHNjS8HWtIyNQEvAIeNuoOBCwJ47wC2B5wfBZwdUc6jaJ5+S0R6L4YAfwh8AahIl3Y06NoCbEDfhc4QPiXAl4GL0PehJC3XPuBl4CXguKviCxQ4dVRbWyvbt2+XHJy6EVgEtks0JXRhf573eAB4GH04Lqw26r0WIMMM9KGGXfsdIB3W51iecnvLBw4ZLgipcwIoC7iHMIwHnkFf2qDrdAILDB5/H1L36RAZ/jGkvqv8BrgRdS2DMAD4S+CNiHzbgB8YvM4B6lDlDOJxCLgT+B0/g/oCblQAKS0tldmzZ+cq8alVYBG4MqSBLbxX4L2eAL7p4Pe0Qe8avYqAx/K87vfRFV0FPZ90cZlOd0aod7WjXhiKgQfylG+2wSusk2slOFvv3jzl8Jb/AQYafMcCWwrgeauD17VAR5581uOb9rVGkciltLRUGhsbP0oF/qnRuGHY2Yv77AR+z8fvpwbtLxzX/kkB15wCjOiFzIK7M3k1Qr1/djVgAJLAfxcg31gHr3Mi1p0UIM89BcjiLf/m4FmLuheF8Dvfx+sbQHeBvDaRHolNH7iqqorx48cDcOaZZ9LU1ERDQwMikkPb1tbGzJkzaWpq0uj1xRfDwoUutvDhh3DPPdAZ5hIE4qsCAxPamPnAWul0FDWLgkzzIuAW9OUP4+c//vvAt6MI6IGgve05edbzw+/XDQUujlDv8jyvcxfwtTzrtANvO47PiFh/GtBgnOvtqrY/B/6ObBxkJLAMfU/yRQuw0fP7PLSDtGIQYahBLYybwRhFZsyYkeParlixQpLJpNkzrFq1KtcfdmHhwr4Yhe1JaRtvG7JPS5//HHAHtu+23sfv3w06v3/2uEH3MvqyXgksAnZ7zmWCWNVop/FL4FngSeApg18n8Gia5nl044S7fbLMNuq6ykhHG7pQRfDItAN4BI0n1KOxBcFWvl9ElO/XATL9jVGnCVWAi1C/NMiEvcnDb3kA3Ubgh2l+i4CV6KCQOb/CJ9syg083+u7cCcwPaYdjQCXAUhfBVVdd5dS9MWPGmA26ePHiaArc3S1yxRW9VeD5AQ/PghV08M8vv2zQ/cpH95BB96SPbrNBd5uPrgiYCWxDXwQLVhDqaECdDJ511HsO96o0l9/mQlDA6SFyLZtidLR2rUUfhHuJ6wrHsS40Wu3CHYY8/k7YUnRJ3xfAl7DN3WXoc/OjHLXY3kx/ZjAce4Bwma2PBMh3WwpjeqKjo4Pdu3fT0NDAK6+8QnNzMy0tLWzatMlFDsCxY8f0S1sb7N+fSzBiBCSTkEjAo4/ChRfCe++Z/EIwuoA6llnlDM874J+OiWpCVxp089GetC5dpwsdrR8PkcPyP6JMVbjWWz+M+lSX+Y5fDvxTCE+ArxjHDwNzHHKdREcpi5df4TtQhbzKdzwJTAWWOPhEfTYvGXSgzwPUSrLM3XkeOi+OAD9OFy+m4VZ40DiJH4vQqVMXxpPQiFuOdpeXl5sjrVWWLFmiI+zDD7tHzQULeo7Ea9eKFBUVOgIHmU8WGg3Zx3horsTd255E5zO9sKYq6nx0G0PabjfwLaKvgf6CwcfRa/bAnzrqdKFztD90nGuLIFN5modLnmcj3o8XTzr4rEmfc80iWKtmvm3I9IKPboZBJ2igCdQdcZ23UxNtWCPqUexOos2o806yOJWqcNU4cuRIXlINGDCA6dOnBxMtWAD19dnfEybA/Pl5XceDQtYKO/O+gVWokm1C/Ut/Q3aj/tBG3/GovfyqELnORoMa29LXCUvasO7DOp6BKzi0Hg2yuOauS8gdlf0Yhj1vujekrh/9AddL9PP056uOc1Nxv/hRn803nFTq02c6ICsWsNM4HgQrKHkEVUoXdhvHByWLEgmnAueLuXPnMmhQiE51d8P118MHntyCefNg6tRCLllIooH1UIehkcEax7k2dLrikTz4+U3yxUR7mYcDD6JTP58PoCvEhC4Cvuo4HqQcEB6NDnroh0Lq+jEJnff24/n0p6uTqaSnBZVB0LO+He0olwDXGHT/SjaCb91ju3E8CJa+BblxVmyjlP5FRe+Tp6nsL1dffbV0dXVlTWPLhM6U6dNFvPTNzSJDh+ZrQheS9lbIPKWg15pHbk8/36B3BaDGAO/mcc0t2A+7yqgTlFo4wajzR+nzCbLRYW/xB338qA24B9dcahBcc+XNZNt9inGduQ5eMwPkCitvkU3kSGAHsDzmpIkkmho5JP27yeC1J4BHg1GnJXmyu7tXScypVIqlS5eSTIZln3mwZg0s8rzjgwfrBgD58NBMnHwRZmJaGIRGJP3JDfkExd4ELgTuI1rPPQrNxHKhkBHYlb3WQTaII7hHuLFkXz4XrFxmsIN3LiRwzyNnMgUBXvd898JlJRQ6D/wqapZncgwEewR06c65aR7bUQukC41N3Jc+b/mmQfPLVn7CwZSIrC0rLf1aa5u9x3p5eTmVlZWMHDmSoUOHUllZSSqVor6+nq6urtylh+PHw4MPBsgDpFLQ1QVF6YBcbS1cdx0scQUU3cJHJfTAeqiT0A7hCOrvLMKdSH8TqsRvhvCzjh8Avgf8Q/rzVtTPtHA98NeO44X4wC7/txj16zvQl/GzDpoE+kL/p8E3KHD2pXR9y7fzYhxq3voxHVWGjIxCriV0GRpF93aMhXbWP0JHfS9acJv2ro6tP3CJ4/gxDy8XKtJ1XZ2/69qQTpMdR4A5MWfOnMAp3c7Ozmhzv1Fw8835mND/ZdxUEKxcZH+C+IiANrnZQ/dXBo1f6S7A7V9/DvWPra19u3BHgUsM+jcdtKD+faHmpAD/YfDN4IOAuiGRzf/Dgl7K6PfvLy+QzwE0W80LK4mjm1z/+FyDNjOdtCjg2v50S9DOqtWg/0GSgHzSZDLJ3Lku9yKLoiJrSuuUY0sf8urv+x30ly9W4kAQv/vRJJK76Rl8248GVO42+LThHs2t6Qb/dTOImppowYr0ZrA24FwdmvXkRxm6DC/Dt9AFKhlETf18Fs1uuwC3K/MZNGDpvd9Gg1eCnkkaYAejutOfLwbIdq3j2B/gHoEFWJVE/8/IiSFDhjB0qL8z+sTAatQgWKaId+VJf4K37/FmnkThBzp/3B8Neu1CkyOmo9NHn0dNTRfeMo5b17XiGb1V4CG4Fx1kEOQvDUV9618DP0PzDt5CXaCXUOtnOO5Icj7wK7DVRl1omuoG7CDbNOA7nt9LsPPu70Y76KnoCDouRM41wPvGue+jHcI5aJtPRpNsXKhH74F1GEP6uHHj+s487lsTukMKSyr/uXGvG9C80waCt9ntpKefttCg+5GHZnAAv7BiTXGMNuhd/mgl7kSL/WhQ6Hlf2WvwdvniXhSyrjwTAPuOcX4bquRe+eqxXY4RHnm+adA876EZEcCrA3U9MrivgPvzlgc8vG7vJa9jeDqKTRbhlClTPqkKvIzCEGUZXVBZ7ONnLRH09pqTC7zWM9gJEpcYdVwm4SyD9i6Dt5Ub7Foi6cUwNPiTzz1m8nKtTKdRxrXeMui9a4vnGDT+5ZXOtQDpsp5sDGIAxvZTEYtXgZNEX7DhKrd4GVkLlzl+PGqK8EeOsKCKBcusCoOgPbB/WieKKetPv4yCNag/1G2ct5JYBpLrq1rmsxVDcC3vA430BkXM96Bbwviz1YKwF912Z6Lj3AnseW1Lxmme70Ft5MW9pnQ67fe36e/HUDO9IYA+KrqBPyGbRBMVJ4Ab8ORXJwmYx2tu9kfTPxH4LYXl2EL+2Vu7gH9B/b/vkTvPavHzKnATKm+UlULb0NS+r6AmnAWr40jQ8wU9A/vfJzcbxy0F7Ef4H89tQzc9uA1tuzDsBa7AnTrahD2vbclYS3bONGp84g16mtUZdKCjpLej24/6ujehWx5FwV40RvCI7/hh9N5vJTxLrxO1FM7380mkhXQ+mFQqxaFDhygpCep4A7BzJwwcCEOC8gA8uOUW+IlrQUYP3JiwHfswTETn24rR4Ek/9IFm/Ok21Azdhb5AQdkxYG9q14K+GF6k0Jd7FBrYGZyWoRkNavyS6KNXJXbgq4Hsi19G7i4iGazFPVeaJJud5UcT+eX/1qBB0rPQdipGX9x9qDm6Hm2L4Y66B7GzwKqwLZt1aMDJ2tTOtWHfuWin8x767N9Bn1/YXHINapmMQKPX/dL830fb6nWCs+MyKELdosvQtipD38PMhoRrCUhc+jEB9vYTTzyRvy/7xhsi552X9VknTxbZs6cvfOB4W9kYMXz4MwIUuKamRlpbW6Mrb1ubyPDhuco3YUJvFbhb1MeKESOGB0MI2bZ07Nixsnr1auno6BARkdbWVtm8ebPU1dXJrFmzZMeOHVklXL3aVsLdu3ujwMYmWzFixKgjYgg75Tj2q6eeyirh8uW2Em7ZkqV77jmRioqepX9/q26DFL4XdIwYn3pUk11QnHd59/HHs4q5b59IWVmuEo4c2XMJ4QMPRJ3zfVviP/qOESMU11DAPrVJkBPf/W5PU3j58p5KPGyYyGuv9aSZPj2q8sZ/8B0jRkTMQMP8kRW4CkRKS3VRvhfNzSLLlomsWiXiD4K9/rpIIhGmvC+IvaA9RowYBkahmU4niKDA4zIKN3WqyMmTwUEqEZHDh0VGjw6LNt8v0Td4ixEjhgPD0O0s69CJ700D4fDZ0DkW5HKQeSBrvco3bZr6wBa2bhU5//wwk3nix3rXMWJ8miFQJnCXwAGnEpaVidx+u0h9vciuXSJNTWpG33CDSHGxpbg7BL4lcZJGjBgfDQRKBGYJrE2bvVGjyplyXOBpgWtixY0RozAU+udKPSC6l9IkNO+1BvhddLuYUnQtauaPirehSfSNQGMiWoJ/jBgxDPwvWenyf8wjofQAAAAASUVORK5CYII=";
};

const generateBase64 = (img) => {
  let qr64;
  QRCode.toDataURL(img, function (err, url) {
    qr64 = url;
  });
  return qr64;
};

const strukPdf = (data) => {
  let imglogo = base64logo();
  let base64qrcode = generateBase64("https://bistacargo.com/cek/paket/" + data.noResi);
  const doc = new jsPDF("p", "mm", [80, 100]);

  doc.addImage(imglogo, "PNG", 2, 2, 38.4, 7.36);
  doc.addImage(base64qrcode, "PNG", 55, 71.5, 25, 25);
  doc.setFontSize(4);
  doc.text("* Struk ini adalah bukti pembayaran yang sah", 2, 96);
  doc.text("* Syarat & Ketentuan silahkan cek di www.bistacargo.com", 2, 98);
  doc.text("Scan QR Code", 58, 96);
  doc.text("untuk cek posisi paket", 58, 98);
  doc.line(2, 94, 55, 93.9, "S");

  // Awal Table
  doc.autoTable({
    theme: "plain",
    startY: 12,
    margin: { top: 10, right: 2, left: 2, bottom: 2 },
    tableWidth: "auto",
    styles: {
      cellPadding: 0.1,
      fontSize: 7,
    },
    body: [
      [{ content: "Pengirim :" }],
      [{ content: data.namaPengirim }],
      [{ content: data.alamatPengirim }],
      [{ content: "No. Telp/Hp: " + data.nohpPengirim }],
    ],
  });

  doc.autoTable({
    theme: "plain",
    startY: doc.lastAutoTable.finalY + 2,
    margin: { top: 10, right: 2, left: 2, bottom: 2 },
    tableWidth: "auto",
    styles: {
      cellPadding: 0.1,
      fontSize: 7,
    },
    body: [
      [{ content: "Penerima :" }],
      [{ content: data.namaPenerima }],
      [{ content: data.alamatPenerima }],
      [{ content: "No. Telp/Hp: " + data.nohpPenerima }],
    ],
  });

  doc.autoTable({
    theme: "plain",
    startY: doc.lastAutoTable.finalY + 2,
    margin: { top: 10, right: 2, left: 2, bottom: 2 },
    tableWidth: 76,
    styles: {
      cellPadding: 0.1,
      fontSize: 7,
    },
    columnStyles: {
      0: {
        cellWidth: 20,
      },
      1: {
        cellWidth: 2,
      },
      2: {
        cellWidth: "auto",
      },
    },
    body: [
      ["Nomor Resi", ":", data.noResi],
      ["Tgl Transaksi", ":", data.tglTransaksi],
      ["Layanan", ":", data.layanan.toUpperCase()],
      ["Jlh Paket", ":", data.jumlahBarang + " Koli"],
      ["Total Berat", ":", data.beratBarang + " Kg"],
      ["Keterangan", ":", data.keteranganBarang],
      ["Ongkir Per-Kilo", ":", "Rp. " + Number(data.ongkirPerkilo).toLocaleString("id-ID")],
      ["Subtotal Ongkir", ":", "Rp. " + Number(data.subtotalOngkir).toLocaleString("id-ID")],
      ["Diskon", ":", data.diskon + " %"],
      ["Ongkir + Diskon", ":", "Rp. " + Number(data.ongkirSetelahDiskon).toLocaleString("id-ID")],
      ["Biaya Packing", ":", "Rp. " + Number(data.biayaPacking).toLocaleString("id-ID")],
      ["Biaya Surat", ":", "Rp. " + Number(data.biayaSurat).toLocaleString("id-ID")],
      ["Biaya Asuransi", ":", "Rp. " + Number(data.biayaAsuransi).toLocaleString("id-ID")],
      ["Total Ongkir", ":", "Rp. " + Number(data.grandTotal).toLocaleString("id-ID")],
      ["Pembayaran", ":", data.pembayaran.toUpperCase()],
    ],
  });

  window.open(doc.output("bloburl"), "_blank");
};

export default strukPdf;
