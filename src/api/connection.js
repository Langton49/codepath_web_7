async function getToken() {
    const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const client_secret = import.meta.env.VITE_SPOTIFY_SECRET;
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
            },
            body: 'grant_type=client_credentials'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.access_token;
    } catch (err) {
        console.error('Error fetching token:', err);
        return null;
    }
}

export async function getArtistBySearch(searchTerm, genreFilter) {
    const token = await getToken();
    if (!token) {
        console.error('Failed to retrieve access token.');
        return;
    }
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const encodedGenreFilter = encodeURIComponent(genreFilter);
    let response = null;

    try {
        if (genreFilter === 'all') {
            // Search for all genres
            response = await fetch(`https://api.spotify.com/v1/search?q=${encodedSearchTerm}&type=artist&limit=30`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        } else {
            // Search for a specific genre
            response = await fetch(`https://api.spotify.com/v1/search?q=${encodedSearchTerm}+genre:"${encodedGenreFilter}"&type=artist&limit=30`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.artists.items.map(artist => ({
            id: artist.id,
            name: artist.name,
            genre: artist.genres[0] || 'Not Specified',
            followers: artist.followers.total,
            imageUrl: artist.images[0]?.url
        }));

    } catch (err) {
        console.error('Error fetching artist:', err);
    }
}

export async function getArtistsByGenre(genre) {
    const token = await getToken();
    if (!token) {
        console.error('Failed to retrieve access token.');
        return;
    }
    const encodedGenre = encodeURIComponent(genre);

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=genre:"${encodedGenre}"&type=artist&limit=30`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (!response.ok) {
            console.error('Response not OK:', response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.artists.items.map(artist => ({
            id: artist.id,
            name: artist.name,
            followers: artist.followers.total,
            imageUrl: artist.images[0]?.url
        }));
    } catch (err) {
        console.error('Error fetching artists by genre:', err);
    }
}
