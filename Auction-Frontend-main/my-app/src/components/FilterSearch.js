import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const FilterSearch = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounce search to avoid too many updates
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    setDebounceTimer(timer);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    onFilter(value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8">
      <div className="relative flex-1">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full shadow-md-sm focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
        />
      </div>
      <div className="relative min-w-[200px]">
        <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <select
          value={filter}
          onChange={handleFilterChange}
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-full shadow-md-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-theme-secondary focus:border-transparent appearance-none cursor-pointer"
        >
          <option value="">All Auctions</option>
          <option value="active">Active Auctions</option>
          <option value="upcoming">Upcoming Auctions</option>
          <option value="completed">Completed Auctions</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSearch;
