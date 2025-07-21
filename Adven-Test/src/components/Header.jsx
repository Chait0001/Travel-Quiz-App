import React from 'react';

const Header = ({ onNavigateHome, onNavigateLeaderboard, currentUser, onLogout }) => {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <h1>Fun Quiz</h1>
        </div>
        <div className="nav-links">
          <button onClick={onNavigateHome} className="nav-link">Home</button>
          <button onClick={onNavigateLeaderboard} className="nav-link">Leaderboard</button>
          {currentUser && (
            <div className="user-section">
              <span className="username">Welcome, {currentUser.username}!</span>
              <button onClick={onLogout} className="logout-button">Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
         
export default Header;