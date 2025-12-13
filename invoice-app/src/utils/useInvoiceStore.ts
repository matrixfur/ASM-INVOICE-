import { useState, useEffect } from 'react';
import type { InvoiceData } from '../types';

const STORAGE_KEY = 'invoice_app_saved_bills';

export interface SavedInvoice {
    id: string;
    name: string; // Customer name for easy ID
    date: string;
    amount: number;
    savedAt: number;
    data: InvoiceData;
}

export const useInvoiceStore = () => {
    const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setSavedInvoices(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse saved invoices', error);
            }
        }
    }, []);

    const saveToStorage = (invoices: SavedInvoice[]) => {
        setSavedInvoices(invoices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    };

    const saveInvoice = (data: InvoiceData) => {
        // Calculate total for summary
        const totalAmount = data.items.reduce((sum, item) => {
            const amount = item.qty * item.rate;
            const tax = amount * (item.taxRate / 100);
            return sum + amount + tax;
        }, 0);

        const newInvoice: SavedInvoice = {
            id: crypto.randomUUID(),
            name: data.receiver.name || 'Unknown',
            date: data.details.date || new Date().toISOString().split('T')[0],
            amount: Math.round(totalAmount),
            savedAt: Date.now(),
            data: data
        };

        const updated = [newInvoice, ...savedInvoices];
        saveToStorage(updated);
    };

    const deleteInvoice = (id: string) => {
        const updated = savedInvoices.filter(inv => inv.id !== id);
        saveToStorage(updated);
    };

    return {
        savedInvoices,
        saveInvoice,
        deleteInvoice
    };
};
