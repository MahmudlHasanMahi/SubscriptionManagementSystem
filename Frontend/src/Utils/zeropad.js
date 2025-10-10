const formattedString = (number) => {
  return (number || 0).toString().padStart(2, "0");
};
export default formattedString;
