const ErrorToString = (detail) => {
  const data = detail.error.data;
  console.log(data);
  return Object.keys(data)
    .flatMap((key) => `${key}: ${data[key]}`)
    .join(", ");
};
export default ErrorToString;
