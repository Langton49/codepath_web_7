import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Chart } from 'chart.js/auto';
import '../styles/List.css';
import SearchAndFilters from "./searchFilter";
import { getArtistBySearch, getArtistsByGenre } from "../api/connection";

const ArtistList = () => {
    const [artists, setArtists] = useState([]);
    const [filteredArtists, setFilteredArtists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const chartRef = useRef(null);
    const followersChartInstance = useRef(null);
    const topArtistsChartRef = useRef(null);
    const topArtistsChartInstance = useRef(null);

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

    const prepareChartData = () => {
        if (filteredArtists.length === 0) return { followerRanges: [], topArtists: [] };

        const maxFollowers = Math.max(...filteredArtists.map(a => a.followers));
        const rangeSize = Math.ceil(maxFollowers / 5);

        const followerRanges = [
            { name: `0-${rangeSize}`, min: 0, max: rangeSize, count: 0 },
            { name: `${rangeSize + 1}-${rangeSize * 2}`, min: rangeSize + 1, max: rangeSize * 2, count: 0 },
            { name: `${rangeSize * 2 + 1}-${rangeSize * 3}`, min: rangeSize * 2 + 1, max: rangeSize * 3, count: 0 },
            { name: `${rangeSize * 3 + 1}-${rangeSize * 4}`, min: rangeSize * 3 + 1, max: rangeSize * 4, count: 0 },
            { name: `${rangeSize * 4 + 1}+`, min: rangeSize * 4 + 1, max: Infinity, count: 0 },
        ];

        filteredArtists.forEach(artist => {
            const range = followerRanges.find(r =>
                artist.followers >= r.min && artist.followers <= r.max
            );
            if (range) range.count++;
        });

        const totalFollowers = filteredArtists.reduce((sum, artist) => sum + artist.followers, 0);
        const sortedArtists = [...filteredArtists]
            .sort((a, b) => b.followers - a.followers)
            .slice(0, 5);

        const topArtists = sortedArtists.map(artist => ({
            name: artist.name,
            percentage: Math.round((artist.followers / totalFollowers) * 100),
            followers: artist.followers
        }));

        return { followerRanges, topArtists };
    };

    useEffect(() => {
        if (!chartRef.current || !topArtistsChartRef.current || filteredArtists.length === 0) return;

        const { followerRanges, topArtists } = prepareChartData();

        if (followersChartInstance.current) followersChartInstance.current.destroy();
        if (topArtistsChartInstance.current) topArtistsChartInstance.current.destroy();

        if (followerRanges.length > 0) {
            const ctx = chartRef.current.getContext('2d');
            followersChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: followerRanges.map(d => d.name),
                    datasets: [{
                        label: 'Number of Artists',
                        data: followerRanges.map(d => d.count),
                        backgroundColor: 'rgba(29, 185, 84, 0.7)',
                        borderColor: 'rgba(29, 185, 84, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.parsed.y} artists`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 } },
                        x: { title: { display: true, text: 'Followers Range' } }
                    }
                }
            });
        }

        if (topArtists.length > 0) {
            const ctx2 = topArtistsChartRef.current.getContext('2d');
            topArtistsChartInstance.current = new Chart(ctx2, {
                type: 'doughnut',
                data: {
                    labels: topArtists.map(a => a.name),
                    datasets: [{
                        data: topArtists.map(a => a.percentage),
                        backgroundColor: [
                            'rgba(29, 185, 84, 0.7)',
                            'rgba(29, 185, 84, 0.5)',
                            'rgba(29, 185, 84, 0.3)',
                            'rgba(100, 100, 100, 0.3)',
                            'rgba(150, 150, 150, 0.3)'
                        ],
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const artist = topArtists[context.dataIndex];
                                    return `${artist.name}: ${context.parsed}% (${artist.followers.toLocaleString()} followers)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        return () => {
            if (followersChartInstance.current) followersChartInstance.current.destroy();
            if (topArtistsChartInstance.current) topArtistsChartInstance.current.destroy();
        };
    }, [filteredArtists]);

    return (
        <>
            <div className="top-bar">
                <SearchAndFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    genreFilter={genreFilter}
                    setGenreFilter={setGenreFilter}
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
            <div className="data-summary-card">
                <h3>Follower Summary</h3>
                {filteredArtists.length > 0 ? (
                    <>
                        <div className="charts-container">
                            <div className="chart-wrapper">
                                <h4>Follower Distribution</h4>
                                <div className="chart-container">
                                    <canvas ref={chartRef} />
                                </div>
                            </div>
                            <div className="chart-wrapper">
                                <h4>Top 5 Artists by Followers</h4>
                                <div className="chart-container">
                                    <canvas ref={topArtistsChartRef} />
                                </div>
                            </div>
                        </div>
                        <div className="quick-stats">
                            {/* ... existing quick stats ... */}
                        </div>
                    </>
                ) : (
                    <p>No data to display</p>
                )}
            </div>

            <div className="artist-list">
                <h2>Artists</h2>
                {filteredArtists.length === 0 ? (
                    <div className="no-results">No artists found matching your criteria.</div>
                ) : (
                    <ul>
                        {filteredArtists.map(artist => (
                            <Link to={`/artist/${artist.id}`} key={artist.id}>
                                <li className="artist-card"
                                    style={{
                                        backgroundImage: `url(${artist.imageUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                    <div className="artist-info">
                                        <h3>{artist.name}</h3>
                                        <p>{artist.followers.toLocaleString()} followers</p>
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ArtistList;