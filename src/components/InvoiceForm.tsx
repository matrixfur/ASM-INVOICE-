import React, { useState } from 'react';
import type { InvoiceData, InvoiceItem, InvoiceParty, InvoiceDetails, Product } from '../types';
import { Plus, Trash2, Package } from 'lucide-react';
import { ProductManager } from './ProductManager';
import { useProductStore } from '../utils/useProductStore';

interface InvoiceFormProps {
    data: InvoiceData;
    onChange: (data: InvoiceData) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
    const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);
    const { products } = useProductStore();

    const handleSenderChange = (field: keyof InvoiceParty | string, value: string) => {
        onChange({ ...data, sender: { ...data.sender, [field]: value } });
    };

    const handleReceiverChange = (field: keyof InvoiceParty, value: string) => {
        onChange({ ...data, receiver: { ...data.receiver, [field]: value } });
    };

    const handleDetailChange = (field: keyof InvoiceDetails, value: string) => {
        onChange({ ...data, details: { ...data.details, [field]: value } });
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange({ ...data, items: newItems });
    };

    // Auto-fill from product selection if description matches
    const handleProductSelect = (index: number, productName: string) => {
        const product = products.find(p => p.description === productName);

        const newItems = [...data.items];
        // Always update description
        newItems[index] = { ...newItems[index], description: productName };

        // If product found, auto-fill other fields
        if (product) {
            newItems[index] = {
                ...newItems[index],
                hsnCode: product.hsnCode,
                rate: product.rate,
                unit: product.unit,
                taxRate: product.taxRate
            };
        }
        onChange({ ...data, items: newItems });
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            description: '',
            hsnCode: '',
            qty: 0,
            unit: '',
            rate: 0,
            taxRate: 18,
        };
        onChange({ ...data, items: [...data.items, newItem] });
    };

    const removeItem = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        onChange({ ...data, items: newItems });
    };

    const handleProductSelectFromManager = (product: Product) => {
        const newItem: InvoiceItem = {
            id: Date.now().toString(),
            description: product.description,
            hsnCode: product.hsnCode,
            qty: 1, // Default to 1
            unit: product.unit,
            rate: product.rate,
            taxRate: product.taxRate,
        };
        onChange({ ...data, items: [...data.items, newItem] });
    };

    return (
        <div className="space-y-6 p-4">

            <ProductManager
                isOpen={isProductManagerOpen}
                onClose={() => setIsProductManagerOpen(false)}
                onSelect={handleProductSelectFromManager}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sender Section */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">From (Distributor)</h3>
                    <input className="input-field" placeholder="Name" value={data.sender.name} onChange={e => handleSenderChange('name', e.target.value)} />
                    <textarea className="input-field h-20" placeholder="Address" value={data.sender.address} onChange={e => handleSenderChange('address', e.target.value)} />
                    <input className="input-field" placeholder="GSTIN" value={data.sender.gstin} onChange={e => handleSenderChange('gstin', e.target.value)} />
                    <input className="input-field" placeholder="Phone" value={data.sender.phone} onChange={e => handleSenderChange('phone', e.target.value)} />
                </div>

                {/* Receiver Section */}
                <div className="space-y-3">
                    <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">To (Customer)</h3>
                    <input className="input-field" placeholder="Name" value={data.receiver.name} onChange={e => handleReceiverChange('name', e.target.value)} />
                    <textarea className="input-field h-20" placeholder="Address" value={data.receiver.address} onChange={e => handleReceiverChange('address', e.target.value)} />
                    <input className="input-field" placeholder="GSTIN" value={data.receiver.gstin} onChange={e => handleReceiverChange('gstin', e.target.value)} />
                </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-4 gap-4 border-t border-b border-slate-700 py-4 my-2">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">P.O. Number</label>
                    <input className="input-field" placeholder="PO-001" value={data.details.poNumber || ''} onChange={e => handleDetailChange('poNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">P.O. Date</label>
                    <input type="date" className="input-field" value={data.details.poDate || ''} onChange={e => handleDetailChange('poDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Despatched Through</label>
                    <input className="input-field" placeholder="Carrier/Method" value={data.details.despatchedThrough || ''} onChange={e => handleDetailChange('despatchedThrough', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">L.R. Number</label>
                    <input className="input-field" placeholder="LR-001" value={data.details.lrNumber || ''} onChange={e => handleDetailChange('lrNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">L.R. Date</label>
                    <input type="date" className="input-field" value={data.details.lrDate || ''} onChange={e => handleDetailChange('lrDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Freight</label>
                    <input className="input-field" placeholder="Paid/To Pay" value={data.details.freight || ''} onChange={e => handleDetailChange('freight', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">D.C. Number</label>
                    <input className="input-field" placeholder="DC-001" value={data.details.dcNumber || ''} onChange={e => handleDetailChange('dcNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">D.C. Date</label>
                    <input type="date" className="input-field" value={data.details.dcDate || ''} onChange={e => handleDetailChange('dcDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Bill No</label>
                    <input className="input-field" value={data.details.invoiceNo} onChange={e => handleDetailChange('invoiceNo', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Date</label>
                    <input type="date" className="input-field" value={data.details.date} onChange={e => handleDetailChange('date', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Time</label>
                    <input type="time" className="input-field" value={data.details.time || ''} onChange={e => handleDetailChange('time', e.target.value)} />
                </div>
            </div>

            {/* Items Section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-400 uppercase text-xs tracking-wider">Items</h3>
                    <button
                        onClick={() => setIsProductManagerOpen(true)}
                        className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                        <Package size={14} /> Manage Products
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-700">
                    <table className="w-full text-sm text-left text-slate-300">
                        <thead className="bg-slate-900 text-xs uppercase bg-slate-700/50 text-slate-300">
                            <tr>
                                <th className="p-3">Description</th>
                                <th className="p-3 w-24">HSN</th>
                                <th className="p-3 w-20">Qty</th>
                                <th className="p-3 w-20">Unit</th>
                                <th className="p-3 w-24">Rate</th>
                                <th className="p-3 w-20">Tax%</th>
                                <th className="p-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {data.items.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                                    <td className="p-2 relative">
                                        <input
                                            list={`products-list-${index}`}
                                            className="input-field bg-transparent border-none focus:bg-slate-800 w-full"
                                            value={item.description}
                                            onChange={e => handleProductSelect(index, e.target.value)}
                                            placeholder="Type or select..."
                                        />
                                        <datalist id={`products-list-${index}`}>
                                            {products.map(p => (
                                                <option key={p.id} value={p.description} />
                                            ))}
                                        </datalist>
                                    </td>
                                    <td className="p-2">
                                        <input className="input-field bg-transparent border-none focus:bg-slate-800 text-center" value={item.hsnCode} onChange={e => handleItemChange(index, 'hsnCode', e.target.value)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-field bg-transparent border-none focus:bg-slate-800 text-right" value={item.qty} onChange={e => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="p-2">
                                        <input className="input-field bg-transparent border-none focus:bg-slate-800 text-center" value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-field bg-transparent border-none focus:bg-slate-800 text-right" value={item.rate} onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-field bg-transparent border-none focus:bg-slate-800 text-center" value={item.taxRate} onChange={e => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button onClick={addItem} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium">
                        <Plus size={16} /> Add New Item
                    </button>

                    <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-slate-400">Vehicle No:</label>
                        <input
                            className="input-field w-40 text-sm py-1"
                            placeholder="TN 00 AA 0000"
                            value={data.details.vehicleNumber || ''}
                            onChange={e => handleDetailChange('vehicleNumber', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
