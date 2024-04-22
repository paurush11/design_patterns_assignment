import { Tstrategy } from "@/utils/interfaces"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type State = {
    strategy: Tstrategy
}

type Actions = {
    setStrategy: (strategy: Tstrategy) => void
}

const useStrategy = create(persist<State & Actions>((set) => ({
    strategy: "regular",
    setStrategy: (strategy: Tstrategy) => set({ strategy: strategy })
}), {
    name: 'pricing-store', // unique name for localStorage key, required by persist middleware
    getStorage: () => localStorage,
}));


export {
    useStrategy
}