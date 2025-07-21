import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('quizUser');
    if (user) {
      onLogin(JSON.parse(user));
    }
  }, [onLogin]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      
      if (user) {
        localStorage.setItem('quizUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Register logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
      const existingUser = users.find(u => u.username === formData.username);
      
      if (existingUser) {
        setError('Username already exists');
        return;
      }

      const newUser = {
        id: Date.now(),
        username: formData.username,
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('quizUsers', JSON.stringify(users));
      localStorage.setItem('quizUser', JSON.stringify(newUser));
      onLogin(newUser);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', password: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
          )}
          
          <button type="submit" className="login-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        
        <div className="toggle-mode">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={toggleMode} className="toggle-button">
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 