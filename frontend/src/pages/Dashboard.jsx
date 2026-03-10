import React, { useState } from 'react';

const Dashboard = ({ user }) => {
    const [products] = useState([
        { id: 1, name: 'Laptop Pro', stock: 15, price: 1200, category: 'Electronics' },
        { id: 2, name: 'Office Chair', stock: 5, price: 250, category: 'Furniture' },
        { id: 3, name: 'Coffee Mug', stock: 50, price: 15, category: 'Kitchen' },
    ]);

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-gray-900">Inventory Dashboard</h1>
                <p className="text-gray-500 mt-2">Manage your stock and track availability.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Products</p>
                    <p className="text-3xl font-bold text-blue-600">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                    <p className="text-3xl font-bold text-amber-600">{products.filter(p => p.stock < 10).length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Out of Stock</p>
                    <p className="text-3xl font-bold text-red-600">{products.filter(p => p.stock === 0).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Product List</h2>
                    {user.role === 'ADMIN' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all">
                            + Add Product
                        </button>
                    )}
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Product Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-semibold">${product.price}</td>
                                <td className="px-6 py-4 text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                                    View Details
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
