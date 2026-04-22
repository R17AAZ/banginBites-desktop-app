import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { INotification } from '../types/api';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: `Bearer ${token}`
      },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('connected to socket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('disconnected from socket');
      setIsConnected(false);
    });

    newSocket.on('notification', (notification: INotification) => {
      // Determine icon based on type and status
      const getIcon = () => {
        const type = notification.type;
        const status = notification.metadata?.status;

        if (type === 'ORDER_PLACED') return '🛍️';
        if (type === 'ORDER_STATUS_UPDATED') {
          switch (status) {
            case 'CONFIRMED': return '✅';
            case 'PREPARING': return '👨‍🍳';
            case 'OUT_FOR_DELIVERY': return '🚚';
            case 'DELIVERED': return '🏷️';
            case 'CANCELLED': return '❌';
            default: return '📦';
          }
        }
        if (type === 'REVIEW_RECEIVED') return '⭐';
        return '🔔';
      };

      // Show real-time toast
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden border border-neutral-100`}>
          <div className="flex-1 w-0 p-5">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand text-2xl">
                    {getIcon()}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-black text-neutral-900 font-heading uppercase tracking-tight">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-neutral-500 font-medium">
                  {notification.body}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-neutral-100">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-xs font-black text-neutral-400 hover:text-rose-500 uppercase tracking-widest focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      ), { duration: 5000 });

      // Custom event for local page refreshes (e.g., Orders page, Notifications page, TopNavbar)
      window.dispatchEvent(new CustomEvent('socket_notification', { detail: notification }));
    });

    newSocket.on('socket_error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
