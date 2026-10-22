import React from 'react';
import { useInvoiceStore, type SavedInvoice } from '../utils/useInvoiceStore';
import { X, FileText, Trash2, RotateCcw } from 'lucide-react';
import type { InvoiceData } from '../types';

interface InvoiceHistoryProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (data: InvoiceData) => void;
}

export const InvoiceHistory: React.FC<InvoiceHistoryProps> = ({ isOpen, onClose, onLoad }) => {
    const { savedInvoices, deleteInvoice } = useInvoiceStore();

    if (!isOpen) return null;

    const handleLoad = (invoice: SavedInvoice) => {
        if (confirm('Load this invoice? Unsaved changes in the current editor will be lost.')) {
            onLoad(invoice.data);
            onClose();
        }
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this saved invoice?')) {
            deleteInvoice(id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end print:hidden"
            style={{ background: '#1e1b4b30', backdropFilter: 'blur(6px)' }}>

            <div className="w-full max-w-md h-full flex flex-col"
                style={{ background: '#ffffff', borderLeft: '1px solid #ede9fe', boxShadow: '-8px 0 40px #7c3aed15' }}>

                {/* Header */}
                <div className="p-5 flex justify-between items-center"
                    style={{ borderBottom: '1px solid #ede9fe', background: 'linear-gradient(135deg,#f5f3ff,#ffffff)' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Outfit, sans-serif' }}>
                            <div style={{ padding: '6px', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', borderRadius: '8px', display: 'flex' }}>
                                <FileText size={16} style={{ color: '#fff' }} />
                            </div>
                            Saved Bills
                        </h2>
                        <p style={{ fontSize: '12px', color: '#a78bfa', marginTop: '2px' }}>
                            {savedInvoices.length} invoice{savedInvoices.length !== 1 ? 's' : ''} saved
                        </p>
                    </div>
                    <button onClick={onClose}
                        style={{
                            padding: '8px', borderRadius: '8px', border: '1px solid #ede9fe',
                            background: '#ffffff', cursor: 'pointer', color: '#6b7280',
                            display: 'flex', transition: 'all 0.18s'
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5f3ff'; (e.currentTarget as HTMLElement).style.color = '#5b21b6'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}>
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto p-4 space-y-3"
                    style={{ background: '#faf9ff' }}>

                    {savedInvoices.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-48 gap-3">
                            <div style={{ padding: '16px', background: '#f5f3ff', borderRadius: '50%' }}>
                                <FileText size={32} style={{ color: '#c4b5fd' }} />
                            </div>
                            <p style={{ color: '#a78bfa', fontSize: '14px', fontWeight: 500 }}>No saved invoices yet</p>
                            <p style={{ color: '#d8b4fe', fontSize: '12px' }}>Create and save a bill to see it here</p>
                        </div>
                    )}

                    {savedInvoices.map(invoice => (
                        <div key={invoice.id}
                            style={{
                                background: '#ffffff', border: '1px solid #ede9fe',
                                borderRadius: '12px', padding: '14px', transition: 'all 0.18s',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#c4b5fd'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px #7c3aed12'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ede9fe'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e1b4b' }}>{invoice.name}</div>
                                    <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '3px' }}>
                                        Saved: {new Date(invoice.savedAt).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#5b21b6' }}>₹{invoice.amount.toLocaleString('en-IN')}</div>
                                    <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '2px' }}>Date: {invoice.date}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f3f0ff' }}>
                                <button
                                    onClick={() => handleLoad(invoice)}
                                    style={{
                                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                        padding: '7px', fontSize: '12px', fontWeight: 600, borderRadius: '8px', cursor: 'pointer',
                                        background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)',
                                        color: '#5b21b6', border: '1px solid #c4b5fd', transition: 'all 0.18s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,#7c3aed,#a855f7)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg,#f5f3ff,#ede9fe)'; (e.currentTarget as HTMLElement).style.color = '#5b21b6'; }}
                                >
                                    <RotateCcw size={13} /> Load Invoice
                                </button>
                                <button
                                    onClick={(e) => handleDelete(invoice.id, e)}
                                    style={{
                                        padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.18s',
                                        background: '#fff5f5', color: '#dc2626', border: '1px solid #fecaca'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#fee2e2'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff5f5'; }}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
