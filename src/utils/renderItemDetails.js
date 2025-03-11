import {
  Movies,
  TVShows,
  English,
  Estonian,
  Spanish,
} from "../constants/constants";

export const renderItemDetails = (type, language, item = {}) => {
  let title = "";
  let overview = "";
  let posterPath = "";
  let year = "";
  let genres = "";

  const descriptionMovie = {
    [English]: `${Movies} Description is missing`,
    [Estonian]: "Filmi kirjeldus puudub",
    [Spanish]: "Falta la descripción de la película",
  };

  const descriptionTVShows = {
    [English]: `${TVShows} Description is missing`,
    [Estonian]: "Sarja kirjeldus puudub",
    [Spanish]: "Falta la descripción del programa de televisión",
  };

  const blankPicture =
    "https://th.bing.com/th/id/OIP.C6TxfpDl_h5Iy_L58rYgAAHaHa?rs=1&pid=ImgDetMain";

  const itemPicture = item.poster_path
    ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
    : blankPicture;

  const getYear = (date) => (date?.trim() ? `(${date.split("-")[0]})` : "");

  const getOverview = (overview, fallback) => {
    return overview && overview.trim() !== "" ? overview : fallback;
  };

  try {
    switch (type) {
      case Movies:
        title = item.title || "Unknown Title";
        genres = item.genre_ids;
        overview = getOverview(item.overview, descriptionMovie[language]);
        posterPath = itemPicture;
        year = getYear(item.release_date);
        break;

      case TVShows:
        title = item.name || "Unknown Name";
        genres = item.genre_ids;
        overview = getOverview(item.overview, descriptionTVShows[language]);
        posterPath = itemPicture;
        year = getYear(item.first_air_date);
        break;

      default:
        throw new Error("Invalid type");
    }
  } catch (error) {
    console.error("Error rendering item details:", error);
  }

  return { title, genres, overview, posterPath, year };
};
