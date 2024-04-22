import { TTable, TcurrentState } from '@/utils/interfaces';
import Link from 'next/link';
import React, { useEffect } from 'react'
import { Button } from './ui/button';
import { useTableStore } from '@/store/tableStore';
import axios from 'axios';
import { FREE_TABLE, OCCUPY_TABLE } from '@/utils/Api';
import { useLoginStore } from '@/store/loginStore';
import { useRouter } from 'next/router';
import { useToast } from './ui/use-toast';




export const TableCard: React.FC<TTable> = ({ tableNumber, capacity, currentState, id }) => {
    const tableStore = useTableStore()
    const loginStore = useLoginStore();
    const router = useRouter();
    const freeTable = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginStore.token}` // Authorization header
            },
            params: {
                "tableNumber": tableNumber
            } // URL parameters
        };
        try {
            const response = await axios.post(FREE_TABLE, {}, config);
            console.log(response)
            if (response.status === 200 && response.data) {
                const table = {
                    tableNumber: response.data.data.tableNumber,
                    id: response.data.data.id,
                    capacity: response.data.data.capacity,
                    currentState: response.data.data.currentState

                } as TTable
                tableStore.setCurrentTable(table);
                currentState = "Available"
                router.reload()
            }

        } catch (E) {
            console.log(E)
        }



    }
    const ReserveTable = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginStore.token}` // Authorization header
            },
            params: {
                "tableNumber": tableNumber
            } // URL parameters
        };
        try {
            const response = await axios.post(OCCUPY_TABLE, {}, config);
            if (response.status === 200 && response.data) {
                const table = {
                    tableNumber: response.data.data.tableNumber,
                    id: response.data.data.id,
                    capacity: response.data.data.capacity,
                    currentState: response.data.data.currentState

                } as TTable
                tableStore.setCurrentTable(table);
                currentState = "Occupied"
                router.reload()
            }

        } catch (E) {
            console.log(E)
        }

    }


    return (
        <div className="p-4 bg-white max-w-sm bg-rounded-lg border shadow-md min-w-96 rounded-2xl">
            <div className="flex  items-center mb-4 gap-2">
                <h5 className="text-xl font-bold leading-none text-gray-900">Table {tableNumber}</h5>
                <h5 className="text-xl font-bold leading-none text-gray-900">Capacity {capacity}</h5>
                <span className={`ml-auto text-sm font-semibold ${currentState === "Occupied" ? 'text-red-500' : 'text-green-500'}`}>
                    {currentState === "Occupied" ? 'Occupied' : 'Available'}
                </span>
            </div>
            <div className="flex space-x-3">
                <Button
                    variant={"coolBlue"}
                    onClick={() => {
                        if (currentState === "Available")
                            ReserveTable()
                    }}
                    className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Reserve
                </Button>
                <Button
                    onClick={() => {
                        if (currentState === "Occupied")
                            freeTable()

                    }}
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Free
                </Button>
            </div>

        </div >
    );
}