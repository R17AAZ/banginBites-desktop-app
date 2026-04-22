import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Rating } from '../../components/ui/Rating';
import { Button } from '../../components/ui/Button';
import {
  ShoppingBag,
  PoundSterling,
  Star,
  Clock,
  Plus,
  Package,
  CheckCircle2,
  XCircle,
  ChefHat,
  AlertCircle
} from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { cn } from '../../lib/utils';
import { AnalyticsService, SellerStats } from '../../services/analytics.service';
import { OrderService } from '../../services/order.service';
import { DishService } from '../../services/dish.service';
import { UserService } from '../../services/user.service';
import { IOrder, OrderStatus } from '../../types/api';
import { formatDistanceToNow } from 'date-fns';
import { useDialog } from '../../context/DialogContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [activeOrders, setActiveOrders] = useState<IOrder[]>([]);
  const [pendingOrders, setPendingOrders] = useState<IOrder[]>([]);
  const [totalDishes, setTotalDishes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const dialog = useDialog();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, orderRes, profileRes] = await Promise.all([
        AnalyticsService.getSellerStats(),
        OrderService.getMyOrders(),
        UserService.getProfile()
      ]);

      setStats(statsRes.data);
      setUser(profileRes.data);

      // Filter orders
      const allOrders = orderRes.data;
      setPendingOrders(allOrders.filter(o => o.status === 'PENDING'));
      setActiveOrders(allOrders.filter(o =>
        ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(o.status)
      ));

      // Fetch dishes count
      const dishRes = await DishService.getDishes({ sellerId: profileRes.data.id });
      setTotalDishes(dishRes.meta?.total || dishRes.data.length);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Real-time listener
    const handleSocketUpdate = () => {
      fetchDashboardData();
    };

    window.addEventListener('socket_notification', handleSocketUpdate);

    return () => {
      window.removeEventListener('socket_notification', handleSocketUpdate);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus, deliveryOTP?: string) => {
    try {
      await OrderService.updateOrderStatus(orderId, status, deliveryOTP);
      toast.success(`Order updated to ${status.toLowerCase()}`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order');
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <ChefLoader size={48} variant="sizzle" />
        <p className="text-neutral-500 font-medium">Preparing your kitchen dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">
            Welcome back, {user?.name || 'Chef'}!
          </h1>
          <p className="text-neutral-500 font-sans">
            {pendingOrders.length > 0
              ? `You have ${pendingOrders.length} new orders waiting for approval.`
              : "No new orders right now. Good time to prep!"}
          </p>
        </div>
        <Button onClick={() => navigate('/seller/dishes')}>
          <Plus size={18} className="mr-2" />
          Add New Dish
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-brand/5 border-brand/20 shadow-sm group hover:bg-brand/10 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand/10 text-brand rounded-xl group-hover:scale-110 transition-transform">
                <PoundSterling size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand/70 mb-1">Total Earned</p>
                <h3 className="text-2xl font-black font-heading text-neutral-900 group-hover:text-brand transition-colors">
                  £{stats?.earnings.total.toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-100 shadow-sm group hover:border-brand/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Active Orders</p>
                <h3 className="text-2xl font-black font-heading text-neutral-900">{activeOrders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-100 shadow-sm group hover:border-brand/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand/5 text-brand rounded-xl group-hover:bg-brand/10 transition-colors">
                <Star size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Kitchen Rating</p>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black font-heading text-neutral-900">{(stats?.metrics.rating || 0).toFixed(1)}</h3>
                  <div className="mb-0.5">
                    <Rating rating={stats?.metrics.rating || 0} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-neutral-100 shadow-sm group hover:border-brand/30 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
                <Package size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Total Dishes</p>
                <h3 className="text-2xl font-black font-heading text-neutral-900">{totalDishes}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kitchen Queue */}
        <Card className="lg:col-span-2 shadow-sm border-neutral-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Kitchen Queue</CardTitle>
              <CardDescription>Ongoing orders currently being processed.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full">
                {activeOrders.length} In Progress
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeOrders.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 border-2 border-dashed border-neutral-100 rounded-2xl">
                <ChefHat className="mx-auto mb-2 text-neutral-300" size={40} />
                <p>No active orders in the kitchen.</p>
              </div>
            ) : (
              activeOrders.map((order) => (
                <div key={order.id} className="p-5 border border-neutral-100 rounded-2xl bg-neutral-50/30 hover:bg-white transition-all hover:shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-neutral-400">#{order.id.slice(-6).toUpperCase()}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          order.status === 'PREPARING' ? "bg-orange-50 text-orange-600" :
                            order.status === 'CONFIRMED' ? "bg-yellow-50 text-yellow-600" :
                              "bg-indigo-50 text-indigo-600"
                        )}>
                          {order.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-neutral-900">
                        {order.items?.map(i => `${i.quantity}x ${i.dish?.name}`).join(', ')}
                      </h4>
                    </div>
                    <span className="text-xs text-neutral-400 font-sans">
                      {formatDistanceToNow(new Date(order.createdAt))} ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
                      <Clock size={14} className="text-brand" />
                      {order.status === 'CONFIRMED' ? 'Waiting to start' : 'Estimated completion in 10 mins'}
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'CONFIRMED' && (
                        <Button size="sm" className="bg-brand text-white h-8 text-xs px-4" onClick={() => handleUpdateStatus(order.id, 'PREPARING')}>
                          Start Preparing
                        </Button>
                      )}
                      {order.status === 'PREPARING' && (
                        <Button size="sm" className="bg-indigo-600 text-white h-8 text-xs px-4" onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}>
                          Ready for Delivery
                        </Button>
                      )}
                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <Button
                          size="sm"
                          className="bg-neutral-900 text-white h-8 text-xs px-4"
                          onClick={async () => {
                            const code = await dialog.prompt({
                              title: "Please verify the order delivery",
                              message: "Enter Delivery Verification Code (OTP) from Buyer:",
                              inputType: "number",
                              confirmText: "Verify & Deliver"
                            });

                            if (code) {
                              handleUpdateStatus(order.id, 'DELIVERED', code as string);
                            }
                          }}
                        >
                          <CheckCircle2 size={14} className="mr-1" /> Mark as Delivered
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
          {activeOrders.length > 0 && (
            <CardFooter className="bg-neutral-50/50 p-4 border-t border-neutral-100">
              <Button variant="ghost" className="w-full text-xs text-neutral-500 hover:text-brand" onClick={() => navigate('/seller/orders')}>
                View Full Queue
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* New Order Requests */}
        <Card className="shadow-sm border-neutral-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">New Requests</CardTitle>
              {pendingOrders.length > 0 && (
                <span className="w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {pendingOrders.length}
                </span>
              )}
            </div>
            <CardDescription>Incoming orders waiting for your approval.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
              {pendingOrders.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  <AlertCircle className="mx-auto mb-2 opacity-20" size={32} />
                  <p className="text-sm">No new requests</p>
                </div>
              ) : (
                pendingOrders.map((request) => (
                  <div key={request.id} className="p-5 hover:bg-neutral-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 line-clamp-1">
                          {request.items?.map(i => `${i.quantity}x ${i.dish?.name}`).join(', ')}
                        </h4>
                        <p className="text-xs text-neutral-500 font-sans mt-0.5">
                          £{request.totalAmount.toFixed(2)} • {formatDistanceToNow(new Date(request.createdAt))} ago
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">#{request.id.slice(-4).toUpperCase()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-brand hover:bg-brand/90 text-white h-8 text-xs" onClick={() => handleUpdateStatus(request.id, 'CONFIRMED')}>
                        <CheckCircle2 size={14} className="mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-neutral-200 text-neutral-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 h-8 text-xs" onClick={() => handleUpdateStatus(request.id, 'CANCELLED')}>
                        <XCircle size={14} className="mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="bg-neutral-50/50 p-4 border-t border-neutral-100">
            <Button variant="ghost" className="w-full text-xs text-neutral-500 hover:text-brand" onClick={() => navigate('/seller/orders')}>
              Go to Orders Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
