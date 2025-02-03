import { useContext, useEffect } from "react";
import { English, Estonian, Movies, TVShows } from "../constants/constants";
import PropTypes from "prop-types";
import { Container, Button } from "react-bootstrap";
import { fetchGenreTypesForTvOrMovies } from "../api/ApiCalls";
import SearchContext from "../context/SearchContext";
import GenreModal from "./GenreModal";
import useDisabledScrolling from "../hooks/useDisabledScrolling";

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
  } = useContext(SearchContext);

  useDisabledScrolling(isGenreModalOpen);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch();
    }, 600);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredQuery, language, type, searchGenre]);

  const handleSearch = () => {
    onSearch(deferredQuery, language, type, isGenreEnabled && searchGenre);
  };

  useEffect(() => {
    setSearchGenre([]);
    setSelectedGenres([]);
    setLocalSelectedGenres([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, !isGenreEnabled]);

  useEffect(() => {
    setSearchQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGenreEnabled]);

  const handleGenreClick = () => {
    if (!genreList[type]) {
      fetchGenreTypesForTvOrMovies(type).then((genres) => {
        setGenreList((prevGenreList) => ({
          ...prevGenreList,
          [type]: genres,
        }));
      });
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
            placeholder={`Search for ${type}...`}
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
              onChange={(e) => setType(e.target.value)}
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
