import { useState, useEffect } from 'react';
import type { Product } from '../types';

const STORAGE_KEY = 'invoice_app_products';

export const useProductStore = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProducts(JSON.parse(stored));
            } catch (error) {
                console.error('Failed to parse products', error);
            }
        }
    }, []);

    const saveProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    };

    const addProduct = (product: Omit<Product, 'id'>) => {
        const newProduct = { ...product, id: crypto.randomUUID() };
        saveProducts([...products, newProduct]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        const newProducts = products.map(p => p.id === id ? { ...p, ...updates } : p);
        saveProducts(newProducts);
    };

    const deleteProduct = (id: string) => {
        const newProducts = products.filter(p => p.id !== id);
        saveProducts(newProducts);
    };

    return {
        products,
        addProduct,
        updateProduct,
        deleteProduct
    };
};
