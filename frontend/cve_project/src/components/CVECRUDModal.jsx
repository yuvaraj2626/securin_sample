import React from 'react';

const CVECRUDModal = ({ 
  isOpen, 
  mode, 
  formData, 
  successMessage, 
  submitError, 
  onFormChange, 
  onSubmit, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="crud-modal-overlay" onClick={onClose}>
      <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{mode === 'create' ? 'Create New CVE' : 'Edit CVE (PUT)'}</h2>
        
        {successMessage && <p className="success-message">{successMessage}</p>}
        {submitError && <p className="error-message">{submitError}</p>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>CVE ID *</label>
            <input
              type="text"
              name="cveId"
              value={formData.cveId}
              onChange={onFormChange}
              disabled={mode !== 'create'}
              required
              placeholder="e.g., CVE-2024-1234"
            />
          </div>

          <div className="form-group">
            <label>Source Identifier</label>
            <input
              type="text"
              name="sourceIdentifier"
              value={formData.sourceIdentifier}
              onChange={onFormChange}
              placeholder="Source identifier"
            />
          </div>

          <div className="form-group">
            <label>Vulnerability Status</label>
            <input
              type="text"
              name="vulnStatus"
              value={formData.vulnStatus}
              onChange={onFormChange}
              placeholder="e.g., Analyzed"
            />
          </div>

          <div className="form-group">
            <label>Published Date</label>
            <input
              type="date"
              name="published"
              value={formData.published}
              onChange={onFormChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onFormChange}
              placeholder="CVE description"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Severity</label>
              <input
                type="text"
                name="severity"
                value={formData.severity}
                onChange={onFormChange}
                placeholder="e.g., HIGH"
              />
            </div>

            <div className="form-group">
              <label>Score</label>
              <input
                type="number"
                step="0.1"
                name="score"
                value={formData.score}
                onChange={onFormChange}
                placeholder="e.g., 8.5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Attack Vector</label>
              <input
                type="text"
                name="attackVector"
                value={formData.attackVector}
                onChange={onFormChange}
                placeholder="e.g., NETWORK"
              />
            </div>

            <div className="form-group">
              <label>Attack Complexity</label>
              <input
                type="text"
                name="attackComplexity"
                value={formData.attackComplexity}
                onChange={onFormChange}
                placeholder="e.g., LOW"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Exploitability Score</label>
              <input
                type="number"
                step="0.1"
                name="exploitabilityScore"
                value={formData.exploitabilityScore}
                onChange={onFormChange}
                placeholder="0.0 - 3.9"
              />
            </div>

            <div className="form-group">
              <label>Impact Score</label>
              <input
                type="number"
                step="0.1"
                name="impactScore"
                value={formData.impactScore}
                onChange={onFormChange}
                placeholder="0.0 - 6.0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {mode === 'create' ? 'Create' : 'Update (PUT)'}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CVECRUDModal;
