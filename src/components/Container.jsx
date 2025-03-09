import { useContext } from "react";
import SearchContext from "../context/SearchContext";
import {
  fetchMoviesAndTvShowsWithGenres,
  fetchMoviesAndTvShows,
} from "../api/ApiCalls";
import SearchEngine from "./SearchEngine";
import SearchResults from "./SearchResults";
import Footer from "./Footer";

function Container() {
  const {
    setItems,
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
      const result = !searchGenre
        ? await fetchMoviesAndTvShows(
            searchQuery,
            searchLanguage,
            pageToFetch,
            searchType
          )
        : await fetchMoviesAndTvShowsWithGenres(
            searchLanguage,
            pageToFetch,
            type,
            searchGenre
          );

      processResult(result, pageToFetch);

      setQuery(searchQuery);
      setLanguage(searchLanguage);
      setType(searchType);
      setGenre(searchGenre);
      setHasSearched(true);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    setLoading(true);
    if (!genre) {
      const result = await fetchMoviesAndTvShows(query, language, page, type);
      processResult(result, page);
    } else {
      const result = await fetchMoviesAndTvShowsWithGenres(
        language,
        page,
        type,
        genre
      );
      processResult(result, page);
    }
  };

  const handleViewToggle = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div
      className={`container-fluid p-2 mt-4 bg-dark overflow-hidden ${
        !query && !genre ? "app-container" : ""
      }`}
    >
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
