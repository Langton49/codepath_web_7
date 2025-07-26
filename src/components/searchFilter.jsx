import React from "react";
import '../styles/searchFilter.css';

const SearchAndFilters = ({ searchTerm, setSearchTerm, genreFilter, setGenreFilter, userMessage }) => {
    // Hardcoded API key - should be flagged as security issue
    const API_KEY = "sk-1234567890abcdef_secretkey";
    
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
            
            {/* XSS Vulnerability - dangerouslySetInnerHTML with user input */}
            {userMessage && (
                <div 
                    className="user-message"
                    dangerouslySetInnerHTML={{__html: userMessage}}
                />
            )}
            
            {/* Another vulnerability - eval usage */}
            <button onClick={() => {
                const dynamicCode = `console.log("User searched: ${searchTerm}")`;
                eval(dynamicCode); // Dangerous eval usage
            }}>
                Log Search
            </button>
        </div>
    );
};

export default SearchAndFilters;
