import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Leaderboard from './components/Leaderboard';
import Login from './components/Login';
import './App.css';

const App = () => {
  const [page, setPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in on app load
    const user = localStorage.getItem('quizUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('quizUser');
    setCurrentUser(null);
    setPage('login');
  };

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

  // If user is not logged in, show login page
  if (!currentUser && page !== 'login') {
    return (
      <div className="app">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        onNavigateHome={goHome} 
        onNavigateLeaderboard={goToLeaderboard}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

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