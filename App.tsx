import React, { useState } from 'react';
import { ViewState } from './types';
import { Dashboard } from './components/Dashboard';
import { Comparator } from './components/Comparator';
import { Calculator } from './components/Calculator';
import { Advisor } from './components/Advisor';
import { CountryDetail } from './components/CountryDetail';
import { TAX_DATA } from './constants';
import { LayoutDashboard, Scale, Calculator as CalcIcon, Bot, Globe, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const handleCountrySelect = (id: string) => {
    setSelectedCountryId(id);
    setView(ViewState.COUNTRY_DETAIL);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
      case ViewState.COMPARATOR:
        return <Comparator />;
      case ViewState.CALCULATOR:
        return <Calculator />;
      case ViewState.ADVISOR:
        return <Advisor />;
      case ViewState.COUNTRY_DETAIL:
        const country = TAX_DATA.find(c => c.id === selectedCountryId);
        return country ? (
          <CountryDetail data={country} onBack={() => setView(ViewState.DASHBOARD)} />
        ) : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  const NavItem = ({ label, icon: Icon, targetView }: { label: string, icon: any, targetView: ViewState }) => (
    <button
      onClick={() => setView(targetView)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        view === targetView 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Globe className="w-8 h-8 text-indigo-500" />
            <h1 className="text-xl font-bold tracking-tight">TaxStrategist<span className="text-indigo-500">.ai</span></h1>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          <NavItem label="Dashboard" icon={LayoutDashboard} targetView={ViewState.DASHBOARD} />
          <NavItem label="Tax Regime Comparison" icon={Scale} targetView={ViewState.COMPARATOR} />
          <NavItem label="Profit Calculator" icon={CalcIcon} targetView={ViewState.CALCULATOR} />
          <NavItem label="AI Advisor" icon={Bot} targetView={ViewState.ADVISOR} />
          
          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Jurisdictions</h3>
            <div className="space-y-1">
              {TAX_DATA.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleCountrySelect(c.id)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>{c.flag}</span>
                    {c.country}
                  </span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Data updated for Fiscal Year 2024-2025. Does not constitute legal advice.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-4 flex items-center justify-between md:justify-end shadow-sm">
          <div className="md:hidden flex items-center gap-2 text-slate-900">
             <Globe className="w-6 h-6 text-indigo-500" />
             <span className="font-bold">TaxStrategist.ai</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setView(ViewState.ADVISOR)}
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
              >
               <Bot size={16} />
               Ask AI Expert
             </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
      
      {/* Mobile Nav Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-3 z-50">
        <button onClick={() => setView(ViewState.DASHBOARD)} className={`p-2 rounded-lg ${view === ViewState.DASHBOARD ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}><LayoutDashboard size={24} /></button>
        <button onClick={() => setView(ViewState.COMPARATOR)} className={`p-2 rounded-lg ${view === ViewState.COMPARATOR ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}><Scale size={24} /></button>
        <button onClick={() => setView(ViewState.CALCULATOR)} className={`p-2 rounded-lg ${view === ViewState.CALCULATOR ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}><CalcIcon size={24} /></button>
        <button onClick={() => setView(ViewState.ADVISOR)} className={`p-2 rounded-lg ${view === ViewState.ADVISOR ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500'}`}><Bot size={24} /></button>
      </div>
    </div>
  );
};

export default App;