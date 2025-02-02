import PropTypes from "prop-types";
import { useContext } from "react";
import { handleBackdropClick } from "../utils/handleModuleBackDropClick";
import SearchContext from "../context/SearchContext";
import { compareGenres } from "../utils/compareGenres";

function GenreModal({ isOpen, onClose }) {
  const {
    setSearchGenre,
    searchGenre,
    selectedGenres,
    setSelectedGenres,
    genreList,
    type,
    localSelectedGenres,
    setLocalSelectedGenres,
  } = useContext(SearchContext);

  const handleGenreClick = (genreId) => {
    setLocalSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genreId)
        ? prevSelectedGenres.filter((id) => id !== genreId)
        : [...prevSelectedGenres, genreId]
    );
  };

  const handleConfirm = () => {
    setSelectedGenres(localSelectedGenres);
    setSearchGenre(localSelectedGenres);
    onClose();
  };

  const handleClosingModalAndCleanUp = () => {
    setLocalSelectedGenres(selectedGenres);
    onClose();
  };

  const clearSelection = () => {
    setLocalSelectedGenres([]);
  };

  const genres = genreList[type] || [];

  const isConfirmDisabled =
    !genres.length || compareGenres(localSelectedGenres, searchGenre);

  return (
    <div
      className={`modal show d-block custom-modal rounded ${
        isOpen ? "" : "d-none"
      }`}
      onClick={(e) => handleBackdropClick(e, handleClosingModalAndCleanUp)}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Genres</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClosingModalAndCleanUp}
            ></button>
          </div>
          <div
            className={`modal-body ${
              !genres.length
                ? "d-flex justify-content-center align-items-center"
                : ""
            }`}
          >
            {!genres.length ? (
              <h5 className="text-center ">Loading...</h5>
            ) : (
              <ul className="list-group">
                {genres.map((genre) => (
                  <li
                    key={genre.id}
                    className={`list-group-item ${
                      localSelectedGenres.includes(genre.id) ? "active" : ""
                    }`}
                    onClick={() => handleGenreClick(genre.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={clearSelection}
              disabled={localSelectedGenres.length === 0}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClosingModalAndCleanUp}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

GenreModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GenreModal;
