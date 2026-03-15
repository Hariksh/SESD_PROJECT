import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/50 shadow-sm animate-fade-in">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
                    StockMaster
                </Link>

                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <div className="flex flex-col text-right">
                                <span className="text-slate-800 font-semibold leading-tight">{user.name}</span>
                                <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">{user.role}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="btn-danger"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
