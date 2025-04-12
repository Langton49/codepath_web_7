import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArtistById } from "../api/connection";
import "../styles/Detail.css";

const ArtistDetail = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);

    useEffect(() => {
        getArtistById(id).then((data) => {
            setArtist(data);
        });
    }, [id]);

    if (!artist) {
        return <div className="loading">Loading...</div>;
    }

    const getPopularityStatement = (popularity) => {
        switch (true) {
            case popularity >= 90:
                return "This artist is known globally - even your grandma probably has their poster!";
            case popularity >= 75:
                return "This artist has widespread recognition - they're what the cool kids are listening to";
            case popularity >= 60:
                return "This artist has moderate popularity - not quite stadium status, but definitely beyond garage band";
            case popularity >= 40:
                return "This artist is gaining traction - like a snowball rolling down a hill of fame";
            default:
                return "This artist is building their fanbase - currently performing for their cat, but dreaming big!";
        }
    }

    return (
        <div className="detail-card"
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${artist.images[0]?.url})`,
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <h1>{artist.name}</h1>
            {artist.images[0]?.url && (
                <div className="artist-image"
                    style={{
                        backgroundImage: `url(${artist.images[0]?.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        width: `${artist.images[0]?.width}`,
                        height: `${artist.images[0]?.height}`,
                        borderRadius: '50%'
                    }}
                />
            )}
            <p><strong><span>Followers:</span></strong> {artist.followers.toLocaleString()}</p>
            {artist.genres.length > 0 && <p><strong><span>Genres:</span></strong> {artist.genres.join(', ')}</p>}
            <p><strong><span>Popularity: </span></strong>{getPopularityStatement(artist.popularity)}</p>
            {
                artist.profile && (
                    <p>
                        <strong>
                            <a
                                href={artist.profile}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Checkout {artist.name}'s music
                            </a>
                        </strong>
                    </p>
                )
            }
        </div >
    );
};

export default ArtistDetail;