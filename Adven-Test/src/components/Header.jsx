import React from 'react';

const Header = ({ onNavigateHome, onNavigateLeaderboard }) => {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <h1>Fun Quiz</h1>
        </div>
        <div className="nav-links">
          <button onClick={onNavigateHome} className="nav-link">Home</button>
          <button onClick={onNavigateLeaderboard} className="nav-link">Leaderboard</button>
        </div>
      </nav>
    </header>
  );
};
  
export default Header;