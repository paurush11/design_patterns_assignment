import { TTable } from '@/utils/interfaces'
import { create } from 'zustand'

type State = {
    currentTable: TTable | null
    allTables: TTable[]
}

type Actions = {
    setCurrentTable: (table: TTable) => void;
    setAllTables: (tables: TTable[]) => void;
}

const useTableStore = create<State & Actions>((set) => ({
    currentTable: null,
    allTables: [],
    setAllTables: (tables: TTable[]) => set(({ allTables: tables })),
    setCurrentTable: (table: TTable) => set(({ currentTable: table }))

}))

export {
    useTableStore
}