import { SendIndividualDish, SendComboDish, ReceiveDish } from '@/utils/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware'

type State = {
    dishes: (ReceiveDish)[];
    currentDish: ReceiveDish | null;
    selectDishesForCombo: ReceiveDish[]
    selectDishForOrder: ReceiveDish[]
}

type Actions = {
    setDishes: (dishes: (ReceiveDish)[]) => void;
    setCurrentDish: (dish: ReceiveDish) => void;
    addSelectedDishToCombo: (dish: (ReceiveDish)) => void
    addSelectedDishToOrder: (dish: (ReceiveDish)) => void
    removeSelectedDishToCombo: (dish: (ReceiveDish)) => void
    removeSelectedDishToOrder: (dish: (ReceiveDish)) => void
}

const useDishStore = create(persist<State & Actions>((set, get) => ({
    dishes: [],
    selectDishesForCombo: [],
    selectDishForOrder: [],
    currentDish: null,
    setDishes: (dishes) => {
        set({ dishes });
    },
    addSelectedDishToCombo: (dish) => {
        const selectDishesForCombo = get().selectDishesForCombo;
        if (!selectDishesForCombo.some(existingDish => existingDish.id === dish.id)) {
            set({
                selectDishesForCombo: [...selectDishesForCombo, dish]
            });
        }
    },
    addSelectedDishToOrder: (dish) => {
        const selectDishForOrder = get().selectDishForOrder;
        if (!selectDishForOrder.some(existingDish => existingDish.id === dish.id)) {
            set({
                selectDishForOrder: [...selectDishForOrder, dish]
            });
        }
    },
    removeSelectedDishToCombo: (dish) => {
        const selectDishesForCombo = get().selectDishesForCombo.filter(dishObj => dishObj.id !== dish.id);
        set({
            selectDishesForCombo
        });
    },
    removeSelectedDishToOrder: (dish) => {
        const selectDishForOrder = get().selectDishForOrder.filter(dishObj => dishObj.id !== dish.id);
        set({
            selectDishForOrder
        });
    },
    setCurrentDish: (dish) => {
        set({ currentDish: dish });
    }
}), {
    name: 'dish-store', // unique name for localStorage key, required by persist middleware
    getStorage: () => localStorage,
}));

export {
    useDishStore
}