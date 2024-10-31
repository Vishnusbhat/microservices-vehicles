import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:3001/user/login', { 
                email,
                password,
            });
            const { user, token } = response.data;
            console.log(user);
            setUser(user); 
            localStorage.setItem('token', token); 
            navigate('/');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Invalid password. Please try again.'); 
                } else if (error.response.status === 404) {
                    alert('User not found. Please check your email.');
                } else {
                    alert(error.response.data.message); 
                }
            } else {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };
    

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
            {user ? (
                <div className="text-center">
                    <p className="text-2xl">Welcome, {user.email}!</p>
                    <button
                        onClick={handleLogout}
                        className="mt-6 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
                    <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-300" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-1 text-gray-300" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200"
                    >
                        Login
                    </button>
                </form>
            )}
        </div>
    );
};

export default Login;
