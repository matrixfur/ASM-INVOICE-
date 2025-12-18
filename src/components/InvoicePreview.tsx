import React from 'react';
import type { InvoiceData } from '../types';
import { calculateItemAmount, calculateSubTotal, calculateTotalTax, calculateTotalAmount } from '../utils/calculations';
import { numberToWords } from '../utils/numberToWords';

interface InvoicePreviewProps {
    data: InvoiceData;
    label?: string;
    taxType?: 'local' | 'igst';
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, label = '(ORIGINAL)', taxType = 'local' }) => {
    const subTotal = calculateSubTotal(data.items);
    const totalTax = calculateTotalTax(data.items);
    const totalAmount = calculateTotalAmount(data.items);
    const roundOff = Math.round(totalAmount) - totalAmount;
    const finalAmount = Math.round(totalAmount);

    // Group tax by rate for the footer (simplified logic based on image)
    const isLocal = taxType === 'local';
    const cgst = isLocal ? totalTax / 2 : 0;
    const sgst = isLocal ? totalTax / 2 : 0;
    const igst = !isLocal ? totalTax : 0;

    // Calculate total quantity
    const totalQty = data.items.reduce((sum, item) => sum + item.qty, 0);

    return (
        <div className="bg-white text-black p-8 mx-auto text-[12px] font-sans border border-gray-300 print:border-none w-[21cm] min-h-[29.7cm] relative leading-normal">
            {/* Main Border Container */}
            <div className="border-2 border-black flex flex-col min-h-[28cm] relative z-10">

                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1] opacity-20">
                    <img src="/logo.png" alt="Watermark" className="w-[900px] h-auto object-contain" />
                </div>

                {/* Top Header */}
                <div className="border-b-2 border-black px-4 py-2 flex justify-between items-start">
                    <div className="font-bold text-sm">GSTIN: {data.sender.gstin}</div>
                    <div className="text-right">
                        <div className="italic text-[11px] mb-1">{label}</div>
                        <div className="font-bold leading-none text-sm">{data.sender.phone}</div>
                    </div>
                </div>

                {/* Title Section */}
                <div className="text-center py-4 border-b-2 border-black">
                    <h1 className="text-3xl font-bold uppercase tracking-wide font-serif mb-2 text-black">
                        {data.sender.name}
                    </h1>
                    <div className="whitespace-pre-line leading-tight text-[13px] font-medium mb-1">
                        {data.sender.address}
                    </div>
                    {data.sender.subTitle && (
                        <div className="text-[13px] font-medium">{data.sender.subTitle}</div>
                    )}
                    <h2 className="font-bold border-t-2 border-black mt-3 pt-1 inline-block w-full text-lg tracking-wider">
                        {taxType === 'igst' ? 'IGST INVOICE' : 'INVOICE'}
                    </h2>
                </div>

                {/* Bill No and Date Section */}
                <div className="flex border-b-2 border-black">
                    <div className="w-1/2 border-r-2 border-black p-2 pl-4">
                        <div className="font-bold text-[13px]">Bill No: {data.details.invoiceNo}</div>
                    </div>
                    <div className="w-1/2 p-2 pr-4 text-right border-l-2 border-black">
                        <div className="font-bold text-[13px]">Date: {data.details.date}</div>
                    </div>
                </div>

                {/* Customer & Invoice Details */}
                <div className="flex border-b-2 border-black">
                    <div className="w-[55%] border-r-2 border-black p-3 pl-4">
                        <div className="font-bold text-[13px] mb-1">To. {data.receiver.name}</div>
                        <div className="pl-6 whitespace-pre-line leading-tight uppercase text-[12px]">
                            {data.receiver.address}
                        </div>
                        <div className="pl-6 mt-2 text-[12px]">
                            GSTIN : {data.receiver.gstin}
                        </div>
                    </div>
                    <div className="w-[45%] p-3">
                        <div className="grid grid-cols-[110px_1fr] gap-y-1 text-[11px]">
                            <div className="font-bold">P.O. NO & Date</div>
                            <div className="font-bold">: {data.details.poNumber || ''} {data.details.poDate ? `(${data.details.poDate})` : ''}</div>
                            <div className="font-bold">Despatched Through</div>
                            <div className="font-bold whitespace-nowrap">: {data.details.despatchedThrough || ''}</div>
                            <div className="font-bold">L.R.No & Date</div>
                            <div className="font-bold">: {data.details.lrNumber || ''} {data.details.lrDate ? `(${data.details.lrDate})` : ''}</div>

                            <div className="font-bold">D.C.No & Dt</div>
                            <div className="font-bold">: {data.details.dcNumber || ''} {data.details.dcDate ? `(${data.details.dcDate})` : ''}</div>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                {/* Items Table - Converted to Flexbox for perfect alignment with filler */}
                <div className="flex-grow flex flex-col">
                    {/* Header */}
                    <div className="flex border-b-2 border-black text-center font-bold text-[11px] h-10 shrink-0">
                        <div className="border-r-2 border-black w-10 py-1 flex items-center justify-center">S.No</div>
                        <div className="border-r-2 border-black flex-grow py-1 flex items-center justify-center">Description</div>
                        <div className="border-r-2 border-black w-16 py-1 flex items-center justify-center leading-tight">HSN<br />Code</div>
                        <div className="border-r-2 border-black w-16 py-1 flex items-center justify-center">Qty</div>
                        <div className="border-r-2 border-black w-20 py-1 flex items-center justify-center">Rate</div>
                        <div className="border-r-2 border-black w-24 py-1 flex items-center justify-center">Amount</div>
                        <div className="border-r-2 border-black w-12 py-1 flex items-center justify-center leading-tight">Tax<br />%</div>
                        <div className="w-24 py-1 flex items-center justify-center leading-tight">Total<br />Amount</div>
                    </div>

                    {/* Items */}
                    {data.items.map((item, index) => {
                        const amount = calculateItemAmount(item);
                        const taxAmt = amount * (item.taxRate / 100);
                        const total = amount + taxAmt;
                        return (
                            <div key={item.id} className="flex text-[11px] leading-none shrink-0">
                                <div className="border-r-2 border-black w-10 text-center pt-2 pb-1">{index + 1}</div>
                                <div className="border-r-2 border-black flex-grow text-left px-3 pt-2 pb-1 uppercase">{item.description}</div>
                                <div className="border-r-2 border-black w-16 text-center pt-2 pb-1">{item.hsnCode}</div>
                                <div className="border-r-2 border-black w-16 text-right px-2 pt-2 pb-1 whitespace-nowrap">{item.qty} {item.unit}</div>
                                <div className="border-r-2 border-black w-20 text-right px-2 pt-2 pb-1">{item.rate.toFixed(2)}</div>
                                <div className="border-r-2 border-black w-24 text-right px-2 pt-2 pb-1">{amount.toFixed(2)}</div>
                                <div className="border-r-2 border-black w-12 text-center pt-2 pb-1">{item.taxRate}</div>
                                <div className="w-24 text-right px-2 pt-2 pb-1">{total.toFixed(2)}</div>
                            </div>
                        );
                    })}

                    {/* Filler Div to extend vertical lines to the bottom */}
                    <div className="flex-grow flex relative">
                        {/* Vehicle Number Display inside filler - Description Col */}
                        {data.details.vehicleNumber && (
                            <div className="absolute bottom-2 left-[50px] font-bold text-[11px] uppercase">
                                Vehicle No : {data.details.vehicleNumber}
                            </div>
                        )}
                        <div className="w-10 border-r-2 border-black"></div>
                        <div className="flex-grow border-r-2 border-black"></div>
                        <div className="w-16 border-r-2 border-black"></div>
                        <div className="w-16 border-r-2 border-black"></div>
                        <div className="w-20 border-r-2 border-black"></div>
                        <div className="w-24 border-r-2 border-black"></div>
                        <div className="w-12 border-r-2 border-black"></div>
                        <div className="w-24"></div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="border-t-2 border-black">
                    {/* Totals Row */}
                    <div className="flex border-b-2 border-black font-bold text-[13px] h-8 items-center bg-gray-50 print:bg-transparent">
                        <div className="flex-grow text-right pr-4">Total</div>
                        <div className="w-[300px] flex"> {/* Adjust width to match columns approximately */}
                            <div className="w-[110px] text-center pl-8">{totalQty.toFixed(3)}</div>
                            <div className="flex-grow text-right pr-14">{subTotal.toFixed(2)}</div>
                            <div className="w-[100px] text-right pr-2">{totalAmount.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="border-b-2 border-black text-[11px]">
                        <div className="flex border-b border-black font-bold py-1">
                            <div className="w-28 pl-4">Taxable Value</div>
                            {isLocal ? (
                                <>
                                    <div className="w-16 text-center">CGST%</div>
                                    <div className="w-24 text-right">AMT</div>
                                    <div className="w-16 text-center">SGST%</div>
                                    <div className="w-24 text-right">AMT</div>
                                </>
                            ) : (
                                <>
                                    <div className="w-32 text-center">IGST%</div>
                                    <div className="w-48 text-right">Amount</div>
                                </>
                            )}
                            <div className="w-16 text-center">NET%</div>
                            <div className="w-24 text-right pr-4">AMT</div>
                        </div>
                        {/* Summary Line */}
                        <div className="flex h-6 items-center">
                            <div className="w-28 pl-4 font-medium">{subTotal.toFixed(2)}</div>
                            {isLocal ? (
                                <>
                                    <div className="w-16 text-center">9.00</div>
                                    <div className="w-24 text-right">{cgst.toFixed(2)}</div>
                                    <div className="w-16 text-center">9.00</div>
                                    <div className="w-24 text-right">{sgst.toFixed(2)}</div>
                                </>
                            ) : (
                                <>
                                    <div className="w-32 text-center">18.00</div>
                                    <div className="w-48 text-right">{igst.toFixed(2)}</div>
                                </>
                            )}
                            <div className="w-16 text-center">18.00</div>
                            <div className="w-24 text-right pr-4">{totalTax.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Final Amounts & Words */}
                    <div className="flex border-b-2 border-black">
                        <div className="flex-grow p-2 pl-4 border-r-2 border-black flex flex-col justify-between">
                            <div className="font-bold text-[12px]">E. & O.E.</div>
                            <div className="font-medium italic text-[14px] mt-2">
                                Rupees {numberToWords(finalAmount)} Only
                            </div>

                        </div>
                        <div className="w-72">
                            <div className="flex justify-between px-3 py-2 text-[13px] font-medium">
                                <span>Rounded Off :</span>
                                <span>{roundOff.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between px-3 py-2 font-bold text-xl border-t-2 border-black bg-gray-100 print:bg-transparent items-center h-12">
                                <span>Net Amount :</span>
                                <span>{finalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Signatory */}
                    <div className="h-32 flex justify-between items-end p-4">
                        <div></div>
                        <div className="text-center w-72">
                            <div className="font-bold text-sm mb-12">For {data.sender.name}</div>
                            <div className="text-[12px] font-medium border-t-2 border-black inline-block px-8 pt-1">
                                Authorised Signatory
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
