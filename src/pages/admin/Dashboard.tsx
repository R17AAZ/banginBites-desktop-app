import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import {
  Users,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  PoundSterling,
  TrendingUp,
  Clock,
  Package
} from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { cn } from '../../lib/utils';
import { AnalyticsService } from '../../services/analytics.service';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface StatBlockProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ComponentType<any>;
  colorClass: string;
}

const StatBlock: React.FC<StatBlockProps> = ({ title, value, change, isPositive, icon: Icon, colorClass }) => (
  <Card className="flex flex-col justify-between border-neutral-100 shadow-sm hover:border-brand/20 transition-all">
    <div className="flex items-start justify-between">
      <div className={cn("p-3 rounded-2xl shadow-sm", colorClass)}>
        <Icon size={24} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest",
        isPositive ? "text-green-600 bg-green-50 px-2 py-1 rounded-full" : "text-red-500 bg-red-50 px-2 py-1 rounded-full"
      )}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold font-heading text-neutral-900 tracking-tighter">{value}</h3>
    </div>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await AnalyticsService.getAdminStats();
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load admin stats', error);
        toast.error('Could not sync dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
        <ChefLoader size={48} variant="sizzle" />
        <p className="text-neutral-500 font-medium font-sans animate-pulse">Syncing system metrics...</p>
      </div>
    );
  }

  // Calculate percentages for category distribution
  const totalDishes = stats?.categoryStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 1;
  const categoryColors = ['bg-brand', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold font-heading text-neutral-900 tracking-tighter">System Overview</h1>
        <p className="text-neutral-500 font-sans">Real-time platform performance and economy monitoring.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBlock
          title="Platform Fees"
          value={`£${stats?.feesCollected?.toFixed(2) || '0.00'}`}
          change="8% Fee"
          isPositive={true}
          icon={PoundSterling}
          colorClass="bg-brand/10 text-brand"
        />
        <StatBlock
          title="Total GMV"
          value={`£${stats?.totalGMV?.toFixed(2) || '0'}`}
          change="+12.5%"
          isPositive={true}
          icon={TrendingUp}
          colorClass="bg-neutral-900 text-white"
        />
        <StatBlock
          title="Total Orders"
          value={stats?.totalOrders || '0'}
          change={`${stats?.pendingOrders || 0} Pending`}
          isPositive={false}
          icon={ShoppingBag}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatBlock
          title="Active Users"
          value={stats?.totalUsers || '0'}
          change="Real-time"
          isPositive={true}
          icon={Users}
          colorClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-neutral-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Global Transactions</CardTitle>
            <CardDescription>Latest orders across all kitchens.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold overflow-hidden border border-neutral-100">
                        {order.user?.profile ? (
                          <img src={order.user.profile} alt="" className="w-full h-full object-cover" />
                        ) : (
                          order.user?.name?.[0] || 'U'
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900">{order.user?.name || 'Guest User'}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Clock size={12} /> {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-neutral-900">£{order.totalAmount.toFixed(2)}</p>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full",
                        order.paymentStatus === 'PAID' ? "text-green-600 bg-green-50" : "text-yellow-600 bg-yellow-50"
                      )}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center">
                  <ShoppingBag size={48} className="mx-auto text-neutral-200 mb-4" />
                  <p className="text-neutral-500 font-medium">No transactions found yet.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Stats */}
        <Card className="border-neutral-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Inventory Health</CardTitle>
            <CardDescription>Platform-wide category volume.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {stats?.categoryStats?.length > 0 ? (
              stats.categoryStats.map((cat: any, index: number) => {
                const percentage = Math.round((cat.count / totalDishes) * 100);
                return (
                  <div key={cat.name} className="space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-widest text-neutral-500">{cat.name}</span>
                      <span className="font-bold text-neutral-900">{cat.count} dishes ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", categoryColors[index % categoryColors.length])}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-neutral-400">
                <Package size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No Categories Defined</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
