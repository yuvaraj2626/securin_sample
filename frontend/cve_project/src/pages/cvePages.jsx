import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchAllCVEs, 
  fetchCVEById, 
  fetchCVEsByYear, 
  fetchCVEsByScore, 
  fetchCVEsByModifiedDays 
} from '../services/appService.js';
import './cvePages.css';

const CVEPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // List view states
  const [cves, setCVEs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [year, setYear] = useState('');
  const [score, setScore] = useState('');
  const [days, setDays] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');

  // Detail view states
  const [cve, setCVE] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch CVE list
  useEffect(() => {
    if (id) return; // Skip if viewing detail

    const fetchCVEs = async () => {
      setLoading(true);
      try {
        let data;
        if (year) {
          data = await fetchCVEsByYear(year, currentPage, resultsPerPage);
        } else if (score) {
          data = await fetchCVEsByScore(score, currentPage, resultsPerPage);
        } else if (days) {
          data = await fetchCVEsByModifiedDays(days, currentPage, resultsPerPage);
        } else {
          data = await fetchAllCVEs(currentPage, resultsPerPage);
        }
        
        setCVEs(data.cves || []);
        setTotalRecords(data.totalRecords || 0);
        setTotalPages(Math.ceil((data.totalRecords || 0) / resultsPerPage));
      } catch (err) {
        setError('Failed to fetch CVEs');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCVEs();
  }, [currentPage, resultsPerPage, year, score, days, id]);

  // Fetch CVE detail
  useEffect(() => {
    if (!id) return;

    const getCVEDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchCVEById(id);
        setCVE(data);
      } catch (err) {
        setError('Failed to fetch CVE details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    getCVEDetail();
  }, [id]);

  const handleFilterApply = (filterType, value) => {
    if (!value) return;
    switch (filterType.toLowerCase()) {
      case 'year':
        setYear(value);
        setScore('');
        setDays('');
        break;
      case 'score':
        setScore(value);
        setYear('');
        setDays('');
        break;
      case 'days':
        setDays(value);
        setYear('');
        setScore('');
        break;
      default:
        console.error('Invalid filter type');
        break;
    }
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleResultsPerPageChange = (e) => {
    setResultsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Detail view
  if (id && cve) {
    return (
      <div className="cve-detail-container">
        <button className="back-button" onClick={() => navigate('/cves/list')}>
          ← Back to List
        </button>
        
        <h1>{cve.cveId}</h1>
        
        <h3>Description:</h3>
        <p>{cve.description || 'No description available'}</p>
        
        <h3>CVSS Metrics:</h3>
        <p>
          <span>Severity:</span> {cve.severity || 'N/A'} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>Score:</span> <span className="red">{cve.score || 'N/A'}</span>
        </p>
        
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Attack Vector</th>
              <th>Attack Complexity</th>
              <th>Exploitability Score</th>
              <th>Impact Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cve.attackVector || 'N/A'}</td>
              <td>{cve.attackComplexity || 'N/A'}</td>
              <td>{cve.exploitabilityScore || 'N/A'}</td>
              <td>{cve.impactScore || 'N/A'}</td>
            </tr>
          </tbody>
        </table>

        <h3>Additional Information:</h3>
        <p><span>Status:</span> {cve.vulnStatus || 'N/A'}</p>
        <p><span>Published:</span> {new Date(cve.published).toLocaleDateString()}</p>
        <p><span>Last Modified:</span> {new Date(cve.lastModified).toLocaleDateString()}</p>
      </div>
    );
  }

  // List view
  return (
    <div className="cve-list-container">
      <h1 className="cve-list-title">CVE List</h1>

      <div className="filter-dropdown-container">
        <button
          className="filter-dropdown-button"
          onClick={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          Filter Options
        </button>

        {showFilterDropdown && (
          <div className="filter-dropdown-menu">
            <div
              className="filter-dropdown-item"
              onClick={() => setSelectedFilter('Year')}
            >
              Year
            </div>
            <div
              className="filter-dropdown-item"
              onClick={() => setSelectedFilter('Score')}
            >
              Score
            </div>
            <div
              className="filter-dropdown-item"
              onClick={() => setSelectedFilter('Days')}
            >
              Modified in Last (days)
            </div>
          </div>
        )}

        {selectedFilter && (
          <div className="filter-input-container">
            <label>
              {selectedFilter}: &nbsp;
              <input
                type={selectedFilter === 'Score' || selectedFilter === 'Days' ? 'number' : 'text'}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="filter-input"
              />
            </label>
            <button
              className="apply-filter-button"
              onClick={() => {
                handleFilterApply(selectedFilter, filterValue);
                setShowFilterDropdown(false);
                setSelectedFilter('');
                setFilterValue('');
              }}
            >
              Apply Filter
            </button>
          </div>
        )}
      </div>

      <h3>Total Records: {totalRecords}</h3>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="cve-list-table">
        <thead>
          <tr className="cve-list-header">
            <th className="cve-list-header-cell">CVE ID</th>
            <th className="cve-list-header-cell">Severity</th>
            <th className="cve-list-header-cell">Score</th>
            <th className="cve-list-header-cell">Published Date</th>
            <th className="cve-list-header-cell">Status</th>
          </tr>
        </thead>
        <tbody>
          {cves.length > 0 ? (
            cves.map((cveItem) => (
              <tr 
                key={cveItem.cveId} 
                className="cve-list-row" 
                onClick={() => navigate(`/cves/${cveItem.cveId}`)}
                style={{ cursor: 'pointer' }}
              >
                <td className="cve-list-cell">{cveItem.cveId}</td>
                <td className="cve-list-cell">{cveItem.severity || 'N/A'}</td>
                <td className="cve-list-cell">{cveItem.score || 'N/A'}</td>
                <td className="cve-list-cell">
                  {cveItem.published ? new Date(cveItem.published).toLocaleDateString() : 'N/A'}
                </td>
                <td className="cve-list-cell">{cveItem.vulnStatus || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="cve-list-cell cve-list-no-data">
                No CVEs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-container">
        <div className="results-per-page">
          <label htmlFor="results-per-page">Results Per Page:</label>
          <select
            id="results-per-page"
            value={resultsPerPage}
            onChange={handleResultsPerPageChange}
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
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
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
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="pagination-button"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVEPage;
