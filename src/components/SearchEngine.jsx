import { useContext, useEffect, useState } from "react";
import {
  English,
  Estonian,
  Movies,
  Spanish,
  trendingMapping,
  TVShows,
} from "../constants/constants";
import PropTypes from "prop-types";
import { Container, Button } from "react-bootstrap";
import SearchContext from "../context/SearchContext";
import GenreModal from "./GenreModal";
import useDisabledScrolling from "../hooks/useDisabledScrolling";
import { updateGenreList } from "../utils/updateGenreList";

function SearchEngine({ onSearch }) {
  const {
    searchQuery,
    setSearchQuery,
    language,
    setLanguage,
    type,
    setType,
    searchGenre,
    setSearchGenre,
    genreList,
    setGenreList,
    isGenreEnabled,
    setIsGenreEnabled,
    deferredQuery,
    isGenreModalOpen,
    setIsGenreModalOpen,
    setSelectedGenres,
    loading,
    setLocalSelectedGenres,
    previousTypeRef,
    setIsSearchedByTrending,
    isSearchedByTrending,
    previousLanguageRef,
    searchResultsType,
  } = useContext(SearchContext);

  const [userSearchedForTrendingData, setUserSearchedForTrendingData] =
    useState(false);

  useDisabledScrolling(isGenreModalOpen);

  const handleTypeChange = (value) => {
    setSearchGenre([]);
    setSelectedGenres([]);
    setLocalSelectedGenres([]);
    setType(value);
  };

  useEffect(() => {
    if (!isGenreEnabled) {
      setSearchGenre([]);
      setSelectedGenres([]);
      setLocalSelectedGenres([]);
    }
    setUserSearchedForTrendingData(false);
    setSearchQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenreEnabled]);

  useEffect(() => {
    const shouldSearchImmediately = () => {
      return (
        language !== previousLanguageRef.current ||
        type !== previousTypeRef.current ||
        (isSearchedByTrending && userSearchedForTrendingData) ||
        (isGenreEnabled && searchGenre)
      );
    };

    if (shouldSearchImmediately()) {
      handleSearch();
      previousLanguageRef.current = language;
      previousTypeRef.current = type;
    } else {
      const handler = setTimeout(() => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(handler);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQuery, language, type, searchGenre, userSearchedForTrendingData]);

  const handleTrendingClick = () => {
    setSearchQuery("");
    setIsSearchedByTrending(true);
    setUserSearchedForTrendingData(true);
    if (isGenreEnabled) setIsGenreEnabled(false);
    if (isGenreModalOpen) setIsGenreModalOpen(false);
  };
  const handleSearch = () => {
    onSearch(deferredQuery, language, type, isGenreEnabled && searchGenre);
  };

  const handleGenreClick = async () => {
    if (!genreList[type]) {
      await updateGenreList(type, setGenreList);
    }
    setIsGenreModalOpen(true);
  };

  return (
    <Container fluid>
      <div
        className={`search-section p-4 bg-dark text-white rounded shadow ${
          loading ? "active" : ""
        } `}
      >
        <h2 className="text-center mb-4 header">
          Find {type} via search or Genre
        </h2>
        <div className="form-group margin-right-1">
          <input
            type="text"
            className="form-control m-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setUserSearchedForTrendingData(false)}
            placeholder={`Search for ${type} or enter keywords...`}
            disabled={isGenreEnabled}
            style={{ borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <div className="d-flex justify-content-center">
          <div className="form-group mx-2" style={{ flex: 1 }}>
            <select
              className="form-control"
              style={{
                cursor: "pointer",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value={English}>English</option>
              <option value={Spanish}>Spanish</option>
              <option value={Estonian}>Estonian</option>
            </select>
          </div>
          <div className="form-group mx-2" style={{ flex: 1 }}>
            <select
              className="form-control"
              style={{
                cursor: "pointer",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value={Movies}>{Movies}</option>
              <option value={TVShows}>{TVShows}</option>
            </select>
          </div>
        </div>

        <div className="form-group d-flex align-items-center">
          <input
            type="checkbox"
            className="m-2"
            style={{ cursor: "pointer" }}
            checked={isGenreEnabled}
            onChange={(e) => setIsGenreEnabled(e.target.checked)}
            onClick={() => setUserSearchedForTrendingData(false)}
          />
          <label className="m-2">{`Enable this to search most popular ${type} by genre`}</label>
          <Button
            className="form-control m-2 custom-dropdown"
            style={{
              cursor: "pointer",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
            onClick={handleGenreClick}
            disabled={!isGenreEnabled}
          >
            {searchGenre.length > 0
              ? genreList[type]
                  .filter((genre) => searchGenre.includes(genre.id))
                  .map((genre) => genre.name)
                  .join(", ")
              : "Select a genre"}
          </Button>
        </div>
        <div className="form-group d-flex align-items-center">
          <button
            type="button"
            className="btn btn-primary shadow-lg rounded w-100"
            aria-label={`Search what ${type} are trending at the moment`}
            onClick={() => handleTrendingClick()}
            disabled={searchResultsType === trendingMapping}
          >
            {`Find Trending ${type}`}
          </button>
        </div>
      </div>
      <GenreModal
        isOpen={isGenreModalOpen}
        onClose={() => setIsGenreModalOpen(false)}
      />
    </Container>
  );
}

SearchEngine.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchEngine;
