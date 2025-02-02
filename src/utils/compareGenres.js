export const compareGenres = (arr1, arr2) => {
  const sortedArr1 = arr1.slice().sort((a, b) => a - b);
  const sortedArr2 = arr2.slice().sort((a, b) => a - b);

  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
};
