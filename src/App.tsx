import { useState } from 'react';
import type { InvoiceData } from './types';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';

import { InvoiceHistory } from './components/InvoiceHistory';
import { WelcomePage } from './components/WelcomePage';
import { Printer, LayoutDashboard, FileText, Settings, LogOut, Save, Home } from 'lucide-react';
import { useInvoiceStore } from './utils/useInvoiceStore';

const INITIAL_DATA: InvoiceData = {
  sender: {
    name: 'ASM INTERIORS',
    address: 'SF NO. 659/2B\nKUNIYAMUTHUR\nCoimbatore - 641 008',
    gstin: '33DWJPA2576P1Z5',
    phone: '7092983982, 7092983986'
  },
  receiver: {
    name: 'ASM TRADERS',
    address: 'SF NO 5/68 PODANUR MAIN ROAD\nATHUPALAYAM\nCoimbatore',
    gstin: ''
  },
  details: {
    invoiceNo: '1117',
    date: '2025-11-11',
    time: '10:00',
    paymentTerms: 'Credit',
    signatory: 'Authorised Signatory'
  },
  items: []
};

function App() {
  const [data, setData] = useState<InvoiceData>(INITIAL_DATA);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [taxType, setTaxType] = useState<'local' | 'igst'>('local');
  const [currentView, setCurrentView] = useState<'welcome' | 'create'>('welcome');
  const { saveInvoice } = useInvoiceStore();

  const handleCreateLocal = () => {
    setTaxType('local');
    setCurrentView('create');
  };

  const handleCreateIGST = () => {
    setTaxType('igst');
    setCurrentView('create');
  };

  const handleGoHome = () => {
    setCurrentView('welcome');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    saveInvoice(data);
    alert('Invoice saved successfully!');
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 print:bg-white print:text-black print:block">
      {/* Sidebar - Hidden on Print */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 hidden lg:flex flex-col print:hidden">
        <div className="p-6 flex items-center gap-3">
          <img src="/app-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">ASM INTERIORS</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {/* Main Invoices Section */}
          <div className="space-y-1">
            <button
              onClick={handleGoHome}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${currentView === 'welcome' ? 'bg-slate-800 text-white border-slate-700' : 'text-slate-400 border-transparent hover:bg-slate-800/50'}`}
            >
              <Home size={20} /> Dashboard
            </button>

            <div className="text-xs font-semibold text-slate-500 uppercase px-4 py-2 mt-4">Create</div>
            <button
              onClick={handleCreateLocal}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${currentView === 'create' && taxType === 'local' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' : 'text-slate-400 border-transparent hover:bg-slate-800/50'}`}
            >
              <FileText size={20} /> Local Invoice
            </button>
            <button
              onClick={handleCreateIGST}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${currentView === 'create' && taxType === 'igst' ? 'bg-purple-600/10 text-purple-400 border-purple-600/20' : 'text-slate-400 border-transparent hover:bg-slate-800/50'}`}
            >
              <FileText size={20} /> IGST Invoice
            </button>
          </div>

          <div className="pt-4">
            <button onClick={() => setIsHistoryOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors"><LayoutDashboard size={20} /> Saved Bills</button>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 rounded-lg transition-colors"><Settings size={20} /> Settings</a>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors"><LogOut size={20} /> Logout</a>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible">
        {currentView === 'welcome' ? (
          <WelcomePage
            onCreateLocal={handleCreateLocal}
            onCreateIGST={handleCreateIGST}
            onViewHistory={() => setIsHistoryOpen(true)}
          />
        ) : (
          <>
            {/* Top Header - Hidden on Print */}
            <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm flex justify-between items-center px-6 print:hidden">
              <div className="flex items-center gap-4">
                <h2 className="font-semibold text-lg">{taxType === 'local' ? 'New Local Invoice' : 'New IGST Invoice'}</h2>
                <button onClick={handleSave} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded transition-colors">
                  <Save size={16} /> Save Bill
                </button>
              </div>
              <button
                onClick={handlePrint}
                className="btn-primary"
              >
                <Printer size={18} />
                Print / Download PDF
              </button>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-6 flex flex-col xl:flex-row gap-6 print:p-0 print:overflow-visible">

              {/* Editor Form */}
              <div className="xl:w-1/2 space-y-6 print:hidden pb-10">
                <div className="card p-1">
                  <InvoiceForm data={data} onChange={setData} />
                </div>
              </div>

              {/* Preview Area */}
              <div className="xl:w-1/2 flex justify-center print:w-full print:block">
                <div className="w-full max-w-[21cm]">
                  {/* Original - Visible on Screen and Print */}
                  <div className="bg-white text-black shadow-2xl rounded-sm overflow-hidden print:shadow-none print:rounded-none">
                    <InvoicePreview data={data} label="(ORIGINAL)" taxType={taxType} />
                  </div>

                  {/* Copy - Hidden on Screen, Visible on Print */}
                  <div className="hidden print:block print:break-before-page">
                    <InvoicePreview data={data} label="(COPY)" taxType={taxType} />
                  </div>

                  <p className="text-center text-slate-500 text-sm mt-4 print:hidden">
                    A4 Preview • Scale 100%
                  </p>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
      <InvoiceHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoad={setData}
      />
    </div>
  );
}

export default App;
