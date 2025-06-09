// Import Dayjs
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
const BUDDHIST_YEAR_OFFSET = 543;
dayjs.extend(buddhistEra);

export default () => {
  const convertDate = (date: any) => {
    if (!date) return "";
    return dayjs(date).locale("th").format("DD MMM BB");
  };

  const formatThaiDate = (date: Date): string => {
    try {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + BUDDHIST_YEAR_OFFSET;
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error("Error formatting Thai date:", error);
      return "";
    }
  };

  return {
    convertDate,
    formatThaiDate,
  };
};
