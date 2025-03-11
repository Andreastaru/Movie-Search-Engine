import { useContext } from "react";
import SearchContext from "../context/SearchContext";
import {
  fetchMoviesAndTvShowsWithGenres,
  fetchMoviesAndTvShows,
  fetchTrendingMoviesAndTvShows,
} from "../api/ApiCalls";
import SearchEngine from "./SearchEngine";
import SearchResults from "./SearchResults";
import Footer from "./Footer";
import {
  trendingMapping,
  queryMapping,
  genreMapping,
} from "../constants/constants";
import { updateGenreList } from "../utils/updateGenreList";

function Container() {
  const {
    setItems,
    genreList,
    setGenreList,
    setTotalPages,
    currentPage,
    setCurrentPage,
    query,
    setQuery,
    language,
    setLanguage,
    loading,
    setLoading,
    error,
    setError,
    isGridView,
    setIsGridView,
    type,
    setType,
    genre,
    setGenre,
    hasSearched,
    setHasSearched,
    previousTypeRef,
    isSearchedByTrending,
    setIsSearchedByTrending,
    setSearchResultsType,
  } = useContext(SearchContext);

  const processResult = (result, page) => {
    if (result.startsWith("Total Pages")) {
      const [totalPages, items] = result.split(", Data: ");
      setItems(JSON.parse(items));
      setTotalPages(parseInt(totalPages.split(": ")[1]));
      setCurrentPage(page);
      setError("");
    } else {
      setError(result);
    }
    setLoading(false);
  };

  const handleSearch = async (
    searchQuery,
    searchLanguage,
    searchType,
    searchGenre
  ) => {
    setLoading(true);

    const pageToFetch =
      searchQuery !== query ||
      searchType !== previousTypeRef.current ||
      searchGenre !== genre
        ? 1
        : currentPage;

    try {
      let result;

      if (searchGenre) {
        result = await fetchMoviesAndTvShowsWithGenres(
          searchLanguage,
          pageToFetch,
          searchType,
          searchGenre
        );
        setSearchResultsType(genreMapping);
        setIsSearchedByTrending(false);
      } else if (searchQuery) {
        result = await fetchMoviesAndTvShows(
          searchQuery,
          searchLanguage,
          pageToFetch,
          searchType
        );
        setSearchResultsType(queryMapping);
        setIsSearchedByTrending(false);
      } else if (!searchQuery && !searchGenre && isSearchedByTrending) {
        result = await fetchTrendingMoviesAndTvShows(
          searchLanguage,
          pageToFetch,
          searchType
        );
        setSearchResultsType(trendingMapping);
        setIsSearchedByTrending(true);
      } else
        result =
          "To search type something, choose a genre or look what is trending";

      if (result) {
        if (!genreList[searchType]) {
          await updateGenreList(searchType, setGenreList);
        }
        processResult(result, pageToFetch);
        setQuery(searchQuery);
        setLanguage(searchLanguage);
        setType(searchType);
        setGenre(searchGenre);
        setHasSearched(true);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    setLoading(true);
    let result;
    if (!genre && query) {
      result = await fetchMoviesAndTvShows(query, language, page, type);
    } else if (genre && !query) {
      result = await fetchMoviesAndTvShowsWithGenres(
        language,
        page,
        type,
        genre
      );
    } else if (!genre && !query && isSearchedByTrending) {
      result = await fetchTrendingMoviesAndTvShows(language, page, type);
    }
    if (result) {
      processResult(result, page);
    } else {
      return null;
    }
  };

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="container-fluid p-2 mt-4 bg-dark overflow-hidden">
      <div
        className={`row justify-content-center ${
          hasSearched ? "mt-0" : "mt-5"
        }`}
      >
        <div className="col-12 col-md-8">
          <SearchEngine onSearch={handleSearch} />
        </div>
      </div>
      {hasSearched && (
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-8 ">
            {loading || error ? (
              <div className="text-white text-center">
                {loading ? "Loading..." : error}
              </div>
            ) : (
              <SearchResults
                onPageChange={handlePageChange}
                onViewToggle={handleViewToggle}
              />
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Container;
