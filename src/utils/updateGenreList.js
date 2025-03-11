import { fetchGenreTypesForTvOrMovies } from "../api/ApiCalls";

export const updateGenreList = async (type, setGenreList) => {
  const genres = await fetchGenreTypesForTvOrMovies(type);
  setGenreList((prevGenreList) => ({
    ...prevGenreList,
    [type]: genres,
  }));
};
