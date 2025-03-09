import PropTypes from "prop-types";
import { FaTh, FaList } from "react-icons/fa";
import DetailedSearchResults from "./DetailedSearchResults";
import Pagination from "./Pagination";
import SearchContext from "../context/SearchContext";
import { useContext } from "react";
import useDisabledScrolling from "../hooks/useDisabledScrolling";
import { renderItemDetails } from "../utils/renderItemDetails";
import { openInNewTab } from "../utils/openInNewTab";
import {
  genreMapping,
  queryMapping,
  TMDB,
  trendingMapping,
  typeMappingForStreaming,
} from "../constants/constants";
import StreamingPlatforms from "./StreamingPlatforms";
import { SiThemoviedatabase } from "react-icons/si";

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
    searchResultsType,
    query,
    genreList,
    searchGenre,
  } = useContext(SearchContext);

  useDisabledScrolling(selectedItem);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const titleClick = (title) => {
    const path = typeMappingForStreaming[type] + title;
    const languageForUrl = `?language=${language}`;
    const correctUrl = TMDB + path + languageForUrl;
    openInNewTab(correctUrl);
  };

  const getUserGenreNames = () => {
    return genreList[type]
      .filter((genre) => searchGenre.includes(genre.id))
      .map((genre) => genre.name);
  };

  const renderItem = (item) => {
    const { title, overview, posterPath, year } = renderItemDetails(
      type,
      language,
      item
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
              <h5 className="card-title pb-2" title={title} aria-label={title}>
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
          <button
            onClick={() => handleItemClick(item)}
            className="clicker container"
            tabIndex={0}
            aria-label={title}
          >
            <h5 aria-label={title}>
              {title} {year}
            </h5>
          </button>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-center header-white">Search Results for {type} </h2>
      <h5 className="text-center header-white h5">
        {searchResultsType === trendingMapping && "Trending this week"}
        {searchResultsType === queryMapping && `You searched for '${query}'`}
        {searchResultsType === genreMapping &&
          searchGenre.length > 0 &&
          `You searched with genres '${getUserGenreNames().join(", ")}'`}
      </h5>
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
