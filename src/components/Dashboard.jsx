import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import { getArtistBySearch, getArtistsByGenre } from '../api/connection';
import SideMenu from './SideMenu';
import ArtistList from './List';
import FeaturedArtist from './Featured';
import SearchAndFilters from './searchFilter';
import { Routes, Route } from 'react-router-dom';
import ArtistDetails from './Detail';

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <SideMenu />

            <div className="main-content">
                <Routes>
                    <Route path="/" element={<ArtistList />} />
                    <Route path="/artist/:id" element={<ArtistDetails />} />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;