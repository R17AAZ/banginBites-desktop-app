import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  PoundSterling,
  ShoppingBag,
  ChevronDown,
  RefreshCcw,
  Loader2,
  Target
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AnalyticsService, AdminRevenue as IAdminRevenue } from '../../services/analytics.service';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const AdminRevenue: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IAdminRevenue | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const res = await AnalyticsService.getAdminDetailedAnalytics(year);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch revenue stats', error);
      toast.error('Could not load revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, [year]);

  const years = [2024, 2025, 2026];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="animate-spin text-brand" size={48} />
        <p className="text-neutral-500 font-medium">Loading platform financials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900 tracking-tighter">Platform Revenue</h1>
          <p className="text-neutral-500 font-sans mt-1">Track GMV, platform fees, and transaction volume.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-neutral-100">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="appearance-none bg-neutral-50 border-none rounded-xl px-4 py-2 pr-10 font-bold text-sm text-neutral-700 cursor-pointer hover:bg-neutral-100 transition-colors shadow-none"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchRevenue}
            className="text-neutral-400 hover:text-brand"
          >
            <RefreshCcw size={14} className={cn(loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col justify-between p-6 bg-neutral-900 text-white rounded-2xl border-none shadow-xl shadow-neutral-900/10 transition-all hover:scale-[1.02]">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-white/10 rounded-2xl">
              <PoundSterling size={24} />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 bg-white/10 px-2 py-1 rounded-full">
              Gross GMV
            </div>
          </div>
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50 mb-1">Total Sales</p>
            <h3 className="text-3xl font-bold font-heading tracking-tighter">£{data?.summary.totalGMV.toFixed(2)}</h3>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all hover:border-brand/20">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-brand/10 text-brand rounded-2xl">
              <Target size={24} />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded-full">
              Revenue
            </div>
          </div>
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Company Fees (8%)</p>
            <h3 className="text-3xl font-bold font-heading text-neutral-900 tracking-tighter">£{data?.summary.totalFees.toFixed(2)}</h3>
          </div>
        </div>

        <div className="flex flex-col justify-between p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm transition-all hover:border-blue-200">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Transaction Count</p>
            <h3 className="text-3xl font-bold font-heading text-neutral-900 tracking-tighter">{data?.summary.totalOrders}</h3>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <Card className="border-neutral-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">GMV vs. Fees Comparison</CardTitle>
            <CardDescription>Visualizing platform performance for {year}.</CardDescription>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-neutral-900"/> GMV</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-brand"/> Fees</div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.revenueTrend || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  tickFormatter={(value) => `£${value}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600, fontSize: '12px' }}
                />
                <Bar dataKey="gmv" fill="#171717" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="fees" fill="#CE7A07" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card className="border-neutral-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Monthly Financial Statement</CardTitle>
          <CardDescription>Audit-ready breakdown of platform fees across all months.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Month</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Sales (GMV)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Platform Fees (8%)</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Net to Sellers</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {(data?.revenueTrend || []).map((row) => (
                  <tr key={row.month} className="hover:bg-neutral-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-semibold text-neutral-900">{row.month}</td>
                    <td className="px-6 py-4 font-bold text-neutral-700">£{row.gmv.toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-brand">£{row.fees.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-500">£{(row.gmv - row.fees).toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-neutral-900">{row.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRevenue;
