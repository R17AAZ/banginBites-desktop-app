import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  kitchenName?: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  isOpen: boolean;
}

// Helper to load cart from localStorage
const loadCartFromStorage = (): { items: CartItem[]; totalAmount: number } => {
  try {
    const savedCart = localStorage.getItem('bangin_bites_cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from storage', error);
  }
  return { items: [], totalAmount: 0 };
};

// Helper to save cart to localStorage
const saveCartToStorage = (items: CartItem[], totalAmount: number) => {
  try {
    localStorage.setItem('bangin_bites_cart', JSON.stringify({ items, totalAmount }));
  } catch (error) {
    console.error('Failed to save cart to storage', error);
  }
};

const processedInitialState = loadCartFromStorage();

const initialState: CartState = {
  items: processedInitialState.items,
  totalAmount: processedInitialState.totalAmount,
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, 'quantity'> & { quantity?: number }>) {
      const { quantity = 1, ...itemData } = action.payload;
      const existingItem = state.items.find((item) => item.id === itemData.id);

      if (!existingItem) {
        state.items.push({ ...itemData, quantity });
      } else {
        existingItem.quantity += quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      saveCartToStorage(state.items, state.totalAmount);
    },
    removeItem(state, action: PayloadAction<string | number>) {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      saveCartToStorage(state.items, state.totalAmount);
    },
    updateQuantity(state, action: PayloadAction<{ id: string | number; quantity: number }>) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      } else if (item && quantity === 0) {
        state.items = state.items.filter((item) => item.id !== id);
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      saveCartToStorage(state.items, state.totalAmount);
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      saveCartToStorage(state.items, state.totalAmount);
    },
  },
});

export const { addItem, removeItem, updateQuantity, toggleCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
