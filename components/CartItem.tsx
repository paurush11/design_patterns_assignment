import React, { useEffect, useState } from 'react';
import { OrderItem, ReceiveDish } from '@/utils/interfaces';
import { Button } from './ui/button'; // Assuming you have a styled Button component from Shadcn or similar.
import { useOrderStore } from '@/store/orderStore';

export const CartItem: React.FC<ReceiveDish & { onAddToCart: (id: string, isAdded: boolean, quantity: number) => void, isAddedToCart: boolean, onUpdateQuant: (dishId: string, quantity: number) => void, oldQuant: number }> = ({
    id,
    name,
    description,
    dishType,
    preparationTime,
    price,
    calories,
    vegan,
    glutenFree,
    onAddToCart,
    isAddedToCart,
    onUpdateQuant,
    oldQuant
}) => {
    const [buttonText, setButtonText] = useState("Add to Cart");
    const [quantity, setQuantity] = useState(oldQuant);
    useEffect(() => {
        setButtonText(isAddedToCart ? "Remove From Cart" : "Add to Cart");
    }, [isAddedToCart]);


    const orderStore = useOrderStore()

    useEffect(() => {
        console.log(quantity)
        onUpdateQuant(id, quantity)
    }, [quantity])

    const increment = () => {

        setQuantity(prev => prev + 1) // Prevent quantity from being less than 1

        // onUpdateQuant(id, quantity)
    }
    const decrement = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1))
        // onUpdateQuant(id, quantity)
    };

    return (
        <div className="flex flex-col bg-gradient-to-r from-gray-50 to-gray-200 shadow-xl bg-white rounded-lg  overflow-hidden">
            <div className="p-6">
                <div className="flex">
                    <h5 className="text-2xl font-bold text-gray-800 mb-2">{name} - ${price.toFixed(2)}</h5>

                    <div className="flex items-center ml-auto">
                        <Button className="text-gray-400 mr-3" onClick={decrement}>-</Button>
                        <input
                            type="number"
                            className="w-12 text-center border-gray-300 mx-2"
                            value={quantity}
                            onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                setQuantity(value < 1 ? 1 : value); // Prevent quantity from being less than 1
                                // onUpdateQuant(id, quantity)
                            }}
                            min="1"
                        />
                        <Button className="text-gray-400" onClick={increment}>+</Button>
                    </div>
                </div>

                <p className="text-gray-600 mb-1">{description}</p>
                <div className="text-gray-500 text-sm space-y-1">
                    <p>Type: {dishType}</p>
                    <p>Prep Time: {preparationTime} mins</p>
                    <p>Calories: {calories}</p>
                    {vegan && <span className="text-green-500 text-xs font-semibold">Vegan</span>}
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <Button
                    className={`text-white ${isAddedToCart ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} 
                               focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5`}
                    onClick={() => {
                        if (buttonText === "Add to cart") {
                            setButtonText("Remove From Cart");
                            onAddToCart(id, false, quantity);
                        } else {
                            setButtonText("Add to cart");
                            onAddToCart(id, true, quantity);
                        }
                    }}
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};


