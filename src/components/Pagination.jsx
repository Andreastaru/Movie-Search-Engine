import PropTypes from "prop-types";

function Pagination({ totalPages, currentPage, onPageChange }) {
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    const maxPagesViaAPI = 500;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    const effectiveTotalPages = Math.min(totalPages, maxPagesViaAPI);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(currentPage + halfVisiblePages, effectiveTotalPages);

    if (currentPage <= halfVisiblePages) {
      endPage = Math.min(maxVisiblePages, effectiveTotalPages);
    } else if (currentPage + halfVisiblePages >= effectiveTotalPages) {
      startPage = Math.max(effectiveTotalPages - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <li
          className={`page-item ${currentPage === i ? "active" : ""}`}
          key={i}
        >
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    if (startPage > 1) {
      items.unshift(
        <li className="page-item" key="start-ellipsis">
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChange(startPage - 1)}
          >
            ...
          </button>
        </li>
      );
      items.unshift(
        <li className="page-item" key={1}>
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
        </li>
      );
    }

    if (endPage < effectiveTotalPages) {
      items.push(
        <li className="page-item" key="end-ellipsis">
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChange(endPage + 1)}
          >
            ...
          </button>
        </li>
      );
      items.push(
        <li className="page-item" key={effectiveTotalPages}>
          <button
            className="page-link"
            href="#"
            onClick={() => onPageChange(effectiveTotalPages)}
          >
            {effectiveTotalPages}
          </button>
        </li>
      );
    }

    return items;
  };

  return (
    <footer aria-label="Page navigation">
      <ul className="pagination justify-content-center m-2">
        {getPaginationItems()}
      </ul>
    </footer>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
