const ErrorToString = (detail) => {
  const data = detail.error.data;
  return Object.keys(data)
    .flatMap((key) => `${key}: ${data[key]}`)
    .join(", ");
};
export default ErrorToString;
