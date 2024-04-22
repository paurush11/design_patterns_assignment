import { Order, OrderStatus, PaymentStatus } from '@/utils/interfaces';
import React from 'react'

interface OrdersProps {
    order: Order
}

export const OrderCard: React.FC<OrdersProps> = ({ order }) => {
    const getStatusColor = (status: OrderStatus | PaymentStatus) => {
        switch (status) {
            case "PAID":
            case "READY":
                return "text-green-500";  // Green for completed or ready statuses
            case "PENDING":
            case "PREPARING":
                return "text-yellow-500"; // Yellow for ongoing statuses
            case "UNPAID":
            case "FAILED":
                return "text-red-500";    // Red for critical statuses
            default:
                return "text-gray-500";   // Default fallback color
        }
    };
    return (
        <div className="flex flex-col bg-gradient-to-r from-gray-50 to-gray-200 shadow-xl rounded-lg p-6 mb-6" key={order.id}>
            <p className="text-sm text-gray-600">Total Price: ${order.totalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Status: <span className={getStatusColor(order.status)}>{order.status}</span></p>
            <p className="text-sm text-gray-600">Payment Status: <span className={getStatusColor(order.paymentStatus)}>{order.paymentStatus}</span></p>
            <div className="mt-2">
                <h4 className="text-md font-semibold">Dishes:</h4>
                {order.orderDishes.map(dish => (
                    <div key={dish.id} className="mt-1">
                        <p className="text-gray-700 font-medium">{dish.name} - ${dish.price.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs">{dish.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}