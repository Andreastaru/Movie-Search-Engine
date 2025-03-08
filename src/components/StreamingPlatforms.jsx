import { useState, useContext } from "react";
import PropTypes from "prop-types";
import SearchContext from "../context/SearchContext";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { fetchStreamingPlatforms } from "../api/ApiCalls";

const StreamingPlatforms = ({ item, modalButton }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState(null);
  const { type } = useContext(SearchContext);
  const [error, setError] = useState(null);

  const typeMappingForStreaming = {
    "TV Shows": "tv/",
    Movies: "movie/",
  };

  const fetchStreamingPlatformsFromApi = async (id) => {
    try {
      const data = await fetchStreamingPlatforms(id);

      return data.streamingOptions;
    } catch (error) {
      setError(error);
      console.error("Error fetching streaming platforms:", error);
      return null;
    }
  };

  const handleClick = () => {
    setIsLoading(true);
    const id = typeMappingForStreaming[type] + item.id;
    fetchStreamingPlatformsFromApi(id)
      .then((result) => {
        setFeedback(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const simpleClick = (code) => {
    const streamingOptions = feedback[code];
    if (streamingOptions?.length > 0) {
      const extractedDetails = streamingOptions.map((option) => ({
        platform: option.service.name,
        type: capitalizeFirstLetter(option.type),
        price: option.price?.formatted,
        link: option.link,
        image: option.service.imageSet.lightThemeImage,
      }));
      setDetails(extractedDetails);
      setShowDetails(true);
    } else {
      console.warn(`No streaming options available for ${code}`);
    }
  };

  const handleCloseDetails = () => setShowDetails(false);

  const button = !feedback && !error && (
    <button
      type="button"
      className="btn btn-dark shadow-lg rounded w-100"
      aria-label="Find streaming platforms"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <span
          className="spinner-border spinner-border-sm me-2"
          aria-hidden="true"
        ></span>
      ) : (
        "Where to Watch"
      )}
    </button>
  );

  let output;

  if (!feedback) {
    output = null;
  } else if (showDetails && details) {
    output = (
      <div className={`p-3 ${modalButton ? "overflow-auto" : ""}`}>
        <button
          type="button"
          className="btn-close float-end"
          aria-label="Close"
          onClick={handleCloseDetails}
        ></button>
        <h5>Streaming Details</h5>
        <div className={modalButton ? "streaming-details-wrapper" : ""}>
          {details.map((detail, index) => (
            <div key={index} className="mb-3">
              <img
                src={detail.image}
                alt={`${detail.platform} logo`}
                style={{ width: "50px", height: "50px" }}
              />
              <p>
                <strong>Platform:</strong> {detail.platform}
              </p>
              <p>
                <strong>Type:</strong> {detail.type}
              </p>
              {detail.price && (
                <p>
                  <strong>Price:</strong> {detail.price}
                </p>
              )}
              <a
                href={detail.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Watch Now
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (feedback && Object.keys(feedback).length > 0) {
    output = (
      <div>
        {Object.keys(feedback).map((code) => (
          <span
            tabIndex={0}
            key={code}
            className={`fi fi-${code} rounded m-2 custom-flag`}
            style={{ width: "26.67px", height: "20px", cursor: "pointer" }}
            onClick={() => simpleClick(code)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                simpleClick(code);
              }
            }}
            aria-label={`Flag for ${code}`}
          ></span>
        ))}
      </div>
    );
  } else {
    output = (
      <div className="alert alert-dark" role="alert">
        Couldn&apos;t find any Streaming Platforms
      </div>
    );
  }

  return (
    <div className={`d-block ${modalButton ? "" : "mb-4"}`}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {button}
      {output}
    </div>
  );
};

StreamingPlatforms.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  modalButton: PropTypes.bool,
};

export default StreamingPlatforms;
