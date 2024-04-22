import { useDishStore } from '@/store/dishStore';
import { ReceiveDish, ReceiveIndividualDish } from '@/utils/interfaces';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';



export const MenuItemCard: React.FC<ReceiveDish & { onCheckboxChange: (id: string, isChecked: boolean) => void } & { onAddToCart: (id: string, isAdded: boolean) => void } & { isAddedToCart: boolean, isChecked: boolean }> = ({ id, name, description, dishType, preparationTime, price, calories, vegan, glutenFree, onCheckboxChange, onAddToCart, isAddedToCart, isChecked }) => {

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onCheckboxChange(id, event.target.checked);
    };
    const dishTypeImages = {
        APPETIZER: "/appetizer.jpeg",  // Adjust paths accordingly
        DESSERT: "/desert.jpeg",
        ENTREE: "/entree.jpeg",
        DRINK: "/drink.jpeg",
        COMBO: "/combo.jpeg"
    } as any;
    const backgroundImageUrl = dishTypeImages[dishType];
    const [text, setText] = useState("Add to cart");
    useEffect(() => {
        if (isAddedToCart) setText("Remove From Cart")
    }, [isAddedToCart])
    return (
        <div className="rounded-xl  flex p-4 bg-gradient-to-r from-gray-50 to-gray-400 shadow-xl "
            style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover' }}
        >
            <div className="opacity-90 bg-white rounded-xl border bg-gradient-to-r from-gray-50 to-gray-200  shadow-xl overflow-hidden min-w-96  flex flex-col">

                <div className="p-4">

                    <h5 className="text-xl font-bold text-gray-900 mb-2">{name} - ${price.toFixed(2)}</h5>
                    <p className="text-gray-700 mb-1">{description}</p>
                    <p className="text-gray-500 text-sm mb-1">Type: {dishType}</p>
                    <p className="text-gray-500 text-sm mb-1">Prep Time: {preparationTime} mins</p>
                    <p className="text-gray-500 text-sm mb-1">Calories: {calories}</p>
                    {vegan && <span className="text-green-500 text-xs font-semibold">Vegan</span>}
                </div>
                <div className="flex items-center p-4 mt-auto justify-between">
                    {
                        dishType !== "COMBO" &&
                        <div >
                            <input
                                type="checkbox"
                                id={`checkbox-${id}`}
                                className="rounded text-blue-500 size-3"
                                onChange={handleCheckboxChange}
                                defaultChecked={isChecked}
                            />
                            <label htmlFor={`checkbox-${id}`} className="sr-only">Select</label>
                        </div>
                    }
                    <Button
                        variant={text === "Add to cart" ? "default" : "destructive"}
                        className=" text-white focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                        onClick={() => {
                            if (text === "Add to cart") {
                                setText("Remove From Cart");
                                onAddToCart(id, false);
                            } else {
                                setText("Add to cart");
                                onAddToCart(id, true);
                            }
                        }}>
                        {text === "Add to cart" &&
                            (<svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 5v14m7-7H5"></path>
                            </svg>)}

                        {text !== "Add to cart" && <svg className="w-4 h-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 12h14"></path>
                        </svg>}

                        {text}
                    </Button>
                </div>

            </div>
        </div>
    );
}
