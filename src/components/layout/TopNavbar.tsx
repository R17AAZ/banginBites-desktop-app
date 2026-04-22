import { ShoppingCart, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleCart } from '../../store/slices/cartSlice';
import { NotificationService } from '../../services/notification.service';
import React from 'react';

interface TopNavbarProps {
  title: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ title }) => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await NotificationService.getNotifications({ limit: 50 });
        if (res.success) {
          const data = Array.isArray(res.data) ? res.data : (res.data as any)?.data;
          if (Array.isArray(data)) {
            const count = data.filter((n: any) => !n.isRead).length;
            setUnreadCount(count);
          }
        }
      } catch (error) {
        console.error('Failed to fetch unread count', error);
      }
    };

    fetchUnreadCount();

    // Real-time listener
    const handleSocketUpdate = () => {
      fetchUnreadCount();
    };

    window.addEventListener('socket_notification', handleSocketUpdate);

    // Refresh count every 2 minutes as fallback
    const interval = setInterval(fetchUnreadCount, 120000);
    
    return () => {
      window.removeEventListener('socket_notification', handleSocketUpdate);
      clearInterval(interval);
    };
  }, []);

  const notificationPath = user?.role === 'ADMIN' 
    ? '/admin/notifications' 
    : user?.role === 'SELLER' 
      ? '/seller/notifications' 
      : '/buyer/notifications';

  return (
    <div className="h-20 bg-white border-b border-neutral-100 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-bold font-heading text-neutral-900">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Link to={notificationPath}>
          <button className="relative p-2.5 text-neutral-500 hover:bg-neutral-50 rounded-xl transition-all group">
            <Bell size={22} className="group-hover:text-brand transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-300">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Link>

        <div className="h-8 w-px bg-neutral-100 mx-2"></div>

        <Link to={`/${user?.role.toLowerCase()}/settings/profile`}>
          <button className="flex items-center gap-3 p-1 rounded-lg hover:bg-neutral-50 transition-colors text-left">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold font-sans text-neutral-900 leading-none">
                {user?.name || 'Guest User'}
              </p>
              <p className="text-xs text-neutral-500 font-sans mt-1 capitalize">
                {user?.role.toLowerCase() || 'Visitor'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-brand">
              <User size={20} />
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TopNavbar;
