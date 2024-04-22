import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { TableCard } from '@/components/TableCard';
import { useLoginStore } from '@/store/loginStore';
import axios from 'axios';
import { GET_FULL_MENU, SHOW_ALL_ORDERS, VIEW_ALL_TABLES } from '@/utils/Api';
import { Order, OrderResponse, ReceiveDish, TTable } from '@/utils/interfaces';
import { useTableStore } from '@/store/tableStore';
import { Tables } from '@/components/Tables';
import { TableRelatedSection } from '@/components/TableRelatedSection';
import { MenuRelatedSection } from '@/components/MenuRelatedSection';
import { useDishStore } from '@/store/dishStore';
import { useRouter } from 'next/router';
import { useKitchenStore } from '@/store/KitchenStore';
import { RESTAURANT_NAME } from '@/utils/constants';
import { Footer } from '@/components/Footer';

const IndexPage = () => {
    const loginStore = useLoginStore();
    const tableStore = useTableStore();
    const dishStore = useDishStore();
    const kitchenStore = useKitchenStore();
    const router = useRouter()
    const [showClientOnlyComponent, setShowClientOnlyComponent] = useState(false);
    const fetchOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginStore.token}` // Authorization header
                }
            };
            const response = await axios.get(SHOW_ALL_ORDERS, config)
            console.log(response.data)
            if (response.status === 200 && response.data) {
                kitchenStore.setOrders(response.data.data as OrderResponse)
            }
        } catch (E) {
            console.log(E)
        }
    }
    const fetchTables = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginStore.token}` // Authorization header
            },
            // params: params // URL parameters
        };
        try {
            const response = await axios.get(VIEW_ALL_TABLES, config);
            if (response.status === 200 && response.data) {
                const tables = response.data.data as TTable[];
                tableStore.setAllTables(tables);
            }
        } catch (E) {
            console.log(E);
            router.push("/login")
        }



    }
    const fetchMenuItems = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginStore.token}` // Authorization header
            },
            // params: params // URL parameters
        };
        try {
            const response = await axios.get(GET_FULL_MENU, config);
            if (response.status === 200 && response.data) {
                const dishes = response.data.data as ReceiveDish[]
                dishStore.setDishes(dishes)
            }
        } catch (E) {
            console.log(E);
            router.push("/login")
        }
    }
    useEffect(() => {
        setShowClientOnlyComponent(true);
    }, []);

    useEffect(() => {
        if (loginStore.isLoggedIn) {
            fetchTables()
            fetchMenuItems()
            fetchOrders()
        }
    }, [loginStore.isLoggedIn])

    return (
        <div className="flex flex-col min-h-screen bg-slate-500" style={{
        }}>
            <Navbar />

            <main className="flex-grow">
                <section className="flex items-center justify-center text-center h-96 " style={{
                    backgroundImage: "url(/restaurant.jpeg)",
                    backgroundSize: 'cover', // Ensure the background covers the full content area
                    backgroundPosition: 'center'
                }}>
                    <div className=' bg-gray-400 opacity-90 p-28 rounded-xl'>
                        <h2 className="text-5xl font-bold mb-4">Welcome to  {RESTAURANT_NAME}</h2>
                        <p className="text-lg mb-8">Enjoy the finest dining experience with us.</p>
                    </div>
                </section>
                {showClientOnlyComponent && loginStore.isLoggedIn && (
                    <>
                        <TableRelatedSection />
                        <MenuRelatedSection />
                    </>
                )}
            </main>
            <Footer />

        </div >
    );
};

export default IndexPage;
