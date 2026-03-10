import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    StockMaster
                </Link>

                <div className="flex items-center space-x-6">
                    {user ? (
                        <>
                            <span className="text-gray-600 font-medium">Hello, {user.name} ({user.role})</span>
                            <button
                                onClick={logout}
                                className="bg-red-50 to-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-all border border-red-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
