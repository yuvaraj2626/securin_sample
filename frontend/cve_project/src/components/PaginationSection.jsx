import React from 'react';

const PaginationSection = ({ 
  currentPage, 
  totalPages, 
  resultsPerPage, 
  totalRecords, 
  onPageChange, 
  onResultsPerPageChange 
}) => {
  return (
    <div className="pagination-container">
      <div className="results-per-page">
        <label htmlFor="results-per-page">Results Per Page:</label>
        <select
          id="results-per-page"
          value={resultsPerPage}
          onChange={onResultsPerPageChange}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div className="cve-list-pagination">
        <h4>
          {currentPage * resultsPerPage - resultsPerPage + 1} -{' '}
          {Math.min(currentPage * resultsPerPage, totalRecords)} of {totalRecords} records
        </h4>

        <div className="pagination-buttons">
          <button
            className="pagination-button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="pagination-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationSection;
