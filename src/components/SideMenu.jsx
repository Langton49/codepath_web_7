import React from "react";
import '../styles/SideMenu.css';

const SideMenu = () => {
    return (
        <div className="side-menu">
            <div className="menu-header"><span style={{ color: `#1ED760` }}>Spoti</span>View</div>
            <ul className="menu-items">
                <li className="menu-item active">Artists</li>
                <li className='menu-item'>About</li>
                <li className="menu-item">Settings</li>
            </ul>
        </div>
    );
};

export default SideMenu;