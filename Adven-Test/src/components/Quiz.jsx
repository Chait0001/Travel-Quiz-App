/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

const Quiz = ({ category, onFinish, source = 'opentdb' }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [currentOptions, setCurrentOptions] = useState([]);

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
    if (selected === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      handleFinish();
    }
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

  if (isLoading) return <div>Loading...</div>;
  if (!questions.length) return null;

  const q = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="timer">Time Left: {timeLeft}s</div>
      <div className="score">Score: {score}/{questions.length}</div>
      <h2>Question {currentQuestion + 1}</h2>
      <p>{q.question}</p>
      <div className="options">
        {currentOptions.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(opt)} className="option-btn">
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;