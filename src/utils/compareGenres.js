export const compareGenres = (arr1, arr2) =>
  JSON.stringify([...arr1].sort((a, b) => a - b)) ===
  JSON.stringify([...arr2].sort((a, b) => a - b));
