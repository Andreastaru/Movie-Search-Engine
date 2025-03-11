export const getGenreNames = (genreList, type, genreIds) => {
  if (!genreList[type]) {
    return "Genres not yet available";
  }

  return genreList[type]
    .filter((genre) => genreIds.includes(genre.id))
    .map((genre) => genre.name)
    .join(", ");
};
