import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { OrderCard } from '@/components/OrderCard';
import { Button } from '@/components/ui/button';
import { useKitchenStore } from '@/store/KitchenStore';
import { useLoginStore } from '@/store/loginStore';
import { SHOW_ALL_ORDERS, UPDATE_ORDER_STATUS, UPDATE_PAYMENT_STATUS } from '@/utils/Api';
import { Order, OrderStatus, PaymentStatus } from '@/utils/interfaces';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

interface KitchenProps {

}

const Kitchen: React.FC<KitchenProps> = ({ }) => {
    const loginStore = useLoginStore();
    const kitchenStore = useKitchenStore();
    const [pendingOrders, setPendingOrders] = useState<Order[]>([])
    const [preparingOrders, setPreparingOrders] = useState<Order[]>([])
    const [readyOrders, setReadyOrders] = useState<Order[]>([])
    const [typeOfOrder, setTypeOfOrder] = useState<"PENDING" | "PREPARING" | "READY">("PENDING")
    const [variant, setVariant] = useState<"brightYellow" | "brightOrange" | "success">("brightYellow")
    useEffect(() => {
        if (kitchenStore.orders) {
            setPendingOrders(kitchenStore.orders.PENDING)
            setPreparingOrders(kitchenStore.orders.PREPARING)
            setReadyOrders(kitchenStore.orders.READY)
            updatePaymentStatus()
            updateOrderStatus()
        }
    }, [kitchenStore.orders])

    useEffect(() => {
        updatePaymentStatus();
        // bg-gradient-${variant} 

    }, [pendingOrders])

    useEffect(() => {
        setTimeout(() => {
            updateOrderStatus();
        }, 4000)


    }, [preparingOrders])



    const updatePaymentStatus = async () => {
        const { orders, setOrders } = kitchenStore
        const pendingOrders = orders.PENDING;

        if (!pendingOrders || pendingOrders.length === 0) return;
        const firstOrder = pendingOrders[0];

        if (firstOrder.paymentStatus === "PAID") return;


        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginStore.token}`, // Replace with actual token
                },
            };

            let paymentStatus: PaymentStatus = firstOrder.paymentStatus === "UNPAID" ? "PENDING" : "PAID";
            const postData = { paymentStatus };
            const response = await axios.post(`${UPDATE_PAYMENT_STATUS} ${firstOrder.id}`, postData, config);

            if (response.status === 200) {
                console.log("Payment status updated");
                // Update the order in the state
                const updatedOrders = [...pendingOrders];
                updatedOrders[0].paymentStatus = paymentStatus;
                // Updating the first order's status
                setTimeout(() => {
                    setOrders({ ...orders, PENDING: updatedOrders });
                }, 4000)

            }
        } catch (error) {
            console.error("Failed to update payment status:", error);
        }
    };

    const updateOrderStatus = async () => {
        const { orders, setOrders } = kitchenStore;  // Access the store's state and updater.

        // Check for orders in PENDING that can be moved to PREPARING.
        const orderToUpdate = orders.PENDING.find(order => order.status === "PENDING" && order.paymentStatus === "PAID");

        if (orderToUpdate) {
            // If an updatable order is found in PENDING, promote it to PREPARING.
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${loginStore.token}`, // Ensure this token retrieval is correct.
                    },
                };
                const postData = { status: "PREPARING" };
                const response = await axios.post(`${UPDATE_ORDER_STATUS}${orderToUpdate.id}`, postData, config);

                if (response.status === 200) {
                    console.log("Order status updated to PREPARING");

                    // Remove order from PENDING and add to PREPARING.
                    const newPendingOrders = orders.PENDING.filter(order => order.id !== orderToUpdate.id);
                    const newPreparingOrders: Order[] = [...orders.PREPARING, { ...orderToUpdate, status: "PREPARING" }];

                    // Update the state with new arrays.
                    setTimeout(() => {
                        setOrders({
                            ...orders,
                            PENDING: newPendingOrders,
                            PREPARING: newPreparingOrders
                        });
                    }, 4000)

                }
            } catch (error) {
                console.error("Failed to update order status:", error);
            }
        } else {
            // Now, check for orders in PREPARING that can be moved to READY.
            const preparingOrderToUpdate = orders.PREPARING.find(order => order.status === "PREPARING" && order.paymentStatus === "PAID");

            if (preparingOrderToUpdate) {
                try {
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${loginStore.token}`,
                        },
                    };
                    const postData = { status: "READY" };
                    const response = await axios.post(`${UPDATE_ORDER_STATUS}${preparingOrderToUpdate.id}`, postData, config);

                    if (response.status === 200) {
                        console.log("Order status updated to READY");

                        // Remove order from PREPARING and move to READY.
                        const newPreparingOrders = orders.PREPARING.filter(order => order.id !== preparingOrderToUpdate.id);
                        const newReadyOrders: Order[] = [...orders.READY, { ...preparingOrderToUpdate, status: "READY" }];
                        setTimeout(() => {
                            setOrders({
                                ...orders,
                                PREPARING: newPreparingOrders,
                                READY: newReadyOrders
                            });
                        }, 4000)
                        // Update the state with the new arrays.

                    }
                } catch (error) {
                    console.error("Failed to update order status:", error);
                }
            }
        }
    };


    return (
        <div className={"flex flex-col min-h-screen "} style={{

        }}>
            <Navbar />
            <div className="flex justify-between p-10">
                <Button variant={typeOfOrder === "PENDING" ? "brightYellow" : "ghost"} onClick={() => {
                    setTypeOfOrder("PENDING")
                    setVariant("brightYellow")
                }}>Pending</Button>
                <Button variant={typeOfOrder === "PREPARING" ? "brightOrange" : "ghost"} onClick={() => {
                    setTypeOfOrder("PREPARING")
                    setVariant("brightOrange")
                }}>Preparing</Button>
                <Button variant={typeOfOrder === "READY" ? "success" : "ghost"} onClick={() => {
                    setTypeOfOrder("READY")
                    setVariant("success")
                }}>Ready</Button>
            </div>
            <div className="container mx-auto p-4">
                {/* <h2 className="text-2xl font-bold text-gray-800">Orders</h2> */}
                {typeOfOrder === "PENDING" && <div>
                    <div className="flex text-2xl font-bold mb-5"> Pending Orders</div>
                    {pendingOrders && pendingOrders.length > 0 ? (
                        pendingOrders?.map(order => OrderCard({ order: order }))
                    ) : (
                        <p className="text-gray-500">No Pending orders.</p>
                    )}
                </div>}
                {typeOfOrder === "PREPARING" && <div>
                    <div className="flex text-2xl font-bold mb-5"> Preparing Orders</div>
                    {preparingOrders && preparingOrders.length > 0 ? (
                        preparingOrders?.map(order => OrderCard({ order: order }))
                    ) : (
                        <p className="text-gray-500">No Preparing orders.</p>
                    )}
                </div>}
                {typeOfOrder === "READY" && <div>
                    <div className="flex text-2xl font-bold mb-5"> Ready Orders</div>
                    {readyOrders && readyOrders.length > 0 ? (
                        readyOrders?.map(order => OrderCard({ order: order }))
                    ) : (
                        <p className="text-gray-500">No Ready orders.</p>
                    )}
                </div>}
            </div>
            <div className="flex mt-auto"></div>
            <Footer />
        </div>
    );
}
export default Kitchen