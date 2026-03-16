import React, { useState, useEffect } from 'react';

const Dashboard = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/products');
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const updateStock = async (id, newQuantity, version) => {
        try {
            const response = await fetch(`http://localhost:5001/api/products/${id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity, version, role: user.role })
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '' });

    const handleAddProductSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5001/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProduct.name,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock, 10),
                    category: newProduct.category,
                    role: user.role
                })
            });
            const data = await response.json();
            if (data.success) {
                setIsAddFormOpen(false);
                setNewProduct({ name: '', price: '', stock: '', category: '' });
                fetchProducts();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                    <button className="btn-secondary" onClick={fetchProducts}>Refresh Data</button>
                    {user.role === 'ADMIN' && (
                        <button onClick={() => setIsAddFormOpen(true)} className="btn-primary shadow-blue-500/20 px-5 py-2">
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
                                <tr key={product._id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-400 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-500 transition-colors">
                                                {product.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                                                <div className="text-xs text-slate-500">ID: #{product._id ? product._id.toString().slice(-4) : '0000'}</div>
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
                                        <div className="flex justify-end gap-2 pr-2">
                                            <button 
                                                onClick={() => updateStock(product._id, 1, product.version)}
                                                className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center font-bold transition-colors"
                                            >
                                                +
                                            </button>
                                            <button 
                                                onClick={() => updateStock(product._id, -1, product.version)}
                                                className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center font-bold transition-colors"
                                                disabled={product.stock === 0}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isAddFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/20 w-full max-w-md overflow-hidden relative">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Add New Product</h3>
                            <button onClick={() => setIsAddFormOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddProductSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Product Name</label>
                                <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="e.g. Wireless Mouse" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price ($)</label>
                                    <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="29.99" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Initial Stock</label>
                                    <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all" placeholder="100" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700">
                                    <option value="" disabled>Select a category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Furniture">Furniture</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Office">Office</option>
                                    <option value="Generic">Generic</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsAddFormOpen(false)} className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg shadow-sm font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 font-medium transition-colors">Create Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
