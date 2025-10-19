const formatCurrency = (price) => {
  return new Intl.NumberFormat("EG-EG", {
    style: "currency",
    currency: "SAR",
  }).format(price);
};
export default formatCurrency;
