import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type State = {
    isLoggedIn: boolean
    token: string
}

type Actions = {
    loginOrRegister: (token: string) => void
    logout: () => void
}
const useLoginStore = create(persist<State & Actions>((set) => ({
    isLoggedIn: false,
    token: "",
    loginOrRegister: (token: string) => set({ isLoggedIn: true, token }),
    logout: () => set({ isLoggedIn: false, token: "" })
}), {
    name: 'login-store', // unique name for localStorage key, required by persist middleware
    getStorage: () => localStorage, // define storage type, could also be sessionStorage
}));

export {
    useLoginStore
}