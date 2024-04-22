import { Order, OrderResponse } from '@/utils/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'


type State = {
    orders: OrderResponse;

}

type Actions = {
    setOrders: (orders: OrderResponse) => void;
}

const useKitchenStore = create(persist<State & Actions>((set, get) => ({
    orders: {
        PENDING: [],
        PREPARING: [],
        READY: []
    },
    setOrders: (orders: OrderResponse) => set({
        orders: orders
    })
}), {
    name: 'kitchen-store', // unique name for localStorage key, required by persist middleware
    getStorage: () => localStorage,
}));


export {
    useKitchenStore
}