import { Movies, TVShows, English, Estonian } from "../constants/constants";

export const renderItemDetails = (item = {}, type, language) => {
  let title = "";
  let overview = "";
  let posterPath = "";
  let year = "";

  const descriptionMovie = {
    [English]: `${Movies} Description is missing`,
    [Estonian]: `Filmi kirjeldus puudub`,
  };

  const descriptionTVShows = {
    [English]: `${TVShows} Description is missing`,
    [Estonian]: `Sarja kirjeldus puudub`,
  };

  const blankPicture =
    "https://th.bing.com/th/id/OIP.C6TxfpDl_h5Iy_L58rYgAAHaHa?rs=1&pid=ImgDetMain";

  const itemPicture = item.poster_path
    ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
    : blankPicture;

  const getYear = (date) =>
    date && date.trim() ? `(${date.split("-")[0]})` : "";

  const getOverview = (overview, fallback) => {
    return overview && overview.trim() !== "" ? overview : fallback;
  };

  try {
    switch (type) {
      case Movies:
        title = item.title || "Unknown Title";
        overview = getOverview(item.overview, descriptionMovie[language]);
        posterPath = itemPicture;
        year = getYear(item.release_date);
        break;

      case TVShows:
        title = item.name || "Unknown Name";
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

  return { title, overview, posterPath, year };
};
