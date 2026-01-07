import React from 'react';
import { TAX_DATA } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, Percent, Building2, Wallet } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const citData = TAX_DATA.map(c => ({
    name: c.country,
    rate: c.cit.standardRate,
    color: '#4f46e5'
  })).sort((a, b) => a.rate - b.rate);

  const vatData = TAX_DATA.map(c => ({
    name: c.country,
    rate: c.salesTax.standardRate,
    color: '#059669'
  })).sort((a, b) => a.rate - b.rate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Lowest CIT Rate</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">9%</h3>
              <p className="text-sm text-slate-600 mt-1">UAE (Mainland)</p>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Lowest VAT Rate</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">5%</h3>
              <p className="text-sm text-slate-600 mt-1">UAE</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Percent className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Avg. Regional CIT</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">22.2%</h3>
              <p className="text-sm text-slate-600 mt-1">Across 7 jurisdictions</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Highest PIT Bracket</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">45%</h3>
              <p className="text-sm text-slate-600 mt-1">China</p>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Wallet className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Corporate Income Tax Rates</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={citData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="rate" name="CIT Rate %" radius={[0, 4, 4, 0]} barSize={20}>
                  {citData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Standard Sales Tax (VAT/GST) Rates</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vatData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="rate" name="VAT Rate %" radius={[0, 4, 4, 0]} barSize={20}>
                   {vatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-900 rounded-xl p-6 text-white flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Need a personalized tax strategy?</h3>
          <p className="text-indigo-200 text-sm max-w-lg">
            Our AI Tax Strategist can analyze your specific business model against these jurisdictions to recommend the optimal structure.
          </p>
        </div>
        <button 
           onClick={() => window.location.hash = '#advisor'}
           className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
        >
          Ask the Advisor
        </button>
      </div>
    </div>
  );
};