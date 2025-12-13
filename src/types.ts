export interface InvoiceItem {
    id: string;
    description: string;
    hsnCode: string;
    qty: number;
    unit: string;
    rate: number;
    taxRate: number;
}

export interface InvoiceParty {
    name: string;
    address: string;
    gstin: string;
    phone?: string;
}

export interface InvoiceDetails {
    invoiceNo: string;
    date: string;
    paymentTerms: string;
    signatory: string;
    vehicleNumber?: string;
    termsAndConditions?: string; // Optional
}

export interface InvoiceData {
    sender: InvoiceParty & { title?: string, subTitle?: string }; // Mahaveer Distributors specific
    receiver: InvoiceParty;
    details: InvoiceDetails;
    items: InvoiceItem[];
}

export interface Product {
    id: string;
    description: string;
    hsnCode: string;
    rate: number;
    unit: string;
    taxRate: number;
}
