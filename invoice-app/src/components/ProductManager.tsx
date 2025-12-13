import React, { useState } from 'react';
import { useProductStore } from '../utils/useProductStore';
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import type { Product } from '../types';

interface ProductManagerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect?: (product: Product) => void;
}

export const ProductManager: React.FC<ProductManagerProps> = ({ isOpen, onClose, onSelect }) => {
    const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        description: '',
        hsnCode: '',
        rate: 0,
        unit: 'PCS',
        taxRate: 18
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateProduct(editingId, formData);
            setEditingId(null);
        } else {
            addProduct(formData);
            setIsAdding(false);
        }
        // Reset form
        setFormData({ description: '', hsnCode: '', rate: 0, unit: 'PCS', taxRate: 18 });
    };

    const handleEdit = (product: Product) => {
        setFormData({
            description: product.description,
            hsnCode: product.hsnCode,
            rate: product.rate,
            unit: product.unit,
            taxRate: product.taxRate
        });
        setEditingId(product.id);
        setIsAdding(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleSelect = (product: Product) => {
        if (onSelect) {
            onSelect(product);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4 print:hidden">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-xl">
                    <h2 className="text-xl font-semibold text-white">Product Manager</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">

                    {!isAdding ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Plus size={20} className="group-hover:scale-110 transition-transform" />
                                Add New Product
                            </button>

                            <div className="grid gap-2">
                                {products.length === 0 && (
                                    <div className="text-center py-8 text-slate-500">No products saved yet.</div>
                                )}
                                {products.map(product => (
                                    <div key={product.id} className="bg-slate-800/50 hover:bg-slate-800 p-3 rounded-lg flex items-center justify-between group border border-slate-700/50 hover:border-blue-500/30 transition-all">
                                        <div className="flex-1 cursor-pointer" onClick={() => handleSelect(product)}>
                                            <div className="font-medium text-slate-200">{product.description}</div>
                                            <div className="text-sm text-slate-400 flex gap-4">
                                                <span>HSN: {product.hsnCode}</span>
                                                <span>Rate: ₹{product.rate}</span>
                                                <span>Tax: {product.taxRate}%</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {onSelect && (
                                                <button
                                                    onClick={() => handleSelect(product)}
                                                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded mr-2"
                                                >
                                                    Select
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-slate-400">Description</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field w-full bg-slate-950 border-slate-700 focus:border-blue-500 rounded-md p-2 text-white"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">HSN Code</label>
                                    <input
                                        type="text"
                                        className="input-field w-full bg-slate-950 border-slate-700 focus:border-blue-500 rounded-md p-2 text-white"
                                        value={formData.hsnCode}
                                        onChange={e => setFormData({ ...formData, hsnCode: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Rate</label>
                                    <input
                                        type="number"
                                        required
                                        className="input-field w-full bg-slate-950 border-slate-700 focus:border-blue-500 rounded-md p-2 text-white"
                                        value={formData.rate}
                                        onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Unit</label>
                                    <select
                                        className="input-field w-full bg-slate-950 border-slate-700 focus:border-blue-500 rounded-md p-2 text-white"
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="PCS">PCS</option>
                                        <option value="SET">SET</option>
                                        <option value="ROLL">ROLL</option>
                                        <option value="KG">KG</option>
                                        <option value="NOS">NOS</option>
                                        <option value="BOX">BOX</option>
                                        <option value="MTR">MTR</option>
                                        <option value="PKT">PKT</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-slate-400">Tax Rate (%)</label>
                                    <select
                                        className="input-field w-full bg-slate-950 border-slate-700 focus:border-blue-500 rounded-md p-2 text-white"
                                        value={formData.taxRate}
                                        onChange={e => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
                                    >
                                        <option value="0">0%</option>
                                        <option value="5">5%</option>
                                        <option value="12">12%</option>
                                        <option value="18">18%</option>
                                        <option value="28">28%</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => { setIsAdding(false); setEditingId(null); }}
                                    className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingId ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
