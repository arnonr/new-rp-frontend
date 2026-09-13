import ExcelJS from "exceljs";
import dayjs from "dayjs";

export const exportReviewerExcel = async (items: Array<any>): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SCI-RP System";
  workbook.lastModifiedBy = "Admin";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("รายชื่อกรรมการ", {
    views: [{ showGridLines: true }],
  });

  // Define columns
  worksheet.columns = [
    { header: "ลำดับ", key: "no", width: 8 },
    { header: "ตำแหน่งทางวิชาการ", key: "prefix_name", width: 18 },
    { header: "ชื่อ", key: "firstname", width: 20 },
    { header: "นามสกุล", key: "surname", width: 20 },
    { header: "ชื่อ-นามสกุล", key: "fullname", width: 30 },
    { header: "อีเมล", key: "email", width: 28 },
    { header: "หน่วยงาน", key: "organization_name", width: 30 },
    { header: "ที่อยู่ตามบัตรประชาชน", key: "address", width: 45 },
    { header: "ธนาคาร", key: "name_bank", width: 20 },
    { header: "ชื่อบัญชีธนาคาร", key: "name_account_bank", width: 25 },
    { header: "เลขที่บัญชีธนาคาร", key: "no_account_bank", width: 22 },
    { header: "สถานะ", key: "status_name", width: 14 },
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.font = {
      name: "Sarabun",
      family: 2,
      size: 11,
      bold: true,
      color: { argb: "FF000000" },
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFDE68A" }, // Soft amber/yellow
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFD1D5DB" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "medium", color: { argb: "FF9CA3AF" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } },
    };
  });

  // Add data rows
  items.forEach((it, idx) => {
    const fullname =
      it.fullname ||
      `${it.prefix_name ? it.prefix_name + " " : ""}${it.firstname || ""} ${it.surname || ""}`.trim();

    const row = worksheet.addRow({
      no: idx + 1,
      prefix_name: it.prefix_name || "-",
      firstname: it.firstname || "-",
      surname: it.surname || "-",
      fullname: fullname || "-",
      email: it.email || "-",
      organization_name: it.organization_name || "-",
      address: it.address || "-",
      name_bank: it.name_bank || "-",
      name_account_bank: it.name_account_bank || "-",
      no_account_bank: it.no_account_bank ? String(it.no_account_bank) : "-",
      status_name: Number(it.is_active) === 1 ? "ใช้งาน" : "ไม่ใช้งาน",
    });

    row.height = 22;
    row.eachCell((cell, colNumber) => {
      cell.font = { name: "Sarabun", size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };

      // Alignment: center for No. and Status; left for others
      if (colNumber === 1 || colNumber === 12) {
        cell.alignment = { vertical: "middle", horizontal: "center" };
      } else {
        cell.alignment = { vertical: "middle", horizontal: "left" };
      }

      // Explicit string format for account number to preserve leading 0
      if (colNumber === 11) {
        cell.numFmt = "@";
      }
    });
  });

  // Auto-fit column width based on content
  worksheet.columns.forEach((column) => {
    let maxLength = column.header ? column.header.length * 2 : 10;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const cellVal = cell.value ? String(cell.value) : "";
      if (cellVal.length > maxLength) {
        maxLength = Math.min(cellVal.length + 4, 50);
      }
    });
    column.width = Math.max(maxLength, 12);
  });

  // Generate buffer and trigger browser download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const fileName = `รายชื่อกรรมการ_${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
