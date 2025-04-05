import React from "react";
import '../styles/Featured.css';

const FeaturedArtist = ({ artist }) => {
    if (!artist) return <div className="featured-artist">Loading featured artists...</div>;

    return (
        <div className="featured-artist">
            <div className="featured-label">Featured Artist</div>
            <div className="artist-name">{artist.name}</div>
            <div className="artist-followers">{artist.followers.toLocaleString()} followers</div>
        </div>
    );
};

export default FeaturedArtist;