import React from 'react';
import { useNavigate } from 'react-router-dom';

const CVEDetailView = ({ cve }) => {
  const navigate = useNavigate();

  if (!cve) return null;

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
};

export default CVEDetailView;
