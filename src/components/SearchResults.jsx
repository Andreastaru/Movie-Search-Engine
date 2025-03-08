import PropTypes from "prop-types";
import { FaTh, FaList } from "react-icons/fa";
import DetailedSearchResults from "./DetailedSearchResults";
import Pagination from "./Pagination";
import SearchContext from "../context/SearchContext";
import { useContext } from "react";
import useDisabledScrolling from "../hooks/useDisabledScrolling";
import { renderItemDetails } from "../utils/renderItemDetails";
import { openInNewTab } from "../utils/openInNewTab";
import { IMDB } from "../constants/constants";
import StreamingPlatforms from "./StreamingPlatforms";

function SearchResults({ onPageChange, onViewToggle }) {
  const {
    items,
    totalPages,
    currentPage,
    language,
    isGridView,
    type,
    selectedItem,
    setSelectedItem,
  } = useContext(SearchContext);

  useDisabledScrolling(selectedItem);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const titleClick = (title) => {
    const correctUrl = IMDB + title;
    openInNewTab(correctUrl);
  };

  const renderItem = (item) => {
    const { title, overview, posterPath, year } = renderItemDetails(
      item,
      type,
      language
    );

    return (
      <div
        className={`fade-in
          ${
            isGridView
              ? "col-lg-6 col-xl-4 mb-4"
              : "list-group-item m-2 hover-effect rounded"
          }`}
        key={item.id}
      >
        {isGridView ? (
          <div className="card rounded" style={{ height: "100%" }}>
            <img src={posterPath} className="card-img-top" alt={title} />
            <div className="card-body bg-light">
              <h5
                className="card-title hover-effect-text pb-2"
                onClick={() => titleClick(title)}
                title={IMDB + title}
                aria-label={title}
              >
                {title} {year}
              </h5>
              <StreamingPlatforms item={item} />
              <p
                className="card-text"
                style={{
                  overflowY: "auto",
                  maxHeight: "calc(100% - 80px)",
                }}
              >
                {overview}
              </p>
            </div>
          </div>
        ) : (
          <div onClick={() => handleItemClick(item)}>
            <h5 aria-label={title}>
              {title} {year}
            </h5>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-center">Search Results</h2>
      {items.length > 0 && (
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-outline-primary" onClick={onViewToggle}>
            {isGridView ? <FaList /> : <FaTh />}
          </button>
        </div>
      )}
      <div
        className={isGridView ? "row g-4" : "list-group justify-content-center"}
      >
        {items.map(renderItem)}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      {selectedItem && (
        <DetailedSearchResults
          item={selectedItem}
          type={type}
          language={language}
          titleClick={titleClick}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

SearchResults.propTypes = {
  onPageChange: PropTypes.func.isRequired,
  onViewToggle: PropTypes.func.isRequired,
};

export default SearchResults;
