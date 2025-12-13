import React from 'react';
import { FileText, LayoutDashboard, Plus } from 'lucide-react';

interface WelcomePageProps {
    onCreateLocal: () => void;
    onCreateIGST: () => void;
    onViewHistory: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onCreateLocal, onCreateIGST, onViewHistory }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-slate-100 h-full">
            <div className="max-w-2xl w-full text-center space-y-8">

                {/* Logo and Branding - Large with Animation */}
                <div className="flex flex-col items-center gap-6 animate-fade-in-down">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                        <img
                            src="/app-logo.jpg"
                            alt="ASM Invoice Logo"
                            className="w-32 h-32 rounded-full shadow-2xl relative z-10 border-4 border-slate-800"
                        />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                            ASM INTERIORS
                        </h1>
                        <p className="text-slate-400 text-lg">Professional Invoicing Solution</p>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-12 animate-fade-in-up">

                    {/* Create Local Invoice Card */}
                    <button
                        onClick={onCreateLocal}
                        className="group relative p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-xl transition-all duration-300 text-left"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText size={64} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200">Local Invoice</h3>
                        </div>
                        <p className="text-slate-400 text-sm">Create a new invoice with CGST & SGST taxes for local customers.</p>
                    </button>

                    {/* Create IGST Invoice Card */}
                    <button
                        onClick={onCreateIGST}
                        className="group relative p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all duration-300 text-left"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText size={64} />
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-200">IGST Invoice</h3>
                        </div>
                        <p className="text-slate-400 text-sm">Create a new invoice with IGST tax for inter-state customers.</p>
                    </button>

                </div>

                {/* Secondary Actions */}
                <div className="mt-8 animate-fade-in-up delay-100">
                    <button
                        onClick={onViewHistory}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50"
                    >
                        <LayoutDashboard size={18} />
                        <span>View Saved Bills History</span>
                    </button>
                </div>

            </div>
        </div>
    );
};
