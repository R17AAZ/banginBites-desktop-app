import React, { useEffect, useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, MapPin, CreditCard, Banknote, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleCart, updateQuantity, removeItem, clearCart } from '../../store/slices/cartSlice';
import { Button } from '../ui/Button';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/api';
import { Input } from '../ui/Input';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, isOpen } = useAppSelector((state) => state.cart);
  const [isLoading, setIsLoading] = React.useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await UserService.getProfile();
      if (res.success) {
        setUserProfile(res.data);
        if (res.data.address) {
          setEditedAddress({
            street: res.data.address.street || '',
            city: res.data.address.city || '',
            state: res.data.address.state || '',
            zipCode: res.data.address.zipCode || ''
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveAddress = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Package address data into 'data' field as a JSON string
      const updateData = {
        address: {
          street: editedAddress.street,
          city: editedAddress.city,
          state: editedAddress.state,
          zipCode: editedAddress.zipCode,
          country: userProfile?.address?.country || 'UK'
        }
      };
      
      formData.append('data', JSON.stringify(updateData));
      
      const res = await UserService.updateProfile(formData);
      if (res.success) {
        toast.success('Address updated successfully');
        setUserProfile(res.data);
        setIsEditingAddress(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    if (!userProfile?.address?.street) {
      toast.error('Please set your delivery address in profile first');
      navigate('/settings/profile');
      dispatch(toggleCart());
      return;
    }

    try {
      setIsLoading(true);
      
      const sellerId = (items[0] as any).sellerId || (items[0] as any).kitchenId;
      const address = `${userProfile.address.street}, ${userProfile.address.city}, ${userProfile.address.state} ${userProfile.address.zipCode}`;

      const payload = {
        sellerId,
        items: items.map(item => ({
          dishId: item.id.toString(),
          quantity: item.quantity
        })),
        deliveryAddress: address,
        deliveryOption: 'DELIVERY' as const,
        paymentMethod: paymentMethod,
        platform: 'DESKTOP'
      };

      const res = await OrderService.createOrder(payload);
      
      if (res.success) {
        if (paymentMethod === 'ONLINE' && res.data.checkoutUrl) {
          // Redirect to Stripe Checkout
          window.location.href = res.data.checkoutUrl;
        } else {
          toast.success('Order placed successfully!');
          dispatch(clearCart());
          dispatch(toggleCart());
          navigate('/buyer/orders');
        }
      }
    } catch (error: any) {
      console.error('Checkout failed', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleCart())}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-brand" size={24} />
              <h2 className="text-xl font-bold font-heading text-neutral-900">Your Cart</h2>
              <span className="bg-brand-100 text-brand text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </div>
            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm">
                  <MapPin size={16} className="text-brand" />
                  <span>Delivery Address</span>
                </div>
                {!isEditingAddress && (
                  <button 
                    onClick={() => setIsEditingAddress(true)}
                    className="text-brand text-xs font-bold hover:underline"
                  >
                    Change
                  </button>
                )}
              </div>
              {loadingProfile ? (
                 <div className="flex items-center gap-2 text-neutral-400 text-xs">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Loading saved address...</span>
                 </div>
              ) : isEditingAddress ? (
                <div className="space-y-3 mt-3">
                  <Input
                    placeholder="Street Address"
                    value={editedAddress.street}
                    onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="City"
                      value={editedAddress.city}
                      onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                      className="h-9 text-xs"
                    />
                    <Input
                      placeholder="Line Address"
                      value={editedAddress.state}
                      onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                  <Input
                    placeholder="Zip Code"
                    value={editedAddress.zipCode}
                    onChange={(e) => setEditedAddress({ ...editedAddress, zipCode: e.target.value })}
                    className="h-9 text-xs"
                  />
                  <div className="flex gap-2 pt-1">
                    <Button 
                      size="sm" 
                      onClick={handleSaveAddress} 
                      isLoading={isLoading}
                      className="h-8 text-[10px] font-bold px-4"
                    >
                      Save Address
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditingAddress(false);
                        if (userProfile?.address) {
                          setEditedAddress({
                            street: userProfile.address.street,
                            city: userProfile.address.city,
                            state: userProfile.address.state,
                            zipCode: userProfile.address.zipCode
                          });
                        }
                      }}
                      className="h-8 text-[10px] font-bold px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : userProfile?.address?.street ? (
                <p className="text-neutral-600 text-xs leading-relaxed">
                  {userProfile.address.street}, {userProfile.address.city}, {userProfile.address.state} {userProfile.address.zipCode}
                </p>
              ) : (
                <p className="text-red-500 text-xs italic">
                  No delivery address found. Please add one.
                </p>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'COD' 
                    ? 'border-brand bg-brand/5 text-brand' 
                    : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200'
                  }`}
                >
                  <Banknote size={24} />
                  <span className="text-xs font-bold">Cash on Delivery</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    paymentMethod === 'ONLINE' 
                    ? 'border-brand bg-brand/5 text-brand' 
                    : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200'
                  }`}
                >
                  <CreditCard size={24} />
                  <span className="text-xs font-bold">Pay Online</span>
                </button>
              </div>
            </div>

            <div className="h-px bg-neutral-100 my-2" />

            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-10">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300">
                  <ShoppingBag size={40} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">Your cart is empty</h3>
                  <p className="text-neutral-500 text-sm mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <Button variant="secondary" onClick={() => dispatch(toggleCart())}>Start Shopping</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-neutral-900">Order Summary</h3>
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="font-bold text-neutral-900 text-sm leading-tight">{item.name}</h4>
                          <button
                            onClick={() => dispatch(removeItem(item.id))}
                            className="text-neutral-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-neutral-100 rounded-lg p-1 bg-white">
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                            className="p-1 hover:bg-neutral-50 rounded transition-colors text-neutral-500"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-neutral-700">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            className="p-1 hover:bg-neutral-50 rounded transition-colors text-neutral-500"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-bold text-neutral-900 text-sm">£{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-8 bg-neutral-50 border-t border-neutral-100 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-500 text-sm">
                <span>Subtotal</span>
                <span>£{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-sm">
                <span>Delivery Fee</span>
                <span>£2.50</span>
              </div>
              <div className="flex justify-between text-neutral-900 font-bold text-lg pt-3 border-t border-dashed border-neutral-200">
                <span>Total Amount</span>
                <span>£{(totalAmount + 2.5).toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full h-12 text-lg font-bold rounded-xl" 
              disabled={items.length === 0 || isLoading || loadingProfile || !userProfile?.address?.street}
              isLoading={isLoading}
              onClick={handleCheckout}
            >
              Checkout Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
