import React, { useState } from 'react';

const Dashboard = ({ user }) => {
    const [products] = useState([
        { id: 1, name: 'Laptop Pro', stock: 15, price: 1200, category: 'Electronics' },
        { id: 2, name: 'Office Chair', stock: 5, price: 250, category: 'Furniture' },
        { id: 3, name: 'Coffee Mug', stock: 50, price: 15, category: 'Kitchen' },
    ]);

    return (
        <div className="space-y-8 pb-12 animate-fade-in relative z-10">
            <div className="fixed top-20 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob pointer-events-none"></div>
            <div className="fixed bottom-20 left-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 pointer-events-none"></div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Inventory Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your stock and track availability in real-time.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">Export Data</button>
                    {user.role === 'ADMIN' && (
                        <button className="btn-primary shadow-blue-500/20 px-5 py-2">
                            + Add Product
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up delay-100">
                <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Products</p>
                        <p className="text-4xl font-extrabold text-slate-900">{products.length}</p>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-amber-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-amber-500 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Low Stock Items</p>
                        <p className="text-4xl font-extrabold text-slate-900">{products.filter(p => p.stock < 10 && p.stock > 0).length}</p>
                    </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-rose-500 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-rose-500 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Out of Stock</p>
                        <p className="text-4xl font-extrabold text-slate-900">{products.filter(p => p.stock === 0).length}</p>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden animate-slide-up delay-200">
                <div className="px-6 py-5 border-b border-slate-100 bg-white/50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Product List</h2>
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64 transition-all" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 border-b border-slate-100">Product Name</th>
                                <th className="px-6 py-4 border-b border-slate-100">Category</th>
                                <th className="px-6 py-4 border-b border-slate-100">Stock</th>
                                <th className="px-6 py-4 border-b border-slate-100">Price</th>
                                <th className="px-6 py-4 border-b border-slate-100 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-500 transition-colors">
                                                {product.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                                                <div className="text-xs text-slate-500">ID: #{product.id.toString().padStart(4, '0')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                            product.stock === 0 ? 'bg-rose-100 text-rose-700' :
                                            product.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                product.stock === 0 ? 'bg-rose-500' :
                                                product.stock < 10 ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}></span>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                                        ${product.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
