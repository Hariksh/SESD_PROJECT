import React, { useState } from 'react';

const Login = ({ login }) => {
    const handleLogin = (role) => {
        login({
            _id: role === 'ADMIN' ? '1' : '2',
            name: role === 'ADMIN' ? 'Admin User' : 'Staff Worker',
            email: role === 'ADMIN' ? 'admin@example.com' : 'staff@example.com',
            role: role
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
                        Simulated Login
                    </h2>
                    <p className="mt-3 text-sm text-slate-500 font-medium tracking-wide">
                        Choose a role to test Simple RBAC
                    </p>
                </div>
                
                <div className="space-y-4">
                     <button onClick={() => handleLogin('ADMIN')} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                            Login as Admin
                    </button>
                    <button onClick={() => handleLogin('STAFF')} className="w-full flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                            Login as Staff
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
