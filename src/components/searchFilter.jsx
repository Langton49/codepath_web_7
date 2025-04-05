import React from "react";
import '../styles/searchFilter.css';

const SearchAndFilters = ({ searchTerm, setSearchTerm, genreFilter, setGenreFilter }) => {
    return (
        <div className="search-filters">
            <input
                type="text"
                placeholder="Search artists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="genre-select"
            >
                <option value="all">All Genres</option>
                <option value="Pop">Pop</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="R&B">R&B</option>
                <option value="K-Pop">K-Pop</option>
            </select>
        </div>
    );
};

export default SearchAndFilters;