import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(5);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remaining attempts from localStorage on mount
  useEffect(() => {
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      setAttemptsLeft(parseInt(savedAttempts));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('loginAttempts', attemptsLeft.toString());
  }, [attemptsLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (attemptsLeft <= 0) {
      setError('Too many failed login attempts. Please try again later.');
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password, formData.role);

      // Clear attempts on successful login
      localStorage.removeItem('loginAttempts');
      setAttemptsLeft(5);

      if (
        formData.role === 'client' &&
        formData.email.trim().toLowerCase() === 'testadmin@gmail.com'
      ) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch {
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      setError(`Invalid credentials. You have ${remaining} attempt(s) left.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Login</h2>
        <p className="text-gray-600">Access your Lawyer4u account</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Login as</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="client">Client</option>
            <option value="lawyer">Lawyer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || attemptsLeft <= 0}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
