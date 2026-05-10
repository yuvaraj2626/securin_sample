import React from 'react';
import { useNavigate } from 'react-router-dom';

const CVETable = ({ cves, loading, error, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div>
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
            <th className="cve-list-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cves.length > 0 ? (
            cves.map((cveItem) => (
              <tr key={cveItem.cveId} className="cve-list-row">
                <td 
                  className="cve-list-cell cve-id-cell" 
                  onClick={() => navigate(`/cves/${cveItem.cveId}`)}
                  style={{ cursor: 'pointer', color: '#0066cc' }}
                >
                  {cveItem.cveId}
                </td>
                <td className="cve-list-cell">{cveItem.severity || 'N/A'}</td>
                <td className="cve-list-cell">{cveItem.score || 'N/A'}</td>
                <td className="cve-list-cell">
                  {cveItem.published ? new Date(cveItem.published).toLocaleDateString() : 'N/A'}
                </td>
                <td className="cve-list-cell">{cveItem.vulnStatus || 'N/A'}</td>
                <td className="cve-list-cell action-buttons">
                  <button className="btn-action btn-view" onClick={() => navigate(`/cves/${cveItem.cveId}`)}>View</button>
                  <button className="btn-action btn-edit" onClick={() => onEdit(cveItem)}>Edit</button>
                  <button className="btn-action btn-delete" onClick={() => onDelete(cveItem.cveId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="cve-list-cell cve-list-no-data">
                No CVEs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CVETable;
