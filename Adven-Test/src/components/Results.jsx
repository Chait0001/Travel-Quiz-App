import React from 'react';

const Results = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Perfect score! 🎉';
    if (percentage >= 80) return 'Great job! 💪';
    if (percentage >= 50) return 'Not bad, keep practicing!';
    return 'Better luck next time!';
  };

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      <p>You scored {score} out of {total}</p>
      <p>{getMessage()}</p>
      <button className="btn" onClick={onRestart}>
        Go Home
      </button>
    </div>
  );
};

export default Results;