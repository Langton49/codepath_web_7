import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { getArtistBySearch } from '../api/connection';
import { getArtistsByGenre } from '../api/connection';
import SideMenu from './SideMenu';
import ArtistList from './List';
import FeaturedArtist from './Featured';
import SearchAndFilters from './searchFilter';

const Dashboard = () => {
    const [artists, setArtists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

    useEffect(() => {
        getArtistBySearch("/", genreFilter)
            .then(data => {
                setArtists(data || []);
                setFilteredArtists(data || []);
            })
            .catch(err => {
                console.error('Error fetching artists:', err);
                setArtists([]);
                setFilteredArtists([]);
            });
    }, []);

    useEffect(() => {
        let results = artists;

        if (searchTerm) {
            getArtistBySearch(searchTerm, genreFilter)
                .then(data => {
                    results = data || [];
                    setFilteredArtists(results);
                })
                .catch(err => {
                    console.error('Error fetching artists:', err);
                    setFilteredArtists([]);
                });
        } else {
            if (genreFilter !== 'all') {
                getArtistsByGenre(genreFilter)
                    .then(data => {
                        results = data || [];
                        setFilteredArtists(results);
                    })
                    .catch(err => {
                        console.error('Error fetching artists by genre:', err);
                        setFilteredArtists([]);
                    });
            }
            setFilteredArtists(results);
        }
    }, [searchTerm, genreFilter, artists]);

    useEffect(() => {
        if (filteredArtists.length === 0) return;

        const interval = setInterval(() => {
            setCurrentFeaturedIndex(prev => (prev + 1) % filteredArtists.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [filteredArtists.length]);

    return (
        <div className="dashboard-container">
            <SideMenu />

            <div className="main-content">
                <div className="top-bar">
                    <SearchAndFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        genreFilter={genreFilter}
                        setGenreFilter={setGenreFilter}
                    />

                    <FeaturedArtist
                        artist={filteredArtists[currentFeaturedIndex]}
                    />
                </div>

                <div className='stats'>
                    <div style={{ color: '#1DB954', fontWeight: 'bold' }}>
                        {filteredArtists.length} ARTISTS FOUND
                    </div>
                    <div>
                        {filteredArtists.length > 0 ? (
                            <div>
                                <strong>Most Followed:</strong> {filteredArtists.reduce((topArtist, currentArtist) =>
                                    currentArtist.followers > topArtist.followers ? currentArtist : topArtist
                                ).name}
                            </div>
                        ) : (
                            <div>No artists available</div>
                        )}
                    </div>
                    <div>
                        {filteredArtists.length > 0 ? (
                            <div>
                                <strong>Total Combined Followers:</strong> {filteredArtists.reduce((total, artist) => total + artist.followers, 0).toLocaleString()}
                            </div>
                        ) : (
                            <div>No followers to display</div>
                        )}
                    </div>
                </div>

                <ArtistList artists={filteredArtists} />
            </div>
        </div>
    );
};

export default Dashboard;