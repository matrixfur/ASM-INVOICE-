import React from 'react';
import { FileText, LayoutDashboard, Plus, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import type { BusinessProfile } from '../App';

interface WelcomePageProps {
    onCreateLocal: () => void;
    onCreateIGST: () => void;
    onViewHistory: () => void;
    onSelectBusiness: (profile: BusinessProfile) => void;
    activeProfile: BusinessProfile;
}

const BUSINESS_INFO: Record<BusinessProfile, {
    label: string; subtitle: string; gstin: string; isTraders: boolean;
}> = {
    interiors: { label: 'ASM INTERIORS', subtitle: 'Interior Design & Furnishings', gstin: '33DWJPA2576P1Z5', isTraders: false },
    traders:   { label: 'ASM TRADERS',   subtitle: 'Trading & Distribution',        gstin: '33BPKPA1462C1ZK', isTraders: true  },
};

export const WelcomePage: React.FC<WelcomePageProps> = ({
    onCreateLocal, onCreateIGST, onViewHistory, onSelectBusiness, activeProfile
}) => {
    const info = BUSINESS_INFO[activeProfile];

    return (
        <div className="flex-1 flex flex-col items-center p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-h-0 overflow-auto relative"
            style={{ background: 'linear-gradient(160deg,#f3f0ff 0%,#fafaff 55%,#f0fdf9 100%)' }}>

            {/* Decorative blobs — hidden on very small screens to save space */}
            <div className="hidden sm:block" style={{
                position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px',
                borderRadius: '50%', background: 'radial-gradient(circle,#a855f720 0%,transparent 70%)', pointerEvents: 'none'
            }} />
            <div className="hidden sm:block" style={{
                position: 'absolute', bottom: '-40px', right: '-40px', width: '260px', height: '260px',
                borderRadius: '50%', background: 'radial-gradient(circle,#7c3aed15 0%,transparent 70%)', pointerEvents: 'none'
            }} />

            <div className="w-full max-w-2xl text-center space-y-6 relative z-10 pt-2">

                {/* Logo & Branding */}
                <div className="flex flex-col items-center gap-4 animate-fade-in-down">
                    <div className="relative">
                        <div style={{
                            position: 'absolute', inset: '-8px', borderRadius: '50%',
                            background: info.isTraders
                                ? 'conic-gradient(from 0deg,#10b981,#34d399,#6ee7b7,#10b981)'
                                : 'conic-gradient(from 0deg,#7c3aed,#a855f7,#c084fc,#7c3aed)',
                            opacity: 0.25, filter: 'blur(6px)',
                            animation: 'floatPulse 3s ease-in-out infinite'
                        }} />
                        <img src="/app-logo.jpg" alt="ASM Logo" style={{
                            width: '88px', height: '88px', borderRadius: '50%',
                            border: `3px solid ${info.isTraders ? '#6ee7b770' : '#c4b5fd'}`,
                            boxShadow: `0 8px 28px ${info.isTraders ? '#10b98125' : '#7c3aed25'}`,
                            position: 'relative', zIndex: 10, display: 'block'
                        }} />
                    </div>
                    <div className="space-y-1">
                        <h1 style={{
                            fontFamily: 'Outfit,sans-serif', fontSize: 'clamp(28px,6vw,44px)',
                            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
                            background: info.isTraders
                                ? 'linear-gradient(135deg,#059669,#10b981,#34d399)'
                                : 'linear-gradient(135deg,#5b21b6,#7c3aed,#a855f7)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                            transition: 'all 0.4s ease'
                        }}>{info.label}</h1>
                        <p style={{ color: '#8b5cf6', fontSize: '14px', fontWeight: 500 }}>{info.subtitle}</p>
                        <p style={{ color: '#a78bfa', fontSize: '11px' }}>GSTIN: {info.gstin}</p>
                    </div>
                </div>

                {/* Business Selector */}
                <div className="animate-fade-in-up">
                    <p className="section-label mb-2">Select Business</p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {(Object.entries(BUSINESS_INFO) as [BusinessProfile, typeof BUSINESS_INFO['interiors']][]).map(([key, biz]) => {
                            const isActive = activeProfile === key;
                            return (
                                <button key={key} onClick={() => onSelectBusiness(key)} style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 12px', borderRadius: '12px', textAlign: 'left',
                                    border: isActive ? `1.5px solid ${biz.isTraders ? '#6ee7b760' : '#c4b5fd'}` : '1.5px solid #ede9fe',
                                    background: isActive ? (biz.isTraders ? 'linear-gradient(135deg,#ecfdf5,#d1fae540)' : 'linear-gradient(135deg,#f5f3ff,#ede9fe50)') : '#ffffff',
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                    boxShadow: isActive ? `0 4px 14px ${biz.isTraders ? '#10b98115' : '#7c3aed15'}` : '0 2px 6px #7c3aed06',
                                }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '9px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        background: isActive ? (biz.isTraders ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#7c3aed,#a855f7)') : '#f5f3ff',
                                    }}>
                                        <Building2 size={16} style={{ color: isActive ? '#fff' : '#a78bfa' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: isActive ? (biz.isTraders ? '#065f46' : '#5b21b6') : '#374151', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {biz.label}
                                        </div>
                                        <div className="hidden sm:block" style={{ fontSize: '10px', color: '#9ca3af', marginTop: '1px' }}>{biz.subtitle}</div>
                                    </div>
                                    {isActive && <CheckCircle2 size={14} style={{ color: biz.isTraders ? '#10b981' : '#7c3aed', flexShrink: 0 }} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Invoice Type Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up delay-100">

                    {/* Local Invoice */}
                    <button onClick={onCreateLocal} className="group text-left"
                        style={{ padding: '18px', borderRadius: '16px', border: '1.5px solid #dbeafe', background: 'linear-gradient(135deg,#ffffff,#eff6ff50)', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 10px #3b82f608', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 28px #3b82f620'; el.style.transform = 'translateY(-2px)'; el.style.borderColor = '#93c5fd'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 10px #3b82f608'; el.style.transform = 'translateY(0)'; el.style.borderColor = '#dbeafe'; }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', borderRadius: '16px 16px 0 0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#3b82f6,#60a5fa)', boxShadow: '0 4px 10px #3b82f630', flexShrink: 0 }}>
                                <Plus size={20} style={{ color: '#fff' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1d4ed8', lineHeight: 1.2 }}>Local Invoice</h3>
                                <p style={{ fontSize: '10px', color: '#93c5fd' }}>CGST + SGST</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>Bills with CGST & SGST for local Tamil Nadu customers.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', color: '#3b82f6', fontSize: '12px', fontWeight: 600 }}>
                            Create Now <ArrowRight size={12} />
                        </div>
                    </button>

                    {/* IGST Invoice */}
                    <button onClick={onCreateIGST} className="group text-left"
                        style={{ padding: '18px', borderRadius: '16px', border: '1.5px solid #ede9fe', background: 'linear-gradient(135deg,#ffffff,#f5f3ff50)', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 10px #7c3aed08', position: 'relative', overflow: 'hidden' }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 28px #7c3aed20'; el.style.transform = 'translateY(-2px)'; el.style.borderColor = '#c4b5fd'; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 2px 10px #7c3aed08'; el.style.transform = 'translateY(0)'; el.style.borderColor = '#ede9fe'; }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#7c3aed,#a855f7)', borderRadius: '16px 16px 0 0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 10px #7c3aed30', flexShrink: 0 }}>
                                <Plus size={20} style={{ color: '#fff' }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#5b21b6', lineHeight: 1.2 }}>IGST Invoice</h3>
                                <p style={{ fontSize: '10px', color: '#c4b5fd' }}>Inter-state GST</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>Bills with IGST for customers in other states.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', color: '#7c3aed', fontSize: '12px', fontWeight: 600 }}>
                            Create Now <ArrowRight size={12} />
                        </div>
                    </button>
                </div>

                {/* History link */}
                <div className="animate-fade-in-up delay-200">
                    <button onClick={onViewHistory} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#8b5cf6',
                        padding: '8px 16px', borderRadius: '10px', border: '1px solid #ede9fe',
                        background: '#ffffff', cursor: 'pointer', transition: 'all 0.18s', fontSize: '13px', fontWeight: 500
                    }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f5f3ff'; (e.currentTarget as HTMLElement).style.borderColor = '#c4b5fd'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ffffff'; (e.currentTarget as HTMLElement).style.borderColor = '#ede9fe'; }}>
                        <LayoutDashboard size={15} /> View Saved Bills
                    </button>
                </div>

            </div>
        </div>
    );
};
