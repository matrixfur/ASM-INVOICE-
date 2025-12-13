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
        if (confirm('Load this invoice? Unsaved changes in current editor will be lost.')) {
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end backdrop-blur-sm print:hidden">
            <div className="bg-slate-900 border-l border-slate-700 w-full max-w-md h-full shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FileText className="text-blue-500" /> Saved Bills
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto p-4 space-y-3">
                    {savedInvoices.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            No saved invoices found.
                        </div>
                    )}

                    {savedInvoices.map(invoice => (
                        <div key={invoice.id} className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/30 p-4 rounded-lg flex flex-col gap-2 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold text-slate-200">{invoice.name}</div>
                                    <div className="text-xs text-slate-400">
                                        Saved: {new Date(invoice.savedAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white">₹{invoice.amount}</div>
                                    <div className="text-xs text-slate-400">Date: {invoice.date}</div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-2 pt-2 border-t border-slate-700/50">
                                <button
                                    onClick={() => handleLoad(invoice)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded transition-colors"
                                >
                                    <RotateCcw size={14} /> Load
                                </button>
                                <button
                                    onClick={(e) => handleDelete(invoice.id, e)}
                                    className="px-3 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
