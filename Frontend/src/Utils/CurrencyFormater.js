const formatCurrency = (price) => {
  return new Intl.NumberFormat("EG-AR", {
    style: "currency",
    currency: "SAR",
  }).format(price);
};
export default formatCurrency;
