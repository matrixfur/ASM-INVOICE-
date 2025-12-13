import type { InvoiceItem } from '../types';

export const calculateItemAmount = (item: InvoiceItem) => {
    return item.qty * item.rate;
};

export const calculateSubTotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + calculateItemAmount(item), 0);
};

export const calculateTotalTax = (items: InvoiceItem[]) => {
    // Assuming tax is inclusive or exclusive? Image shows Rate 260, Amount 1300, Tax% 18, Total 1534.
    // 1300 * 0.18 = 234. 1300 + 234 = 1534.
    // So tax is calculated on the amount.
    return items.reduce((sum, item) => {
        const amount = calculateItemAmount(item);
        return sum + (amount * (item.taxRate / 100));
    }, 0);
};

export const calculateTotalAmount = (items: InvoiceItem[]) => {
    const subTotal = calculateSubTotal(items);
    const tax = calculateTotalTax(items);
    return subTotal + tax;
};
