import React from 'react';

const Results = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Perfect score! 🎉';
    if (percentage >= 80) return 'Excellent work! 🌟';
    if (percentage >= 60) return 'Great job! 💪';
    if (percentage >= 40) return 'Good effort! 👍';
    return 'Keep practicing! 📚';
  };

  const getEmoji = () => {
    if (percentage === 100) return '🏆';
    if (percentage >= 80) return '🌟';
    if (percentage >= 60) return '💪';
    if (percentage >= 40) return '👍';
    return '📚';
  };

  const getColor = () => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#3b82f6';
    if (percentage >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="results-container">
      <h2>Quiz Complete! 🎯</h2>
      
      <div className="score-display" style={{ color: getColor() }}>
        {score}/{total}
      </div>
      
      <div className="percentage" style={{ color: getColor() }}>
        {percentage}%
      </div>
      
      <div className="result-message">
        <div className="result-emoji">{getEmoji()}</div>
        <p>{getMessage()}</p>
      </div>
      
      <div className="result-details">
        <p>You answered <strong>{score}</strong> out of <strong>{total}</strong> questions correctly.</p>
        {percentage < 100 && (
          <p>Don't worry, every quiz is a learning opportunity! 🎓</p>
        )}
      </div>
      
      <button className="btn" onClick={onRestart}>
        <span>🏠 Back to Home</span>
      </button>
    </div>
  );
};

export default Results;

   