import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home'); // redirect if already logged in
    }
  }, [navigate]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to NoteThat 📒</h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded font-semibold"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded font-semibold"
        >
          Register
        </button>
      </div>
    </main>
  );
};

export default Landing;
