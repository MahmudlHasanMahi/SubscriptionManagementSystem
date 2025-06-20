const ArrayDifference = (arr1, arr2) => {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) return true;
  const ids1 = new Set(arr1.map((item) => item.id));
  const ids2 = new Set(arr2.map((item) => item.id));

  if (ids1.size !== ids2.size) return true;

  for (let id of ids1) {
    if (!ids2.has(id)) return true;
  }

  return false;
};
export default ArrayDifference;
