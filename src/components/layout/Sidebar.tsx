import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart2,
  ShoppingBag,
  Users,
  Package,
  Star,
  Bell,
  LogOut,
  ChevronRight,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  Heart,

  Shield,
  Lock,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

export type Role = 'ADMIN' | 'SELLER' | 'BUYER';

interface SidebarProps {
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const menuItems = {
    ADMIN: [
      { name: 'Overview', icon: Home, path: '/admin/dashboard' },
      { name: 'Revenue', icon: TrendingUp, path: '/admin/revenue' },
      { name: 'Users', icon: Users, path: '/admin/users' },
      { name: 'Categories', icon: Package, path: '/admin/categories' },
      { name: 'Reviews', icon: Star, path: '/admin/reviews' },
      { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
      { name: 'Profile', icon: User, path: `/${role.toLowerCase()}/settings/profile` },
      { name: 'Privacy', icon: Shield, path: `/${role.toLowerCase()}/settings/privacy` },
      { name: 'Security', icon: Lock, path: `/${role.toLowerCase()}/settings/security` },
    ],
    SELLER: [
      { name: 'Dashboard', icon: Home, path: '/seller/dashboard' },
      { name: 'Analytics', icon: BarChart2, path: '/seller/analytics' },
      { name: 'My Dishes', icon: Package, path: '/seller/dishes' },
      { name: 'My Orders', icon: ShoppingBag, path: '/seller/orders' },
      { name: 'Reviews', icon: Star, path: '/seller/reviews' },
      { name: 'Notifications', icon: Bell, path: '/seller/notifications' },
      { name: 'Profile', icon: User, path: `/${role.toLowerCase()}/settings/profile` },
      { name: 'Privacy', icon: Shield, path: `/${role.toLowerCase()}/settings/privacy` },
      { name: 'Security', icon: Lock, path: `/${role.toLowerCase()}/settings/security` },
    ],
    BUYER: [
      { name: 'Explore', icon: ShoppingBag, path: '/buyer/dashboard' },
      { name: 'My Orders', icon: Package, path: '/buyer/orders' },
      { name: 'Bookmarks', icon: Heart, path: '/buyer/favorites' },
      { name: 'Reviews', icon: Star, path: '/buyer/reviews' },
      { name: 'Notifications', icon: Bell, path: '/buyer/notifications' },
      { name: 'Profile', icon: User, path: `/${role.toLowerCase()}/settings/profile` },
      { name: 'Privacy', icon: Shield, path: `/${role.toLowerCase()}/settings/privacy` },
      { name: 'Security', icon: Lock, path: `/${role.toLowerCase()}/settings/security` },
    ],
  };

  const navItems = menuItems[role] || [];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-full bg-white flex flex-col pt-8 relative z-50 shrink-0 border-r border-neutral-100"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 bg-white border border-neutral-200 rounded-full p-1.5 text-neutral-400 hover:text-brand transition-colors z-[60]"
      >
        {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      <div className={cn("px-6 mb-10 overflow-hidden whitespace-nowrap", isCollapsed && "px-0 flex justify-center")}>
        <NavLink to={`/${role.toLowerCase()}/dashboard`} className="block hover:opacity-80 transition-opacity">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <img src="/src/assets/logo.jpg" alt="Bangin' Bites Logo" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                <h1 className="text-2xl font-black font-heading tracking-tighter text-brand">
                  BANGIN' <span className="text-neutral-900">BITES</span>
                </h1>
              </motion.div>
            ) : (
              <motion.div
                key="mini-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-neutral-100 p-1"
              >
                <img src="/src/assets/logo.jpg" alt="B" className="w-full h-full rounded-xl object-cover" />
              </motion.div>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-x-hidden focus:outline-none">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 overflow-hidden whitespace-nowrap",
                isActive
                  ? "bg-brand text-white"
                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
                isCollapsed && "justify-center"
              )
            }
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="shrink-0" />
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium font-sans"
                >
                  {item.name}
                </motion.span>
              )}
            </div>
            {!isCollapsed && (
              <ChevronRight
                size={16}
                className={cn("ml-auto transition-all transform", "group-hover:translate-x-1 opacity-0 group-hover:opacity-100")}
              />
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-neutral-100">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-red-500 hover:bg-red-50 font-medium rounded-xl transition-all overflow-hidden whitespace-nowrap",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
