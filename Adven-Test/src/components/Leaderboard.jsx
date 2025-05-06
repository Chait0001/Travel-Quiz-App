import React, { useEffect, useState } from 'react';

const categoryNames = {
  11: 'Movies',
  12: 'Music',
  14: 'Television',
  15: 'Video Games',
  31: 'Anime & Manga',
  32: 'Cartoons',
};

const Leaderboard = ({ onBack }) => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    const sorted = stored.sort((a, b) => b.score - a.score);
    setAttempts(sorted);
  }, []);

  const handleReset = () => {
    const confirmReset = window.confirm("Are you sure you want to clear the leaderboard?");
    if (confirmReset) {
      localStorage.removeItem('quizAttempts');
      setAttempts([]);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Top Quiz Scores</h2>
      {attempts.length === 0 ? (
        <p>No attempts yet. Try a quiz!</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Quiz Topic</th>
              <th>Your Score</th>
              <th>Out of</th>
              <th>Attempted On</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, index) => (
              <tr key={index}>
                <td>{categoryNames[attempt.category] || attempt.category}</td>
                <td>{attempt.score}</td>
                <td>{attempt.total}</td>
                <td>{new Date(attempt.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="button-group">
        <button className="btn" onClick={onBack}>Back</button>
        <button className="btn reset" onClick={handleReset}>Reset Leaderboard</button>
      </div>
    </div>
  );
};

export default Leaderboard;