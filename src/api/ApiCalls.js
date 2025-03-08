import axios from "axios";
import { TVShows, Movies } from "../constants/constants";

const apiUrls = {
  [Movies]: {
    search: import.meta.env.VITE_MOVIES_API_URL,
    genre: import.meta.env.VITE_MOVIES_GENRE_API_URL,
    genreList: import.meta.env.VITE_GENRELIST_MOVIES,
  },
  [TVShows]: {
    search: import.meta.env.VITE_TVSHOW_API_URL,
    genre: import.meta.env.VITE_TVSHOW_GENRE_API_URL,
    genreList: import.meta.env.VITE_GENRELIST_TVSHOW,
  },
};

async function fetchData(apiUrl, params, headers) {
  try {
    const response = await axios.get(apiUrl, { params, headers });
    return response.data;
  } catch (error) {
    if (error.response.status === 429) {
      return "Too many requests. Please try again later.";
    } else {
      console.error(`Error fetching data:`, error);
      throw error;
    }
  }
}

export async function fetchMoviesAndTvShows(query, language, pageNr, type) {
  if (!query) {
    return `To search, you have to type something`;
  }

  const apiUrl = apiUrls[type]?.search;
  if (!apiUrl) {
    return `Invalid search type: ${type}`;
  }

  const params = {
    api_key: import.meta.env.VITE_API_KEY,
    language: language,
    query: query,
    page: pageNr,
    include_adult: false,
  };

  const data = await fetchData(apiUrl, params);
  if (typeof data === "string") return data;

  const {
    total_pages: totalPages,
    results: items,
    total_results: results,
  } = data;

  if (pageNr > totalPages) {
    return fetchMoviesAndTvShows(query, language, 1, type);
  }

  if (!results) {
    return `No ${type} found for ${query}`;
  }

  return `Total Pages: ${totalPages}, Data: ${JSON.stringify(items)}`;
}

export async function fetchGenreTypesForTvOrMovies(type) {
  const apiUrl = apiUrls[type]?.genreList;
  if (!apiUrl) {
    return `Invalid search type: ${type}`;
  }

  const params = {
    api_key: import.meta.env.VITE_API_KEY,
  };

  const data = await fetchData(apiUrl, params);
  if (typeof data === "string") return data;

  return data.genres;
}

export async function fetchMoviesAndTvShowsWithGenres(
  language,
  pageNr,
  type,
  genreId
) {
  if (!genreId.length) {
    return `To search, you have to select a Genre`;
  }

  const apiUrl = apiUrls[type]?.genre;
  if (!apiUrl) {
    return `Invalid search type: ${type}`;
  }

  const params = {
    api_key: import.meta.env.VITE_API_KEY,
    language: language,
    page: pageNr,
    include_adult: false,
    with_genres: genreId,
  };

  const data = await fetchData(apiUrl, params);
  if (typeof data === "string") return data;

  const {
    total_pages: totalPages,
    results: items,
    total_results: results,
  } = data;

  if (pageNr > totalPages) {
    return fetchMoviesAndTvShowsWithGenres(language, 1, type, genreId);
  }

  if (!results) {
    return `No ${type} found`;
  }

  return `Total Pages: ${totalPages}, Data: ${JSON.stringify(items)}`;
}

export async function fetchStreamingPlatforms(typeAndId) {
  const baseUrl = import.meta.env.VITE_STREAMING_PLATFORMS_API_URL;
  const apiUrl = `${baseUrl}/${typeAndId}`;
  const params = {
    series_granularity: "episode",
    output_language: "en",
  };

  const headers = {
    "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
    "x-rapidapi-key": import.meta.env.VITE_STREAMING_PLATFORMS_API_KEY,
  };

  try {
    const data = await fetchData(apiUrl, params, headers);
    return data;
  } catch (error) {
    console.error(`Error fetching streaming platforms:`, error);
    throw error.message;
  }
}
