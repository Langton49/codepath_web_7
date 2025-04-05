import React from "react";
import '../styles/List.css';

const ArtistList = ({ artists }) => {
    return (
        <div className="artist-list">
            <h2>Artists</h2>
            {artists.length === 0 ? (
                <div className="no-results">No artists found matching your criteria.</div>
            ) : (
                <ul>
                    {artists.map(artist => (
                        <li key={artist.id} className="artist-card"
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
                    ))}
                </ul>
            )
            }
        </div >
    );
};

export default ArtistList;