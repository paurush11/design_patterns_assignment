import { OrderItem } from '@/utils/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'


type State = {
    orderDishes: (OrderItem)[];
}

type Actions = {
    addSelectedDishQuantityToOrder: (order: OrderItem) => void
    addSelectedDishToOrder: (order: OrderItem) => void
    removeSelectedDishQuantityToOrder: (order: OrderItem) => void
    removeSelectedDishToOrder: (dishId: OrderItem) => void
}

const useOrderStore = create(persist<State & Actions>((set, get) => ({
    orderDishes: [],
    addSelectedDishToOrder: (order) => {
        let myOrders = get().orderDishes;
        set({
            orderDishes: [...myOrders, order],
        });
    },

    removeSelectedDishToOrder: (order) => {
        let myOrders = get().orderDishes.filter(existingOrder => existingOrder.dish.id !== order.dish.id);
        set({
            orderDishes: myOrders
        });
    },

    addSelectedDishQuantityToOrder: (order) => {
        const myOrders = get().orderDishes;
        const index = myOrders.findIndex(existingOrder => existingOrder.dish.id === order.dish.id);

        if (index !== -1) {
            myOrders[index].quant = order.quant;
            set({
                orderDishes: [...myOrders]
            });
        } else {
            set({
                orderDishes: [...myOrders, order]
            });
        }
    },

    removeSelectedDishQuantityToOrder: (order) => {
        const myOrders = get().orderDishes;
        const index = myOrders.findIndex(existingOrder => existingOrder.dish.id === order.dish.id);
        if (index !== -1 && myOrders[index].quant > order.quant) {
            // Update the price by reducing the cost of the removed quantity
            // Decrease the quantity
            myOrders[index].quant -= order.quant;
            set({
                orderDishes: myOrders,
            });
        }
    },

}), {
    name: 'order-store', // unique name for localStorage key, required by persist middleware
    getStorage: () => localStorage,
}));


export {
    useOrderStore
}