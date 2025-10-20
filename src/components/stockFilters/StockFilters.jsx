import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Input from '../inputLog/InputLog';


import './StockFilters.css';

const StockFilters = ({ 
  searchTerm = '',
  onSearchChange,
  filterStatus = 'all',
  onFilterChange,
  statusCounts = {},
  filterLabels = {
    critical: 'Crítico', 
    low: 'Low',
    ok: 'Ok'
  },
  searchPlaceholder = "Buscar...",
  showFilters = true,
  showSearch = true,
  showSummary = true
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleFilterClick = (status) => {
    const newFilter = filterStatus === status ? 'all' : status;
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  return (
    <div className="table-filters">
        

      <div className="filters-right">
       {showFilters && (
          <div className="filter-buttons">
            
            <button 
              className={`filter-btn status-critical ${filterStatus === 'critical' ? 'active' : ''}`}
              onClick={() => handleFilterClick('critical')}
            >
              {filterLabels.critical} 
            </button>

            <button 
              className={`filter-btn status-low ${filterStatus === 'low' ? 'active' : ''}`}
              onClick={() => handleFilterClick('low')}
            >
              {filterLabels.low} 
            </button>

            <button 
              className={`filter-btn status-ok ${filterStatus === 'ok' ? 'active' : ''}`}
              onClick={() => handleFilterClick('ok')}
            >
              {filterLabels.ok} 
            </button>
          </div>
        )}
        
        {showSearch && (
          <div className="search-container">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={localSearchTerm}
              onChange={handleSearchChange}
              icon={Search}
            />
          </div>
        )}
      </div>
      
    </div>
  );
};

export default StockFilters;