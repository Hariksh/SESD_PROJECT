import React, { useState } from 'react';

const Login = ({ login }) => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123');

    const handleSubmit = (e) => {
        e.preventDefault();
        login({
            _id: '1',
            name: 'Admin User',
            email: email,
            role: email === 'admin@example.com' ? 'ADMIN' : 'STAFF',
            token: 'mock-token'
        });
    };

    return (
        <div className="flex items-center justify-center min-vh-calc py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
            <div className="fixed top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            <div className="fixed top-40 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="fixed -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
            
            <div className="max-w-md w-full glass-card p-10 relative z-10 animate-fade-in shadow-2xl shadow-blue-900/5">
                <div className="text-center mb-10">
                    <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 transform -rotate-6 hover:rotate-0 transition-all duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-sm text-slate-500 font-medium tracking-wide">
                        Please sign in to your dashboard
                    </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="glass-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                className="glass-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer" />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                            Remember me for 30 days
                        </label>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="btn-primary">
                            Sign in to account
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
