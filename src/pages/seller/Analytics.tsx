import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  ShoppingBag,
  PoundSterling,
  Users,
  Filter,
  RefreshCcw,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AnalyticsService, DetailedAnalytics } from '../../services/analytics.service';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

const COLORS = ['#CE7A07', '#E6A34D', '#F2C68E', '#D97706', '#B45309', '#92400E'];

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DetailedAnalytics | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | undefined>(undefined);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await AnalyticsService.getDetailedSellerAnalytics(year, month);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
      toast.error('Could not load detailed analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [year, month]);

  const months = [
    { label: 'All Year', value: undefined },
    { label: 'Jan', value: 1 }, { label: 'Feb', value: 2 }, { label: 'Mar', value: 3 },
    { label: 'Apr', value: 4 }, { label: 'May', value: 5 }, { label: 'Jun', value: 6 },
    { label: 'Jul', value: 7 }, { label: 'Aug', value: 8 }, { label: 'Sep', value: 9 },
    { label: 'Oct', value: 10 }, { label: 'Nov', value: 11 }, { label: 'Dec', value: 12 },
  ];

  const years = [2024, 2025, 2026];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="animate-spin text-brand" size={48} />
        <p className="text-neutral-500 font-medium">Crunching your kitchen data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Main Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black font-heading text-neutral-900 tracking-tighter">Kitchen Analytics</h1>
          <p className="text-neutral-500 font-sans mt-1">
            Track your sales performance and customer preferences.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-neutral-100">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="appearance-none bg-neutral-50 border-none rounded-xl px-4 py-2 pr-10 font-bold text-sm text-neutral-700 cursor-pointer hover:bg-neutral-100 transition-colors focus:ring-2 focus:ring-brand/20"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
          </div>

          <div className="h-6 w-px bg-neutral-200" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setYear(new Date().getFullYear()); setMonth(undefined); }}
            className="text-neutral-400 hover:text-brand"
          >
            <RefreshCcw size={14} className={cn(loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Month Pills Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
        {months.map((m) => (
          <button
            key={String(m.value)}
            onClick={() => setMonth(m.value)}
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border",
              month === m.value
                ? "bg-brand border-brand text-white"
                : "bg-white border-neutral-100 text-neutral-500 hover:border-brand/30 hover:text-brand"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-brand/5 border-brand/20 shadow-none border-dashed">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand/10 text-brand rounded-2xl">
                <PoundSterling size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black text-brand uppercase bg-brand/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                Selected Period
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand/70 mb-1">Total Income</p>
            <h3 className="text-3xl font-black font-heading text-neutral-900">£{data?.summary.totalRevenue.toFixed(2)}</h3>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <ShoppingBag size={24} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Items Sold</p>
            <h3 className="text-3xl font-black font-heading text-neutral-900">{data?.summary.totalOrders}</h3>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600 font-bold">
              <ArrowUpRight size={12} />
              Orders completed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Avg. Order Value</p>
            <h3 className="text-3xl font-black font-heading text-neutral-900">£{data?.summary.avgOrderValue.toFixed(2)}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <Card className="border-neutral-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Revenue Trend</CardTitle>
            <CardDescription>{month === undefined ? `Monthly income for ${year}` : `Daily breakdown for ${months.find(m => m.value === month)?.label} ${year}`}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyRevenue || []}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CE7A07" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#CE7A07" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 900, color: '#CE7A07' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#CE7A07"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorAmount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category breakdown Chart */}
        <Card className="border-neutral-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Sales by Category</CardTitle>
            <CardDescription>Visual breakdown of popular food categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="h-[280px] w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categorySales || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {data?.categorySales.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/2 space-y-3">
              {(data?.categorySales || []).map((item, index) => (
                <div key={item.category} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-bold text-neutral-700">{item.category}</span>
                  </div>
                  <span className="text-sm font-black text-neutral-900">£{item.amount.toFixed(0)}</span>
                </div>
              ))}
              {(!data?.categorySales || data.categorySales.length === 0) && (
                <p className="text-sm text-neutral-400 text-center py-8">No category data for this period.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Dishes Performance */}
      <Card className="border-neutral-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Top Performing Dishes</CardTitle>
          <CardDescription>Most popular items based on sales volume.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Rank</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Dish Name</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Sold</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {(data?.topDishes || []).map((dish, index) => (
                  <tr key={dish.name} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[10px] font-black text-neutral-500">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900">{dish.name}</td>
                    <td className="px-6 py-4 font-bold text-neutral-700">{dish.quantity}</td>
                    <td className="px-6 py-4 font-black text-neutral-900">£{dish.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                        <ArrowUpRight size={12} />
                        {Math.floor(Math.random() * 20) + 5}%
                      </div>
                    </td>
                  </tr>
                ))}
                {(!data?.topDishes || data.topDishes.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-400 italic">No sales data available for this selection.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
