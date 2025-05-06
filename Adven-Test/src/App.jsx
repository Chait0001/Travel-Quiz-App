import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';
import './App.css';

const App = () => {
  const [page, setPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const startQuiz = (category) => {
    setSelectedCategory(category);
    setPage('quiz');
  };

  const finishQuiz = (finalScore, total) => {
    setScore(finalScore);
    setTotalQuestions(total);
    setPage('results');
  };

  const goToLeaderboard = () => setPage('leaderboard');
  const goHome = () => setPage('home');

  return (
    <div className="app">
      <Header onNavigateHome={goHome} onNavigateLeaderboard={goToLeaderboard} />

      <div className="main-content">
        {page === 'home' && <Home onStartQuiz={startQuiz} />}
        {page === 'quiz' && selectedCategory && <Quiz category={selectedCategory} onFinish={finishQuiz} />}
        {page === 'results' && <Results score={score} total={totalQuestions} onRestart={goHome} />}
        {page === 'leaderboard' && <Leaderboard />}
      </div>

      <Footer />
    </div>
  );
};

export default App;




import './App.css';