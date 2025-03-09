import PropTypes from "prop-types";
import { renderItemDetails } from "../utils/renderItemDetails";
import { handleBackdropClick } from "../utils/handleModuleBackDropClick";
import StreamingPlatforms from "./StreamingPlatforms";
import { SiThemoviedatabase } from "react-icons/si";

function DetailedSearchResults({ item, type, onClose, language, titleClick }) {
  const { title, overview, posterPath, year } = renderItemDetails(
    type,
    language,
    item
  );

  return (
    <div
      className="modal show d-block custom-modal rounded"
      onClick={(e) => handleBackdropClick(e, onClose)}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" title={title} aria-label={title}>
              {title} {year}
              <SiThemoviedatabase
                onClick={() => titleClick(item.id)}
                className="hover-effect-text logo-click"
                size={36}
                style={{
                  marginLeft: "0.5rem",
                }}
              />
            </h5>
            <button
              type="button"
              className="btn-close mb-2"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center">
            <img
              src={posterPath}
              className="img-fluid mb-3 custom-image align-center"
              alt={title}
            />
            <p>{overview}</p>
          </div>
          <div className="modal-footer-custom">
            <StreamingPlatforms item={item} modalButton />
            <button
              type="button"
              aria-label="close"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DetailedSearchResults.propTypes = {
  language: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    name: PropTypes.string,
    overview: PropTypes.string,
    poster_path: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  titleClick: PropTypes.func.isRequired,
};

export default DetailedSearchResults;
