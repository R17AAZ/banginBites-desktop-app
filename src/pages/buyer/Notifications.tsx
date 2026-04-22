import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Bell, Clock, ShoppingBag, Info, CheckCircle2, RefreshCcw } from 'lucide-react';
import { ChefLoader } from '../../components/ui/LoadingSpinner';
import { NotificationService } from '../../services/notification.service';
import { INotification } from '../../types/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const BuyerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await NotificationService.getNotifications();
      if (res.success) {
        // Handle both standardized array response and old wrapped response
        const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data;
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.error('Unexpected notifications data structure:', res.data);
          setNotifications([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Real-time listener
    const handleSocketUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('socket_notification', handleSocketUpdate);

    return () => {
      window.removeEventListener('socket_notification', handleSocketUpdate);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await NotificationService.markAllAsRead();
      if (res.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Failed to mark all as read', error);
      toast.error('Failed to mark all as read');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ChefLoader size={48} variant="flit" />
        <p className="text-neutral-500 font-medium font-sans animate-pulse">Syncing updates...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">Notifications</h1>
          <p className="text-neutral-500 font-sans">Stay updated with your orders and platform news.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={fetchNotifications} size="sm" className="text-neutral-500">
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
            className="text-brand font-bold"
          >
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="border-dashed border-2 border-neutral-200 bg-neutral-50">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-4">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1">No notifications yet</h3>
              <p className="text-neutral-500 max-w-xs">We'll notify you when something important happens.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((n) => (
            <Card 
              key={n.id} 
              onMouseEnter={() => !n.isRead && handleMarkAsRead(n.id)}
              className={`border-neutral-100 transition-all duration-300 ${!n.isRead ? 'bg-brand/5 border-brand/20 shadow-sm' : 'bg-white opacity-80'}`}
            >
              <CardContent className="p-5 flex gap-4">
                <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${
                  n.type.includes('ORDER') ? 'bg-green-100 text-green-600' : 
                  n.type.includes('REVIEW') ? 'bg-orange-100 text-brand' : 'bg-blue-100 text-blue-600'
                }`}>
                  {n.type.includes('ORDER') ? <ShoppingBag size={24} /> : 
                   n.type.includes('REVIEW') ? <Bell size={24} /> : <Info size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-bold text-neutral-900 truncate ${!n.isRead ? 'text-brand' : ''}`}>{n.title || 'System Notification'}</h4>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase shrink-0 flex items-center gap-1">
                      <Clock size={10} /> {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">{n.body}</p>
                </div>
                {!n.isRead && (
                  <div className="shrink-0 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BuyerNotifications;
