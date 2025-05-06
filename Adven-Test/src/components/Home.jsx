import React, { useState } from 'react';

const Home = ({ onStartQuiz }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleStart = () => {
    if (selectedCategory) {
      onStartQuiz(selectedCategory);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to AdvenTest!</h1>
      <p>Select a category to begin your cultural journey:</p>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="22">Geography</option>
        <option value="23">History</option>
        <option value="9">General Knowledge</option>
        <option value="25">Art</option>
        <option value="27">Animals</option>
      </select>
      <button onClick={handleStart} disabled={!selectedCategory}>
        Start Quiz
      </button>
    </div>
  );
};

export default Home;