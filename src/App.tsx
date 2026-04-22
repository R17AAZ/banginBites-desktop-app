import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onOpenUrl } from '@tauri-apps/plugin-deep-link';
import Login from './pages/Login';
import AppLayout from './components/layout/AppLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRevenue from './pages/admin/Revenue';
import AdminCategories from './pages/admin/Categories';
import SellerDashboard from './pages/seller/Dashboard';
import SellerAnalytics from './pages/seller/Analytics';
import SellerDishes from './pages/seller/Dishes';
import SellerOrders from './pages/seller/Orders';
import BuyerDashboard from './pages/buyer/Dashboard';
import DishDetails from './pages/buyer/DishDetails';
import KitchenDetails from './pages/buyer/KitchenDetails';
import BuyerOrders from './pages/buyer/Orders';
import BuyerReviews from './pages/buyer/Reviews';
import BuyerNotifications from './pages/buyer/Notifications';
import Favorites from './pages/buyer/Favorites';
import AllKitchens from './pages/buyer/AllKitchens';
import AllDishes from './pages/buyer/AllDishes';

import SellerNotifications from './pages/seller/Notifications';
import Signup from './pages/Signup';
import VerifyAccount from './pages/VerifyAccount';
import ManageReviews from './pages/shared/ManageReviews';

import NotFound from './pages/NotFound';
import Profile from './pages/settings/Profile';

import Privacy from './pages/settings/Privacy';
import Security from './pages/settings/Security';

import ForgotPassword from './pages/ForgotPassword';
import VerifyResetOTP from './pages/VerifyResetOTP';
import ResetPassword from './pages/ResetPassword';

import CartDrawer from './components/cart/CartDrawer';
import FloatingCart from './components/cart/FloatingCart';
import { CustomToaster } from './components/ui/CustomToaster';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { DialogProvider } from './context/DialogContext';
import { useEffect } from 'react';
import { useAppDispatch } from './store/hooks';
import { setFavorites } from './store/slices/favoriteSlice';
import { FavoriteService } from './services/favorite.service';
import { SocketProvider } from './context/SocketContext';

import { ChefLoader } from './components/ui/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle Tauri Deep Links (Stripe Redirection)
    const setupDeepLinks = async () => {
      try {
        const unlisten = await onOpenUrl((urls) => {
          console.log('Incoming Deep Links:', urls);
          for (const url of urls) {
            if (url.includes('order-success')) {
              const urlObj = new URL(url);
              const orderId = urlObj.searchParams.get('orderId');
              navigate(`/buyer/orders?success=true&orderId=${orderId}`);
            } else if (url.includes('order-failed')) {
              navigate('/buyer/orders?failed=true');
            }
          }
        });
        return unlisten;
      } catch (err) {
        console.error('Failed to setup deep links', err);
      }
    };

    if (window.__TAURI_INTERNALS__) {
      const unlistenPromise = setupDeepLinks();
      return () => {
        unlistenPromise.then(unlisten => unlisten && unlisten());
      };
    }
  }, [navigate]);

  useEffect(() => {
    const syncFavorites = async () => {
      if (user?.role === 'BUYER') {
        try {
          const res = await FavoriteService.getMyFavorites();
          if (res.success) {
            const ids = res.data.map((dish: any) => dish.id);
            dispatch(setFavorites(ids));
          }
        } catch (error) {
          console.error('Failed to sync favorites', error);
        }
      }
    };

    syncFavorites();
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-neutral-50 p-6">
        <div className="flex flex-col items-center gap-4">
          <ChefLoader size={64} variant="flit" />
          <p className="text-neutral-500 font-medium animate-pulse">Setting up your kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />} />
        <Route path="/verify" element={<VerifyAccount />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-otp" element={<VerifyResetOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={user?.role === 'ADMIN' ? <AppLayout role="ADMIN" pageTitle="Admin Portal" /> : <Navigate to="/login" replace />}
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="revenue" element={<AdminRevenue />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          {/* Admin using the unified ManageReviews component */}
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="notifications" element={<BuyerNotifications />} />
          <Route path="settings/profile" element={<Profile />} />
          <Route path="settings/privacy" element={<Privacy />} />
          <Route path="settings/security" element={<Security />} />
        </Route>

        {/* Seller Routes */}
        <Route
          path="/seller"
          element={user?.role === 'SELLER' ? <AppLayout role="SELLER" pageTitle="Kitchen Dashboard" /> : <Navigate to="/login" replace />}
        >
          <Route path="dashboard" element={<SellerDashboard />} />
          <Route path="analytics" element={<SellerAnalytics />} />
          <Route path="dishes" element={<SellerDishes />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="settings/profile" element={<Profile />} />
          <Route path="settings/privacy" element={<Privacy />} />
          <Route path="settings/security" element={<Security />} />
        </Route>

        {/* Buyer Routes */}
        <Route
          path="/buyer"
          element={user?.role === 'BUYER' ? <AppLayout role="BUYER" pageTitle="Marketplace" /> : <Navigate to="/login" replace />}
        >
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="dish/:id" element={<DishDetails />} />
          <Route path="kitchen/:id" element={<KitchenDetails />} />
          <Route path="kitchens" element={<AllKitchens />} />
          <Route path="dishes" element={<AllDishes />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="reviews" element={<BuyerReviews />} />
          <Route path="notifications" element={<BuyerNotifications />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="settings/profile" element={<Profile />} />
          <Route path="settings/privacy" element={<Privacy />} />
          <Route path="settings/security" element={<Security />} />
        </Route>


        {/* Common Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CartDrawer />
      <FloatingCart />
      <CustomToaster />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <DialogProvider>
            <SidebarProvider>
              <AppContent />
            </SidebarProvider>
          </DialogProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
