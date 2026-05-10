import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  fetchAllCVEs, 
  fetchCVEById, 
  fetchCVEsByYear, 
  fetchCVEsByScore, 
  fetchCVEsByModifiedDays,
  createCVE,
  updateCVE,
  deleteCVE
} from '../services/appService.js';
import CVETable from '../components/CVETable.jsx';
import CVEDetailView from '../components/CVEDetailView.jsx';
import CVECRUDModal from '../components/CVECRUDModal.jsx';
import FilterSection from '../components/FilterSection.jsx';
import PaginationSection from '../components/PaginationSection.jsx';
import './cvePages.css';

const CVEPage = () => {
  const { id } = useParams();

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

  // CRUD modal states
  const [showCRUDModal, setShowCRUDModal] = useState(false);
  const [crudMode, setCRUDMode] = useState('create');
  const [formData, setFormData] = useState({
    cveId: '',
    sourceIdentifier: '',
    vulnStatus: '',
    published: '',
    description: '',
    severity: '',
    score: '',
    attackVector: '',
    attackComplexity: '',
    exploitabilityScore: '',
    impactScore: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch CVE list
  useEffect(() => {
    if (id) return;

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

  const openCreateModal = () => {
    setCRUDMode('create');
    setFormData({
      cveId: '',
      sourceIdentifier: '',
      vulnStatus: '',
      published: '',
      description: '',
      severity: '',
      score: '',
      attackVector: '',
      attackComplexity: '',
      exploitabilityScore: '',
      impactScore: ''
    });
    setShowCRUDModal(true);
    setSubmitError('');
    setSuccessMessage('');
  };

  const openEditModal = (cveItem) => {
    setCRUDMode('edit');
    setFormData({
      cveId: cveItem.cveId,
      sourceIdentifier: cveItem.sourceIdentifier || '',
      vulnStatus: cveItem.vulnStatus || '',
      published: cveItem.published ? new Date(cveItem.published).toISOString().split('T')[0] : '',
      description: cveItem.description || '',
      severity: cveItem.severity || '',
      score: cveItem.score || '',
      attackVector: cveItem.attackVector || '',
      attackComplexity: cveItem.attackComplexity || '',
      exploitabilityScore: cveItem.exploitabilityScore || '',
      impactScore: cveItem.impactScore || ''
    });
    setShowCRUDModal(true);
    setSubmitError('');
    setSuccessMessage('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    try {
      if (crudMode === 'create') {
        await createCVE(formData);
        setSuccessMessage('CVE created successfully!');
        setTimeout(() => {
          setShowCRUDModal(false);
          setCurrentPage(1);
          setYear('');
          setScore('');
          setDays('');
        }, 1500);
      } else if (crudMode === 'edit') {
        await updateCVE(formData.cveId, formData);
        setSuccessMessage('CVE updated successfully!');
        setTimeout(() => {
          setShowCRUDModal(false);
          setCurrentPage(1);
        }, 1500);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (cveId) => {
    if (window.confirm(`Are you sure you want to delete ${cveId}?`)) {
      try {
        await deleteCVE(cveId);
        alert('CVE deleted successfully!');
        setCurrentPage(1);
        setYear('');
        setScore('');
        setDays('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete CVE');
      }
    }
  };

  const closeModal = () => {
    setShowCRUDModal(false);
    setSubmitError('');
    setSuccessMessage('');
  };

  // Detail view
  if (id && cve) {
    return <CVEDetailView cve={cve} />;
  }

  // List view
  return (
    <div className="cve-list-container">
      <h1 className="cve-list-title">CVE List</h1>

      <button className="btn-create-new" onClick={openCreateModal}>
        + Create New CVE
      </button>

      <FilterSection
        showFilterDropdown={showFilterDropdown}
        onToggleDropdown={() => setShowFilterDropdown(!showFilterDropdown)}
        selectedFilter={selectedFilter}
        filterValue={filterValue}
        onSelectFilter={setSelectedFilter}
        onFilterValueChange={(e) => setFilterValue(e.target.value)}
        onApplyFilter={() => {
          handleFilterApply(selectedFilter, filterValue);
          setShowFilterDropdown(false);
          setSelectedFilter('');
          setFilterValue('');
        }}
      />

      <h3>Total Records: {totalRecords}</h3>

      <CVETable
        cves={cves}
        loading={loading}
        error={error}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        resultsPerPage={resultsPerPage}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onResultsPerPageChange={(e) => {
          setResultsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
      />

      <CVECRUDModal
        isOpen={showCRUDModal}
        mode={crudMode}
        formData={formData}
        successMessage={successMessage}
        submitError={submitError}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />
    </div>
  );
};

export default CVEPage;
