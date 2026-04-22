import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleCart } from '../../store/slices/cartSlice';
import { useAuth } from '../../context/AuthContext';

const FloatingCart: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.items);
    const { isOpen: isCartOpen } = useAppSelector((state) => state.cart);

    // Only show for buyers and when the cart is not already open
    if (user?.role !== 'BUYER' || isCartOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 100 }}
                drag
                dragMomentum={false} // Makes it feel more like "placing" it
                whileHover={{ scale: 1.1, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                whileDrag={{ scale: 1.2, boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.5)' }}
                className="fixed bottom-8 right-8 z-[100] cursor-grab"
            >
                <div className="relative">
                    {/* Pulsing Aura */}
                    {cartItems.length > 0 && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-brand rounded-full blur-xl"
                        />
                    )}
                    
                    <button
                        onClick={() => dispatch(toggleCart())}
                        className="relative w-16 h-16 bg-brand text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-shadow border-2 border-white/20 backdrop-blur-sm"
                    >
                        <ShoppingCart size={28} />
                        
                        <AnimatePresence>
                            {cartItems.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-1 -right-1 min-w-[28px] h-7 px-1.5 bg-white text-brand text-xs font-black rounded-full flex items-center justify-center shadow-lg border-2 border-brand"
                                >
                                    {cartItems.length}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FloatingCart;
