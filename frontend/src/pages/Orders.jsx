import React, { useState, useEffect, useMemo } from 'react';

const Orders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Place Order Modal State
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [orderItems, setOrderItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOpenOrderModal = () => {
        fetchProducts(); // ensure fresh stock data
        setOrderItems([]);
        setSelectedProductId('');
        setSelectedQuantity(1);
        setIsOrderModalOpen(true);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                fetchOrders();
            } else {
                alert(data.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating order status');
        }
    };

    // ------------- PLACE ORDER LOGIC -------------
    
    const handleAddItem = () => {
        if (!selectedProductId || selectedQuantity < 1) return;
        
        const product = products.find(p => p._id === selectedProductId);
        if (!product) return;

        // Calculate quantity currently exactly pending in cart
        const existingItem = orderItems.find(item => item.product._id === selectedProductId);
        const qtyToAdd = parseInt(selectedQuantity);
        const newTotalQuantity = existingItem ? existingItem.quantity + qtyToAdd : qtyToAdd;

        if (newTotalQuantity > product.stock) {
            alert(`Cannot exceed available stock. You tried to add ${newTotalQuantity}, but only ${product.stock} are left.`);
            return;
        }

        if (existingItem) {
             setOrderItems(orderItems.map(item => 
                 item.product._id === selectedProductId 
                     ? { ...item, quantity: newTotalQuantity } 
                     : item
             ));
        } else {
            setOrderItems([...orderItems, { product, quantity: qtyToAdd, unitPrice: product.price }]);
        }
        
        setSelectedProductId('');
        setSelectedQuantity(1);
    };

    const handleRemoveItem = (idx) => {
        const newItems = [...orderItems];
        newItems.splice(idx, 1);
        setOrderItems(newItems);
    };

    const handleSubmitOrder = async () => {
        if (orderItems.length === 0) return;
        setIsSubmitting(true);
        
        const itemsPayload = orderItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        }));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ items: itemsPayload })
            });
            const data = await response.json();
            
            if (data.success) {
                setIsOrderModalOpen(false);
                setOrderItems([]);
                fetchOrders(); // refresh global list
            } else {
                alert(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error(error);
            alert('Error placing order');
        } finally {
            setIsSubmitting(false);
        }
    };

    const orderGrandTotal = useMemo(() => {
        return orderItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    }, [orderItems]);

    const activeProduct = selectedProductId ? products.find(p => p._id === selectedProductId) : null;

    return (
        <div className="space-y-8 pb-12 animate-fade-in relative z-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-slide-up">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track and update the lifecycle of your orders.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary" onClick={fetchOrders} disabled={isLoading}>Refresh Data</button>
                    <button className="btn-primary shadow-blue-500/20 px-5 py-2" onClick={handleOpenOrderModal}>
                        + Place Order
                    </button>
                </div>
            </header>

            <div className="glass-card overflow-hidden animate-slide-up delay-200">
                <div className="px-6 py-5 border-b border-slate-100 bg-white/50">
                    <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium">No orders found. Place your first order!</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 border-b border-slate-100">Order ID</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Date</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Customer</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Items</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Total Amount</th>
                                    <th className="px-6 py-4 border-b border-slate-100">Status</th>
                                    <th className="px-6 py-4 border-b border-slate-100 text-right">Update Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {orders.map(order => (
                                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                            <span className="text-xs text-slate-500 font-mono">#{order._id.toString().slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            <div className="font-semibold text-slate-800">{order.user?.name || 'Unknown User'}</div>
                                            <div className="text-xs text-slate-400">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-bold">
                                            ${order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                                                order.status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-700' :
                                                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <select 
                                                value=""
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 hover:border-blue-300 transition-colors shadow-sm cursor-pointer"
                                                disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                            >
                                                <option value="" disabled>Change Status</option>
                                                <option value="CONFIRMED" disabled={order.status !== 'PENDING'}>CONFIRM</option>
                                                <option value="SHIPPED" disabled={order.status !== 'CONFIRMED'}>SHIP</option>
                                                <option value="DELIVERED" disabled={order.status !== 'SHIPPED'}>DELIVER</option>
                                                <option value="CANCELLED">CANCEL</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* PLACE ORDER MODAL */}
            {isOrderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/20 w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800">Place New Order</h3>
                            <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Col: Add Items */}
                            <div className="space-y-5">
                                <h4 className="font-bold text-slate-700 border-b border-slate-100 pb-2">Select Products</h4>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Product</label>
                                    <select 
                                        value={selectedProductId} 
                                        onChange={e => setSelectedProductId(e.target.value)} 
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-700"
                                    >
                                        <option value="" disabled>Search or Select Product...</option>
                                        {products.length === 0 ? <option disabled>Loading products...</option> : null}
                                        {products.map(p => (
                                            <option key={p._id} value={p._id} disabled={p.stock === 0}>
                                                {p.name} {p.stock === 0 ? '(Out of Stock)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {activeProduct && (
                                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg text-sm border border-blue-100">
                                        <span className="font-medium text-slate-700">Available Stock: <strong className="text-blue-700">{activeProduct.stock}</strong></span>
                                        <span className="font-medium text-slate-700">Price: <strong className="text-blue-700">${activeProduct.price}</strong></span>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Quantity</label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max={activeProduct ? activeProduct.stock : 1}
                                            value={selectedQuantity} 
                                            onChange={e => setSelectedQuantity(e.target.value)} 
                                            disabled={!activeProduct}
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-slate-700 disabled:opacity-50"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleAddItem}
                                        disabled={!activeProduct || selectedQuantity < 1}
                                        className="w-full px-4 py-2.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                            
                            {/* Right Col: Cart Summary */}
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col">
                                <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-2 mb-4">Cart Summary</h4>
                                <div className="flex-1 overflow-y-auto max-h-64 pr-2 space-y-3">
                                    {orderItems.length === 0 ? (
                                        <p className="text-sm text-slate-400 text-center italic mt-10">Cart is empty.</p>
                                    ) : (
                                        orderItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                                                <div className="overflow-hidden">
                                                    <div className="font-bold text-sm text-slate-800 truncate">{item.product.name}</div>
                                                    <div className="text-xs text-slate-500">{item.quantity} x ${item.unitPrice}</div>
                                                </div>
                                                <div className="flex flex-col items-end pl-2">
                                                    <div className="font-bold text-sm text-indigo-600">${(item.quantity * item.unitPrice).toLocaleString()}</div>
                                                    <button onClick={() => handleRemoveItem(idx)} className="text-xs text-rose-500 hover:text-rose-700 font-medium mt-1">Remove</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="font-bold text-slate-600 uppercase text-sm tracking-wider">Grand Total</span>
                                    <span className="text-2xl font-extrabold text-slate-900">${orderGrandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-2xl">
                            <button 
                                onClick={() => setIsOrderModalOpen(false)} 
                                className="px-5 py-2.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmitOrder} 
                                disabled={orderItems.length === 0 || isSubmitting}
                                className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/30 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                )}
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
