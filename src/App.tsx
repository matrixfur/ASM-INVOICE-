import { useState } from 'react';
import type { InvoiceData } from './types';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceHistory } from './components/InvoiceHistory';
import { WelcomePage } from './components/WelcomePage';
import {
  Printer, LayoutDashboard, FileText, Settings, LogOut,
  Save, Home, Building2, ChevronRight, Menu, X,
  Eye, PenLine
} from 'lucide-react';
import { useInvoiceStore } from './utils/useInvoiceStore';

export type BusinessProfile = 'interiors' | 'traders';

const BUSINESS_PROFILES: Record<BusinessProfile, { name: string; address: string; gstin: string; phone: string }> = {
  interiors: {
    name: 'ASM INTERIORS',
    address: 'SF NO. 659/2B\nKUNIYAMUTHUR\nCoimbatore - 641 008',
    gstin: '33DWJPA2576P1Z5',
    phone: '7092983982, 7092983986'
  },
  traders: {
    name: 'ASM TRADERS',
    address: 'SF NO 5/68 PODANUR MAIN ROAD\nKURICHI PIRIVU ATHUPALAM\nCoimbatore - 641008',
    gstin: '33BPKPA1462C1ZK',
    phone: ''
  }
};

const makeInitialData = (profile: BusinessProfile): InvoiceData => ({
  sender: { ...BUSINESS_PROFILES[profile] },
  receiver: { name: '', address: '', gstin: '' },
  details: {
    invoiceNo: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    paymentTerms: 'Credit',
    signatory: 'Authorised Signatory',
    poNumber: '', poDate: '', despatchedThrough: '',
    lrNumber: '', lrDate: '', freight: '',
    dcNumber: '', dcDate: ''
  },
  items: []
});

function App() {
  const [activeProfile, setActiveProfile] = useState<BusinessProfile>('interiors');
  const [data, setData] = useState<InvoiceData>(makeInitialData('interiors'));
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [taxType, setTaxType] = useState<'local' | 'igst'>('local');
  const [currentView, setCurrentView] = useState<'welcome' | 'create'>('welcome');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const { saveInvoice } = useInvoiceStore();

  const handleSelectBusiness = (profile: BusinessProfile) => {
    setActiveProfile(profile);
    setData(makeInitialData(profile));
    setCurrentView('welcome');
    setMobileSidebarOpen(false);
  };

  const handleCreateLocal = () => { setTaxType('local'); setCurrentView('create'); setMobileSidebarOpen(false); setMobileTab('form'); };
  const handleCreateIGST  = () => { setTaxType('igst');  setCurrentView('create'); setMobileSidebarOpen(false); setMobileTab('form'); };
  const handleGoHome      = () => { setCurrentView('welcome'); setMobileSidebarOpen(false); };

  const handlePrint = () => {
    const missingFields: string[] = [];
    if (!data.details.invoiceNo)    missingFields.push('Bill No');
    if (!data.details.date)         missingFields.push('Date');
    if (!data.details.vehicleNumber) missingFields.push('Vehicle No');
    if (!data.receiver.name)        missingFields.push('Customer Name (To)');
    if (missingFields.length > 0) {
      alert(`Please fill the following mandatory fields before printing:\n- ${missingFields.join('\n- ')}`);
      return;
    }
    window.print();
  };

  const handleSave = () => { saveInvoice(data); alert('Invoice saved successfully!'); };

  const isTraders = activeProfile === 'traders';
  const profileName = BUSINESS_PROFILES[activeProfile].name;

  // Sidebar content (shared between desktop sidebar and mobile drawer)
  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #ede9fe' }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-md" style={{ background: '#7c3aed25' }} />
            <img src="/app-logo.jpg" alt="Logo" className="w-9 h-9 rounded-xl relative z-10" style={{ border: '2px solid #c4b5fd' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '14px', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ASM INVOICE
            </div>
            <div style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 500 }}>Billing Software</div>
          </div>
        </div>
        {/* Close btn on mobile */}
        <button className="lg:hidden" onClick={() => setMobileSidebarOpen(false)}
          style={{ padding: '6px', borderRadius: '8px', border: '1px solid #ede9fe', background: '#fff', cursor: 'pointer', display: 'flex' }}>
          <X size={18} style={{ color: '#7c3aed' }} />
        </button>
      </div>

      {/* Business Switcher */}
      <div className="px-4 py-4">
        <div className="section-label mb-2 px-1">Business</div>
        <div className="space-y-1.5">
          {(['interiors', 'traders'] as BusinessProfile[]).map(key => {
            const isActive = activeProfile === key;
            const isTrd = key === 'traders';
            return (
              <button key={key} onClick={() => handleSelectBusiness(key)} className="w-full text-left"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '10px',
                  border: isActive ? `1px solid ${isTrd ? '#6ee7b750' : '#c4b5fd'}` : '1px solid #f5f3ff',
                  background: isActive ? (isTrd ? 'linear-gradient(135deg,#ecfdf5,#d1fae530)' : 'linear-gradient(135deg,#f5f3ff,#ede9fe50)') : '#fafaff',
                  cursor: 'pointer', transition: 'all 0.18s',
                }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '8px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: isActive ? (isTrd ? 'linear-gradient(135deg,#059669,#10b981)' : 'linear-gradient(135deg,#7c3aed,#a855f7)') : '#f5f3ff'
                }}>
                  <Building2 size={14} style={{ color: isActive ? '#fff' : '#a78bfa' }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '12px', fontWeight: 600, color: isActive ? (isTrd ? '#065f46' : '#5b21b6') : '#6b7280', lineHeight: 1.2 }}>
                    {isTrd ? 'ASM Traders' : 'ASM Interiors'}
                  </div>
                  <div style={{ fontSize: '10px', color: isTrd ? '#34d399' : '#a78bfa', lineHeight: 1.3, marginTop: '1px' }}>
                    {isTrd ? 'Athupalam' : 'Kuniyamuthur'}
                  </div>
                </div>
                {isActive && <ChevronRight size={12} style={{ color: isTrd ? '#059669' : '#7c3aed' }} />}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="divider mx-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <button onClick={handleGoHome} className={`nav-item ${currentView === 'welcome' ? 'active' : ''}`}>
          <Home size={16} /> Dashboard
        </button>
        <div className="section-label px-3 pt-4 pb-2">Create Invoice</div>
        <button onClick={handleCreateLocal} className="nav-item"
          style={currentView === 'create' && taxType === 'local' ? { background: 'linear-gradient(135deg,#eff6ff,#dbeafe50)', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 600 } : {}}>
          <FileText size={16} /> Local Invoice
        </button>
        <button onClick={handleCreateIGST} className="nav-item"
          style={currentView === 'create' && taxType === 'igst' ? { background: 'linear-gradient(135deg,#f5f3ff,#ede9fe50)', color: '#6d28d9', border: '1px solid #c4b5fd', fontWeight: 600 } : {}}>
          <FileText size={16} /> IGST Invoice
        </button>
        <div className="pt-3 space-y-0.5">
          <button onClick={() => { setIsHistoryOpen(true); setMobileSidebarOpen(false); }} className="nav-item">
            <LayoutDashboard size={16} /> Saved Bills
          </button>
          <button className="nav-item"><Settings size={16} /> Settings</button>
        </div>
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid #ede9fe' }}>
        <button className="nav-item w-full" style={{ color: '#9ca3af' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen print:bg-white print:text-black print:block" style={{ backgroundColor: '#f3f0ff', color: '#1e1b4b' }}>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden print:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: '#1e1b4b50', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileSidebarOpen(false)} />
          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-72 flex flex-col"
            style={{ backgroundColor: '#ffffff', borderRight: '1px solid #ede9fe', boxShadow: '4px 0 24px #7c3aed20', zIndex: 10 }}>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="w-64 hidden lg:flex flex-col print:hidden flex-shrink-0"
        style={{ backgroundColor: '#ffffff', borderRight: '1px solid #ede9fe', boxShadow: '2px 0 12px #7c3aed08' }}>
        <SidebarContent />
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden print:h-auto print:overflow-visible" style={{ minWidth: 0 }}>

        {currentView === 'welcome' ? (
          <>
            {/* Mobile top bar on welcome */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 print:hidden"
              style={{ background: '#ffffff', borderBottom: '1px solid #ede9fe' }}>
              <button onClick={() => setMobileSidebarOpen(true)}
                style={{ padding: '8px', borderRadius: '10px', border: '1px solid #ede9fe', background: '#f5f3ff', cursor: 'pointer', display: 'flex' }}>
                <Menu size={20} style={{ color: '#7c3aed' }} />
              </button>
              <div style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '16px', background: 'linear-gradient(135deg,#7c3aed,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ASM INVOICE
              </div>
              <div style={{ width: '36px' }} />
            </div>
            <WelcomePage
              onCreateLocal={handleCreateLocal}
              onCreateIGST={handleCreateIGST}
              onViewHistory={() => setIsHistoryOpen(true)}
              onSelectBusiness={handleSelectBusiness}
              activeProfile={activeProfile}
            />
          </>
        ) : (
          <>
            {/* ── HEADER ── */}
            <header className="flex-shrink-0 flex justify-between items-center px-4 lg:px-6 print:hidden"
              style={{ height: '56px', borderBottom: '1px solid #ede9fe', background: '#ffffffee', backdropFilter: 'blur(12px)' }}>
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Hamburger (mobile) */}
                <button className="lg:hidden" onClick={() => setMobileSidebarOpen(true)}
                  style={{ padding: '7px', borderRadius: '10px', border: '1px solid #ede9fe', background: '#f5f3ff', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
                  <Menu size={18} style={{ color: '#7c3aed' }} />
                </button>

                {/* Business pill */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
                  style={{ background: isTraders ? '#ecfdf5' : '#f5f3ff', border: `1px solid ${isTraders ? '#6ee7b750' : '#c4b5fd'}`, color: isTraders ? '#065f46' : '#5b21b6' }}>
                  <Building2 size={12} />
                  <span className="hidden sm:inline">{profileName}</span>
                  <span className="sm:hidden">{isTraders ? 'Traders' : 'Interiors'}</span>
                </div>

                <div className="hidden sm:block" style={{ width: '1px', height: '18px', background: '#ede9fe' }} />

                <h2 className="hidden sm:block" style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280' }}>
                  {taxType === 'local' ? '📄 Local' : '📋 IGST'}
                </h2>

                <button onClick={handleSave} className="btn-success" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <Save size={14} />
                  <span className="hidden sm:inline">Save Bill</span>
                  <span className="sm:hidden">Save</span>
                </button>
              </div>

              <button onClick={handlePrint} className="btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>
                <Printer size={15} />
                <span className="hidden sm:inline">Print / PDF</span>
                <span className="sm:hidden">Print</span>
              </button>
            </header>

            {/* ── MOBILE TABS (Form / Preview) ── */}
            <div className="lg:hidden flex-shrink-0 flex print:hidden"
              style={{ background: '#ffffff', borderBottom: '1px solid #ede9fe' }}>
              <button onClick={() => setMobileTab('form')}
                style={{
                  flex: 1, padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  border: 'none', borderBottom: mobileTab === 'form' ? '2px solid #7c3aed' : '2px solid transparent',
                  background: 'transparent', color: mobileTab === 'form' ? '#7c3aed' : '#9ca3af',
                  transition: 'all 0.18s'
                }}>
                <PenLine size={15} /> Fill Details
              </button>
              <button onClick={() => setMobileTab('preview')}
                style={{
                  flex: 1, padding: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  border: 'none', borderBottom: mobileTab === 'preview' ? '2px solid #7c3aed' : '2px solid transparent',
                  background: 'transparent', color: mobileTab === 'preview' ? '#7c3aed' : '#9ca3af',
                  transition: 'all 0.18s'
                }}>
                <Eye size={15} /> Preview Bill
              </button>
            </div>

            {/* ── CONTENT ── */}
            <div className="flex-1 overflow-auto print:p-0 print:overflow-visible"
              style={{ background: 'linear-gradient(160deg,#f3f0ff 0%,#faf9ff 60%,#f0fdf4 100%)' }}>

              {/* Desktop: side-by-side */}
              <div className="hidden lg:flex gap-5 p-5 print:p-0 print:block">
                {/* Form */}
                <div className="w-1/2 space-y-4 print:hidden pb-10">
                  <div className="card p-1">
                    <InvoiceForm data={data} onChange={setData} />
                  </div>
                </div>
                {/* Preview */}
                <div className="w-1/2 flex justify-center print:w-full print:block">
                  <div className="w-full max-w-[21cm]">
                    <div className="bg-white text-black overflow-hidden print:shadow-none"
                      style={{ borderRadius: '4px', boxShadow: '0 8px 40px #7c3aed20' }}>
                      <InvoicePreview data={data} label="(ORIGINAL)" taxType={taxType} />
                    </div>
                    <div className="hidden print:block print:break-before-page">
                      <InvoicePreview data={data} label="(COPY)" taxType={taxType} />
                    </div>
                    <p className="text-center text-xs mt-3 print:hidden" style={{ color: '#a78bfa' }}>
                      A4 Preview · Scale 100%
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile: tabbed */}
              <div className="lg:hidden print:hidden">
                {mobileTab === 'form' ? (
                  <div className="p-3">
                    <div className="card p-1">
                      <InvoiceForm data={data} onChange={setData} />
                    </div>
                    {/* CTA to switch to preview */}
                    <button onClick={() => setMobileTab('preview')}
                      className="w-full mt-4 btn-primary" style={{ padding: '14px', fontSize: '14px', borderRadius: '12px' }}>
                      <Eye size={17} /> View Invoice Preview
                    </button>
                  </div>
                ) : (
                  <div className="p-3">
                    {/* Scaled preview wrapper */}
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                      <div style={{ transform: 'scale(0.45)', transformOrigin: 'top left', width: '21cm', pointerEvents: 'none' }}>
                        <div className="bg-white text-black" style={{ boxShadow: '0 4px 20px #7c3aed15' }}>
                          <InvoicePreview data={data} label="(ORIGINAL)" taxType={taxType} />
                        </div>
                      </div>
                      {/* spacer to account for scaled height */}
                      <div style={{ height: `calc(${29.7 * 0.45}cm)`, marginTop: `calc(-${29.7 * (1 - 0.45)}cm)`, pointerEvents: 'none' }} />
                    </div>
                    <button onClick={() => setMobileTab('form')}
                      className="w-full mt-3 btn-secondary" style={{ padding: '12px', borderRadius: '12px', fontSize: '13px' }}>
                      <PenLine size={16} /> Back to Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Print copies */}
              <div className="hidden print:block print:break-before-page">
                <InvoicePreview data={data} label="(COPY)" taxType={taxType} />
              </div>
            </div>
          </>
        )}
      </main>

      {/* ── MOBILE BOTTOM NAV ── */}
      {currentView === 'welcome' && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 print:hidden z-40"
          style={{ background: '#ffffff', borderTop: '1px solid #ede9fe', boxShadow: '0 -4px 20px #7c3aed10' }}>
          <div className="flex">
            {[
              { icon: <Home size={20} />, label: 'Home', action: handleGoHome },
              { icon: <FileText size={20} />, label: 'Local', action: handleCreateLocal },
              { icon: <FileText size={20} />, label: 'IGST', action: handleCreateIGST },
              { icon: <LayoutDashboard size={20} />, label: 'Bills', action: () => setIsHistoryOpen(true) },
            ].map((item, i) => (
              <button key={i} onClick={item.action}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '3px', padding: '10px 4px', border: 'none', background: 'transparent',
                  cursor: 'pointer', color: '#7c3aed', fontSize: '10px', fontWeight: 600
                }}>
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      <InvoiceHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoad={setData}
      />
    </div>
  );
}

export default App;
