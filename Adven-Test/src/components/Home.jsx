import React, { useState } from 'react';

const Home = ({ onStartQuiz }) => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { value: '22', name: 'Geography', icon: '🌍', description: 'Explore the world through geography questions' },
    { value: '23', name: 'History', icon: '📚', description: 'Journey through time with historical facts' },
    { value: '9', name: 'General Knowledge', icon: '🧠', description: 'Test your general knowledge and trivia' },
    { value: '25', name: 'Art', icon: '🎨', description: 'Discover the world of art and creativity' },
    { value: '27', name: 'Animals', icon: '🐾', description: 'Learn about fascinating creatures and wildlife' }
  ];

  const handleStart = () => {
    if (selectedCategory) {
      onStartQuiz(selectedCategory);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory);

  return (
    <div className="home-container">
      <h1>Welcome to AdvenTest! 🚀</h1>
      <p>Embark on an exciting journey of knowledge and discovery. Choose your adventure and test your skills across various fascinating topics!</p>
      
      <div className="category-selection">
        <h3>Select Your Adventure</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Choose a category...</option>
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        
        {selectedCategoryData && (
          <div className="category-preview">
            <div className="category-icon">{selectedCategoryData.icon}</div>
            <h4>{selectedCategoryData.name}</h4>
            <p>{selectedCategoryData.description}</p>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleStart} 
        disabled={!selectedCategory}
        className={selectedCategory ? 'ready' : ''}
      >
        <span>🚀 Start Your Adventure</span>
      </button>
    </div>
  );
};

export default Home;