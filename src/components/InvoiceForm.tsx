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
        <div className="space-y-5 p-4 sm:p-5">

            <ProductManager
                isOpen={isProductManagerOpen}
                onClose={() => setIsProductManagerOpen(false)}
                onSelect={handleProductSelectFromManager}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sender Section */}
                <div className="space-y-3">
                    <h3 className="section-label">From (Distributor)</h3>
                    <input className="input-field" placeholder="Name" value={data.sender.name} onChange={e => handleSenderChange('name', e.target.value)} />
                    <textarea className="input-field h-20" placeholder="Address" value={data.sender.address} onChange={e => handleSenderChange('address', e.target.value)} />
                    <input className="input-field" placeholder="GSTIN" value={data.sender.gstin} onChange={e => handleSenderChange('gstin', e.target.value)} />
                    <input className="input-field" placeholder="Phone" value={data.sender.phone} onChange={e => handleSenderChange('phone', e.target.value)} />
                </div>

                {/* Receiver Section */}
                <div className="space-y-3">
                    <h3 className="section-label">To (Customer)</h3>
                    <input className="input-field" placeholder="Name" value={data.receiver.name} onChange={e => handleReceiverChange('name', e.target.value)} />
                    <textarea className="input-field h-20" placeholder="Address" value={data.receiver.address} onChange={e => handleReceiverChange('address', e.target.value)} />
                    <input className="input-field" placeholder="GSTIN" value={data.receiver.gstin} onChange={e => handleReceiverChange('gstin', e.target.value)} />
                </div>
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 py-4 my-2" style={{borderTop:'1px solid #ede9fe',borderBottom:'1px solid #ede9fe'}}>
                <div className="space-y-1">
                    <label className="section-label">P.O. Number</label>
                    <input className="input-field" placeholder="PO-001" value={data.details.poNumber || ''} onChange={e => handleDetailChange('poNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">P.O. Date</label>
                    <input type="date" className="input-field" value={data.details.poDate || ''} onChange={e => handleDetailChange('poDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">Despatched Through</label>
                    <input className="input-field" placeholder="Carrier/Method" value={data.details.despatchedThrough || ''} onChange={e => handleDetailChange('despatchedThrough', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">L.R. Number</label>
                    <input className="input-field" placeholder="LR-001" value={data.details.lrNumber || ''} onChange={e => handleDetailChange('lrNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">L.R. Date</label>
                    <input type="date" className="input-field" value={data.details.lrDate || ''} onChange={e => handleDetailChange('lrDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">Freight</label>
                    <input className="input-field" placeholder="Paid/To Pay" value={data.details.freight || ''} onChange={e => handleDetailChange('freight', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">D.C. Number</label>
                    <input className="input-field" placeholder="DC-001" value={data.details.dcNumber || ''} onChange={e => handleDetailChange('dcNumber', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">D.C. Date</label>
                    <input type="date" className="input-field" value={data.details.dcDate || ''} onChange={e => handleDetailChange('dcDate', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">Bill No</label>
                    <input className="input-field" value={data.details.invoiceNo} onChange={e => handleDetailChange('invoiceNo', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">Date</label>
                    <input type="date" className="input-field" value={data.details.date} onChange={e => handleDetailChange('date', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <label className="section-label">Time</label>
                    <input type="time" className="input-field" value={data.details.time || ''} onChange={e => handleDetailChange('time', e.target.value)} />
                </div>
            </div>

            {/* Items Section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="section-label">Items</h3>
                    <button
                        onClick={() => setIsProductManagerOpen(true)}
                        style={{ fontSize:'12px', display:'flex', alignItems:'center', gap:'5px', color:'#7c3aed', fontWeight:600, background:'#f5f3ff', border:'1px solid #ede9fe', borderRadius:'7px', padding:'4px 10px', cursor:'pointer' }}
                    >
                        <Package size={13} /> Manage Products
                    </button>
                </div>

                <div className="overflow-x-auto rounded-lg" style={{border:'1px solid #ede9fe'}}>
                    <table className="w-full text-sm text-left" style={{color:'#374151'}}>
                        <thead style={{background:'linear-gradient(135deg,#f5f3ff,#ede9fe70)', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#7c3aed'}}>
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
                        <tbody>
                            {data.items.map((item, index) => (
                                <tr key={item.id} style={{borderTop:'1px solid #f3f0ff', transition:'background 0.15s'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#faf9ff'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background=''}>
                                    <td className="p-2 relative">
                                        <input
                                            list={`products-list-${index}`}
                                            className="input-field"
                                            style={{background:'transparent',border:'none',borderRadius:0}}
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
                                        <input className="input-field text-center" style={{background:'transparent',border:'none',borderRadius:0}} value={item.hsnCode} onChange={e => handleItemChange(index, 'hsnCode', e.target.value)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-field text-right" style={{background:'transparent',border:'none',borderRadius:0}} value={item.qty} onChange={e => handleItemChange(index, 'qty', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="p-2">
                                        <input className="input-field text-center" style={{background:'transparent',border:'none',borderRadius:0}} value={item.unit} onChange={e => handleItemChange(index, 'unit', e.target.value)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-field text-right" style={{background:'transparent',border:'none',borderRadius:0}} value={item.rate} onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="p-2">
                                        <input type="number" className="input-field text-center" style={{background:'transparent',border:'none',borderRadius:0}} value={item.taxRate} onChange={e => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)} />
                                    </td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => removeItem(index)} style={{color:'#dc2626',background:'none',border:'none',cursor:'pointer',padding:'4px',borderRadius:'6px',display:'flex',transition:'background 0.15s'}} onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#fee2e2'} onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='none'}><Trash2 size={15} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 items-center justify-between">
                    <button onClick={addItem} style={{display:'flex',alignItems:'center',gap:'6px',color:'#7c3aed',fontWeight:600,fontSize:'13px',background:'#f5f3ff',border:'1px solid #ede9fe',borderRadius:'8px',padding:'8px 16px',cursor:'pointer',transition:'all 0.18s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='linear-gradient(135deg,#7c3aed,#a855f7)';(e.currentTarget as HTMLElement).style.color='#fff';}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='#f5f3ff';(e.currentTarget as HTMLElement).style.color='#7c3aed';}}>
                        <Plus size={15} /> Add New Item
                    </button>
                    <div className="flex items-center gap-2">
                        <label className="section-label">Vehicle No:</label>
                        <input
                            className="input-field text-sm"
                            style={{width:'160px'}}
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
