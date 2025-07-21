/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

const Quiz = ({ category, onFinish, source = 'opentdb' }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const decodeHtml = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchQuestions(category);
  }, [category, source]);

  useEffect(() => {
    if (questions.length > 0) {
      const q = questions[currentQuestion];
      const options = [...q.incorrectAnswers, q.correctAnswer]
        .sort(() => Math.random() - 0.5)
        .map(decodeHtml);
      setCurrentOptions(options);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [questions, currentQuestion]);

  const fetchQuestions = async (category) => {
    setIsLoading(true);
    try {
      let formatted = [];

      if (source === 'opentdb') {
        const res = await fetch(
          `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`
        );
        const data = await res.json();
        formatted = data.results.map((q) => ({
          question: decodeHtml(q.question),
          correctAnswer: decodeHtml(q.correct_answer),
          incorrectAnswers: q.incorrect_answers.map(decodeHtml),
        }));
      } else if (source === 'triviaapi') {
        const res = await fetch('https://the-trivia-api.com/v2/questions?limit=5');
        const data = await res.json();
        formatted = data.map((q) => ({
          question: q.question.text,
          correctAnswer: q.correctAnswer,
          incorrectAnswers: q.incorrectAnswers,
        }));
      } else if (source === 'jservice') {
        const res = await fetch('https://jservice.io/api/random?count=5');
        const data = await res.json();
        formatted = data.map((q) => ({
          question: q.question,
          correctAnswer: q.answer,
          incorrectAnswers: generateFakeOptions(q.answer), // JService does not give incorrect options
        }));
      }

      setQuestions(formatted);
    } catch (err) {
      console.error('Failed to load quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Create fake options for JService (since it doesn't provide them)
  const generateFakeOptions = (correct) => {
    const fillers = ['Option A', 'Option B', 'Option C'];
    const insertAt = Math.floor(Math.random() * 4);
    const options = [...fillers];
    options.splice(insertAt, 0, correct);
    return options.filter((opt) => opt !== correct);
  };

  const handleAnswer = (selected) => {
    if (isAnswered) return;
    
    setSelectedAnswer(selected);
    setIsAnswered(true);
    
    if (selected === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Wait a moment to show the result, then move to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(30);
      } else {
        handleFinish();
      }
    }, 1500);
  };

  const handleFinish = () => {
    const attempts = JSON.parse(localStorage.getItem('quizAttempts') || '[]');
    attempts.push({
      timestamp: new Date().toISOString(),
      score,
      total: questions.length,
      category,
      source,
    });
    localStorage.setItem('quizAttempts', JSON.stringify(attempts));
    onFinish(score, questions.length);
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getTimeColor = () => {
    if (timeLeft <= 10) return '#ef4444';
    if (timeLeft <= 20) return '#f59e0b';
    return '#10b981';
  };

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h3>Loading your quiz...</h3>
          <p>Preparing amazing questions for you! 🚀</p>
        </div>
      </div>
    );
  }
  
  if (!questions.length) return null;

  const q = questions[currentQuestion];
  const isCorrect = selectedAnswer === q.correctAnswer;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="quiz-stats">
          <div className="timer" style={{ color: getTimeColor() }}>
            ⏱️ {timeLeft}s
          </div>
          <div className="score">
            🎯 {score}/{questions.length}
          </div>
        </div>
      </div>

      <div className="question-section">
        <h2>Question {currentQuestion + 1} of {questions.length}</h2>
        <div className="question">
          {q.question}
        </div>
      </div>

      <div className="options">
        {currentOptions.map((opt, i) => {
          let optionClass = 'option-btn';
          if (isAnswered) {
            if (opt === q.correctAnswer) {
              optionClass += ' correct';
            } else if (opt === selectedAnswer && opt !== q.correctAnswer) {
              optionClass += ' incorrect';
            }
          }
          
          return (
            <button 
              key={i} 
              onClick={() => handleAnswer(opt)} 
              className={optionClass}
              disabled={isAnswered}
            >
              <span>{opt}</span>
              {isAnswered && opt === q.correctAnswer && <span className="checkmark">✅</span>}
              {isAnswered && opt === selectedAnswer && opt !== q.correctAnswer && <span className="cross">❌</span>}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`feedback ${isCorrect ? 'correct-feedback' : 'incorrect-feedback'}`}>
          {isCorrect ? (
            <div>
              <span className="feedback-emoji">🎉</span>
              <span className="feedback-text">Correct! Well done!</span>
            </div>
          ) : (
            <div>
              <span className="feedback-emoji">💡</span>
              <span className="feedback-text">The correct answer was: <strong>{q.correctAnswer}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;