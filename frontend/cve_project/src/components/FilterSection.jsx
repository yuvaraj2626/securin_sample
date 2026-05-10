import React from 'react';

const FilterSection = ({ 
  showFilterDropdown, 
  onToggleDropdown, 
  selectedFilter, 
  filterValue, 
  onSelectFilter, 
  onFilterValueChange, 
  onApplyFilter 
}) => {
  return (
    <div className="filter-dropdown-container">
      <button
        className="filter-dropdown-button"
        onClick={onToggleDropdown}
      >
        Filter Options
      </button>

      {showFilterDropdown && (
        <div className="filter-dropdown-menu">
          <div
            className="filter-dropdown-item"
            onClick={() => onSelectFilter('Year')}
          >
            Year
          </div>
          <div
            className="filter-dropdown-item"
            onClick={() => onSelectFilter('Score')}
          >
            Score
          </div>
          <div
            className="filter-dropdown-item"
            onClick={() => onSelectFilter('Days')}
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
              onChange={onFilterValueChange}
              className="filter-input"
            />
          </label>
          <button
            className="apply-filter-button"
            onClick={onApplyFilter}
          >
            Apply Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
