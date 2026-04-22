import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  MapPin, 
  RefreshCcw,
  AlertCircle,
  History
} from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { OrderService } from '../../services/order.service';
import { IOrder, OrderStatus } from '../../types/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { OrderDetailsModal } from '../../components/orders/OrderDetailsModal';
import { useDialog } from '../../context/DialogContext';

const SellerOrders: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'LIVE' | 'ALL'>('LIVE');
  const dialog = useDialog();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderService.getMyOrders();
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Real-time listener
    const handleSocketUpdate = () => {
      fetchOrders();
    };

    window.addEventListener('socket_notification', handleSocketUpdate);

    // Dynamic refresh as fallback
    const interval = setInterval(fetchOrders, 120000);
    
    return () => {
      window.removeEventListener('socket_notification', handleSocketUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus, deliveryOTP?: string) => {
    try {
      setUpdatingId(orderId);
      await OrderService.updateOrderStatus(orderId, newStatus, deliveryOTP);
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        const updated = orders.find(o => o.id === orderId);
        if (updated) setSelectedOrder({ ...updated, status: newStatus });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return { color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} />, label: 'Pending' };
      case 'CONFIRMED': return { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 size={14} />, label: 'Confirmed' };
      case 'PREPARING': return { color: 'bg-orange-100 text-orange-700', icon: <ChefHat size={14} />, label: 'Preparing' };
      case 'OUT_FOR_DELIVERY': return { color: 'bg-indigo-100 text-indigo-700', icon: <Truck size={14} />, label: 'Out for Delivery' };
      case 'DELIVERED': return { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={14} />, label: 'Delivered' };
      case 'CANCELLED': return { color: 'bg-red-100 text-red-700', icon: <AlertCircle size={14} />, label: 'Cancelled' };
      default: return { color: 'bg-neutral-100 text-neutral-600', icon: null, label: status };
    }
  };

  const filteredOrders = view === 'LIVE' 
    ? orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')
    : orders;

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ChefLoader size={48} variant="sizzle" />
        <p className="text-neutral-500 font-medium font-sans animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">
            {view === 'LIVE' ? 'Live Orders' : 'Order History'}
          </h1>
          <p className="text-neutral-500 font-sans">
            {view === 'LIVE' 
              ? "Track and manage your kitchen's workflow in real-time."
              : "View all your past and present orders."
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setView('LIVE')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'LIVE' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            Live
          </button>
          <button
            onClick={() => setView('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'ALL' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            All Orders
          </button>
          <div className="w-px h-6 bg-neutral-200 mx-1" />
          <Button variant="secondary" size="sm" onClick={fetchOrders}>
            <RefreshCcw size={16} />
          </Button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 bg-neutral-50/50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              {view === 'LIVE' ? <Clock size={32} className="text-neutral-300" /> : <History size={32} className="text-neutral-300" />}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-neutral-900">No {view === 'LIVE' ? 'active' : ''} orders found</h3>
              <p className="text-neutral-500 max-w-sm">When customers place orders, they will appear here for you to manage.</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const statusCfg = getStatusConfig(order.status);
            const isUpdating = updatingId === order.id;
            
            return (
              <Card key={order.id} className="flex flex-col border-neutral-100 hover:shadow-md transition-shadow group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-neutral-400 font-mono tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis block max-w-[100px]">
                      #{order.id.slice(-6)}
                    </span>
                    <CardTitle className="text-lg truncate max-w-[150px]">{order.buyer?.name || 'Guest Customer'}</CardTitle>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusCfg.color}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100/50">
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <p key={idx} className="text-sm font-semibold text-neutral-900 leading-relaxed">
                          {item.quantity}x {item.dish?.name}
                        </p>
                      ))}
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 mt-3 flex items-center gap-1 uppercase tracking-wider">
                      <Clock size={12} /> {formatDistanceToNow(new Date(order.createdAt))} ago
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-neutral-400 mt-0.5 min-w-[16px]" />
                      <span className="line-clamp-2">{order.deliveryAddress || 'Pickup in Kitchen'}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Total</span>
                    <span className="font-bold text-neutral-900">£{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      onClick={() => handleViewDetails(order)}
                    >
                      Details
                    </Button>
                    {order.status === 'PENDING' && (
                      <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')} disabled={isUpdating}>
                        Accept
                      </Button>
                    )}
                    {order.status === 'CONFIRMED' && (
                      <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(order.id, 'PREPARING')} disabled={isUpdating}>
                        Cook
                      </Button>
                    )}
                    {order.status === 'PREPARING' && (
                      <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(order.id, 'OUT_FOR_DELIVERY')} disabled={isUpdating}>
                        Dispatch
                      </Button>
                    )}
                    {order.status === 'OUT_FOR_DELIVERY' && (
                      <Button 
                        variant="primary"
                        size="sm" 
                        onClick={async () => {
                          const code = await dialog.prompt({
                            title: "Please verify the order delivery",
                            message: "Enter Delivery Verification Code (OTP) from Buyer:",
                            inputType: "number",
                            confirmText: "Verify & Deliver"
                          });
                          if (code) {
                            handleUpdateStatus(order.id, 'DELIVERED', code);
                          }
                        }} 
                        disabled={isUpdating}
                      >
                        Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default SellerOrders;
