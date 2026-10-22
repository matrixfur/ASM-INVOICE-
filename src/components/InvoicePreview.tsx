
import React from 'react';
import type { InvoiceData } from '../types';
import {
    calculateItemAmount,
    calculateSubTotal,
    calculateTotalTax,
    calculateTotalAmount,
} from '../utils/calculations';
import { numberToWords } from '../utils/numberToWords';

interface InvoicePreviewProps {
    data: InvoiceData;
    label?: string;
    taxType?: 'local' | 'igst';
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({
    data,
    label = '(ORIGINAL)',
    taxType = 'local',
}) => {
    const subTotal = calculateSubTotal(data.items);
    const totalTax = calculateTotalTax(data.items);
    const totalAmount = calculateTotalAmount(data.items);
    const roundOff = Math.round(totalAmount) - totalAmount;
    const finalAmount = Math.round(totalAmount);

    const isLocal = taxType === 'local';
    const cgst = isLocal ? totalTax / 2 : 0;
    const sgst = isLocal ? totalTax / 2 : 0;
    const igst = !isLocal ? totalTax : 0;
    const totalQty = data.items.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    return (
        <div className="invoice-a4">
            <div className="invoice-a4-inner">
                <div className="invoice-watermark" aria-hidden="true">
                    <img src="/logo.png" alt="" />
                </div>

                <div className="invoice-row invoice-top">
                    <div className="invoice-gstin">
                        GSTIN: {data.sender.gstin}
                    </div>
                    <div className="invoice-top-right">
                        <div className="invoice-copy-label">{label}</div>
                        {data.sender.phone ? (
                            <div className="invoice-phone">
                                {data.sender.phone}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="invoice-title-block">
                    <h1 className="invoice-company">
                        {data.sender.name}
                    </h1>
                    <div className="invoice-address">
                        {data.sender.address}
                    </div>
                    {data.sender.subTitle ? (
                        <div className="invoice-subtitle">
                            {data.sender.subTitle}
                        </div>
                    ) : null}
                    <h2 className="invoice-doc-title">INVOICE</h2>
                </div>

                <div className="invoice-row invoice-meta">
                    <div className="invoice-meta-left">
                        Bill No: {data.details.invoiceNo}
                    </div>
                    <div className="invoice-meta-right">
                        Date: {data.details.date}
                    </div>
                </div>

                <div className="invoice-row invoice-parties">
                    <div className="invoice-to">
                        <div className="invoice-to-name">
                            To. {data.receiver.name}
                        </div>
                        <div className="invoice-to-address">
                            {data.receiver.address}
                        </div>
                        <div className="invoice-to-gstin">
                            GSTIN : {data.receiver.gstin}
                        </div>
                    </div>

                    <div className="invoice-dispatch">
                        <div>
                            <span>P.O. NO &amp; Date</span>
                            <b>
                                : {data.details.poNumber || ''}
                                {data.details.poDate
                                    ? ` (${data.details.poDate})`
                                    : ''}
                            </b>
                        </div>
                        <div>
                            <span>Despatched Through</span>
                            <b>
                                : {data.details.despatchedThrough || ''}
                            </b>
                        </div>
                        <div>
                            <span>L.R.No &amp; Date</span>
                            <b>
                                : {data.details.lrNumber || ''}
                                {data.details.lrDate
                                    ? ` (${data.details.lrDate})`
                                    : ''}
                            </b>
                        </div>
                        <div>
                            <span>D.C.No &amp; Dt</span>
                            <b>
                                : {data.details.dcNumber || ''}
                                {data.details.dcDate
                                    ? ` (${data.details.dcDate})`
                                    : ''}
                            </b>
                        </div>
                    </div>
                </div>

                <div className="invoice-table">
                    <div className="invoice-table-head">
                        <div className="c-sno">S.No</div>
                        <div className="c-desc">Description</div>
                        <div className="c-hsn">HSN<br />Code</div>
                        <div className="c-qty">Qty</div>
                        <div className="c-rate">Rate</div>
                        <div className="c-amt">Amount</div>
                        <div className="c-tax">Tax<br />%</div>
                        <div className="c-total">Total<br />Amount</div>
                    </div>

                    {data.items.map((item, index) => {
                        const amount = calculateItemAmount(item);
                        const taxAmt = amount * (item.taxRate / 100);
                        const total = amount + taxAmt;

                        return (
                            <div
                                key={item.id}
                                className="invoice-table-row"
                            >
                                <div className="c-sno">{index + 1}</div>
                                <div className="c-desc desc-text">
                                    {item.description}
                                </div>
                                <div className="c-hsn">{item.hsnCode}</div>
                                <div className="c-qty qty-text">
                                    {item.qty} {item.unit}
                                </div>
                                <div className="c-rate">
                                    {item.rate.toFixed(2)}
                                </div>
                                <div className="c-amt">
                                    {amount.toFixed(2)}
                                </div>
                                <div className="c-tax">{item.taxRate}</div>
                                <div className="c-total">
                                    {total.toFixed(2)}
                                </div>
                            </div>
                        );
                    })}

                    <div className="invoice-table-fill">
                        <div className="c-sno" />
                        <div className="c-desc" />
                        <div className="c-hsn" />
                        <div className="c-qty" />
                        <div className="c-rate" />
                        <div className="c-amt" />
                        <div className="c-tax" />
                        <div className="c-total" />
                    </div>
                </div>

                <div className="invoice-footer">
                    <div className="invoice-total-row">
                        <div className="invoice-total-label">Total</div>
                        <div className="c-qty">
                            {totalQty.toFixed(3)}
                        </div>
                        <div className="c-rate" />
                        <div className="c-amt">
                            {subTotal.toFixed(2)}
                        </div>
                        <div className="c-tax" />
                        <div className="c-total">
                            {totalAmount.toFixed(2)}
                        </div>
                    </div>

                    <div className="invoice-tax">
                        <div className="invoice-tax-head">
                            <div className="t-val">Taxable Value</div>

                            {isLocal ? (
                                <>
                                    <div className="t-pct">CGST%</div>
                                    <div className="t-amt">AMT</div>
                                    <div className="t-pct">SGST%</div>
                                    <div className="t-amt">AMT</div>
                                </>
                            ) : (
                                <>
                                    <div className="t-pct-wide">IGST%</div>
                                    <div className="t-amt-wide">Amount</div>
                                </>
                            )}

                            <div className="t-pct">NET%</div>
                            <div className="t-amt">AMT</div>
                        </div>

                        <div className="invoice-tax-row">
                            <div className="t-val">
                                {subTotal.toFixed(2)}
                            </div>

                            {isLocal ? (
                                <>
                                    <div className="t-pct">9.00</div>
                                    <div className="t-amt">
                                        {cgst.toFixed(2)}
                                    </div>
                                    <div className="t-pct">9.00</div>
                                    <div className="t-amt">
                                        {sgst.toFixed(2)}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="t-pct-wide">18.00</div>
                                    <div className="t-amt-wide">
                                        {igst.toFixed(2)}
                                    </div>
                                </>
                            )}

                            <div className="t-pct">18.00</div>
                            <div className="t-amt">
                                {totalTax.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="invoice-words-net">
                        <div className="invoice-words">
                            <div className="eoe">E. &amp; O.E.</div>
                            <div className="words">
                                Rupees {numberToWords(finalAmount)} Only
                            </div>
                        </div>

                        <div className="invoice-net">
                            <div className="round-off">
                                <span>Rounded Off :</span>
                                <span>{roundOff.toFixed(2)}</span>
                            </div>
                            <div className="net-amount">
                                <span>Net Amount :</span>
                                <span>{finalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="invoice-sign">
                        <div className="invoice-sign-block">
                            <div className="for-name">
                                For {data.sender.name}
                            </div>
                            <div className="sign-line">
                                Authorised Signatory
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle number at the bottom of the invoice */}
                {data.details.vehicleNumber ? (
                    <div className="invoice-vehicle invoice-vehicle-bottom">
                        Vehicle No : {data.details.vehicleNumber}
                    </div>
                ) : null}
            </div>
        </div>
    );
};
