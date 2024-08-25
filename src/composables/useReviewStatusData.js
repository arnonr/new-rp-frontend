export default () => {
  const statuses = [
    {
      id: 1,
      name_th: "Wating",
      name_en: null,
      bg_color: "#f8285a",
      bg_bs_color: "primary",
    },
    {
      id: 2,
      name_th: "Accept",
      name_en: null,
      bg_color: "#ffc107",
      bg_bs_color: "success",
    },
    {
      id: 3,
      name_th: "ConditionAccept",
      name_en: null,
      bg_color: "#FFC0CB",
      bg_bs_color: "success",
    },
    {
      id: 4,
      name_th: "Reject",
      name_en: null,
      bg_color: "#17c653",
      bg_bs_color: "error",
    },
    {
      id: 5,
      name_th: "Comment",
      name_en: null,
      bg_color: "#ff0505",
      bg_bs_color: "error",
    },
  ];

  return {
    statuses,
  };
};
