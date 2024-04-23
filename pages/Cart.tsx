"use client";

import { CartItem } from '@/components/CartItem';
import { Footer } from '@/components/Footer';
import { MenuItemCard } from '@/components/MenuItemCard';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

import { CreditCardInput, creditCardSchema } from '@/schemas/creditCardSchema';
import { useDishStore } from '@/store/dishStore';
import { useLoginStore } from '@/store/loginStore';
import { useOrderStore } from '@/store/orderStore';
import { CREATE_ORDER } from '@/utils/Api';
import { OrderItem } from '@/utils/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import router from 'next/router';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

interface CartProps {

}

const Cart: React.FC<CartProps> = ({ }) => {
    const menuStore = useDishStore();
    const loginStore = useLoginStore();
    const orderStore = useOrderStore();
    const { toast } = useToast();
    const form = useForm<CreditCardInput>({
        resolver: zodResolver(creditCardSchema),
        defaultValues: {
            cardHolderName: "Paurush Batish",
            cardNumber: "4111 1111 1111 1111",
            cvv: "123",
            expiryMonth: "12",
            expiryYear: "25"
        }
    });
    function generateFiveDigitNumber() {
        return Math.floor(10000 + Math.random() * 90000);
    }
    const onSubmitPayment = async (values: CreditCardInput) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (`0${today.getMonth() + 1}`).slice(-2); // getMonth() is zero-indexed
        const day = (`0${today.getDate()}`).slice(-2);
        const todaysDate = `${year}-${month}-${day}`;
        const dishWithCount = orderStore.orderDishes.map(order => {
            const obj: any = order.dish;
            obj["quantity"] = order.quant
            return obj;
        })
        if (dishWithCount.length === 0) return;
        try {
            const postData = {
                "dateTime": todaysDate,
                "customerId": generateFiveDigitNumber(),
                "status": "PENDING",
                "paymentMethod": "Credit Card",
                "paymentStatus": "UNPAID",
                "dishes": dishWithCount
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginStore.token}` // Authorization header
                }
            };

            const response = await axios.post(CREATE_ORDER, postData, config);

            if (response.status === 200 && response.data) {
                toast({
                    variant: "success",
                    title: "Your Order Was Placed",
                    description: ``,
                })
                orderStore.orderDishes = [];
                menuStore.selectDishForOrder = [];
                setTotalAmount(0);
                setTimeout(() => {
                    router.replace("/")
                }, 500)
            }
        } catch (e) {

        }



    }


    useEffect(() => {
        setShowClientOnlyComponent(true);
    }, []);
    const [quantities, setQuantities] = useState(new Map());
    const [totalAmount, setTotalAmount] = useState(0);
    const [showClientOnlyComponent, setShowClientOnlyComponent] = useState(false);
    const handleAddToCart = (dishId: string, isAdded: boolean, quantity: number) => {
        const dishToAdd = menuStore.dishes[menuStore.dishes.findIndex(dish => dish.id === dishId)]
        let order: OrderItem = {
            dish: dishToAdd,
            quant: quantity
        }

        if (!isAdded) {

            menuStore.addSelectedDishToOrder(dishToAdd);
            orderStore.addSelectedDishToOrder(order);
        } else {
            menuStore.removeSelectedDishToOrder(dishToAdd);
            orderStore.removeSelectedDishToOrder(order);

        }
    };
    useEffect(() => {
        if (menuStore.selectDishForOrder.length === 0) {
            orderStore.orderDishes = [];
        }

    }, [menuStore.selectDishForOrder])
    useEffect(() => {
        const newQuantities = new Map();
        let amt = 0;

        orderStore.orderDishes.forEach(order => {
            newQuantities.set(order.dish.id, order.quant);
            amt += order.dish.price * order.quant;
        });
        setTotalAmount(amt);
        setQuantities(newQuantities);
    }, [orderStore.orderDishes, menuStore.selectDishForOrder])

    const handleCartItemQuantity = (dishId: string, quantity: number) => {
        const dishToAdd = menuStore.dishes[menuStore.dishes.findIndex(dish => dish.id === dishId)]
        let dishIndex = orderStore.orderDishes.findIndex(order => order.dish.id === dishId)
        let dishExists: boolean = dishIndex === -1 ? false : true
        let order: OrderItem = {
            dish: dishToAdd,
            quant: quantity
        }
        if (dishExists) {
            if (orderStore.orderDishes[dishIndex].quant < quantity)
                orderStore.addSelectedDishQuantityToOrder(order)
            else
                orderStore.addSelectedDishQuantityToOrder(order)
        } else {
            orderStore.addSelectedDishToOrder(order)
        }
    }

    const CardNumberField = (
        <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-xs font-extrabold text-foreground">
                            Card Number
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="1234 5678 9101 1121"
                            {...field}
                            type='text'
                            maxLength={19} // format: 4 groups of 4 digits
                            onChange={(e) => {
                                // Add spaces for card number readability
                                const value = e.target.value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                console.log(value.length)
                                console.log(e.target.value.length)
                                field.onChange(value);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const CardHolderNameField = (
        <FormField
            control={form.control}
            name="cardHolderName"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-xs font-extrabold text-foreground">
                            Cardholder Name
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Full Name"
                            {...field}
                            type="text"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const ExpiryMonthField = (
        <FormField
            control={form.control}
            name="expiryMonth"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-38 text-xs font-extrabold text-foreground">
                            Expiry Month (MM)
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="MM"
                            {...field}
                            maxLength={2}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const ExpiryYearField = (
        <FormField
            control={form.control}
            name="expiryYear"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-38 text-xs font-extrabold text-foreground">
                            Expiry Year (YY)
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="YY"
                            {...field}
                            maxLength={2}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const CVVField = (
        <FormField
            control={form.control}
            name="cvv"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className=" w-20 text-xs font-extrabold text-foreground">
                            CVV
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="CVV"
                            {...field}
                            type="text"
                            inputMode="numeric"
                            maxLength={3}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );


    return (
        <div className="flex flex-col min-h-screen justify-between">
            <Navbar />
            {showClientOnlyComponent && loginStore.isLoggedIn &&
                (
                    <>
                        <div className="p-8">
                            {menuStore.selectDishForOrder.map((dish) => (
                                <CartItem
                                    isAddedToCart={menuStore.selectDishForOrder.findIndex(dishInit => dishInit.id === dish.id) === -1 ? false : true}
                                    onAddToCart={handleAddToCart}
                                    onUpdateQuant={handleCartItemQuantity}
                                    oldQuant={quantities.get(dish.id) || 1}
                                    key={dish.id}
                                    name={dish.name}
                                    description={dish.description}
                                    dishType={dish.dishType}
                                    preparationTime={dish.preparationTime}
                                    price={dish.price} calories={dish.calories}
                                    vegan={dish.vegan}
                                    id={dish.id}
                                    glutenFree={dish.glutenFree}
                                />
                            ))}
                        </div>
                        <div className="flex ml-auto mt-auto p-6">

                            <div className="flex  flex-1 items-center p-4 space-x-10 justify-between">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="font-bold py-2 px-4 rounded"                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className='font-extrabold text-xl'>Credit Card Payment</DialogTitle>
                                            <DialogDescription>
                                                Enter your payment details below.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...form}>
                                            <form onSubmit={form.handleSubmit(onSubmitPayment)} className='flex flex-col space-y-4'>
                                                <div className="flex flex-col p-6 bg-slate-500 rounded-lg">
                                                    {CardHolderNameField}
                                                    {CardNumberField}
                                                    <div className="flex space-x-4">
                                                        {ExpiryMonthField}
                                                        {ExpiryYearField}
                                                        {CVVField}
                                                    </div>
                                                </div>



                                                <Button type="submit">Pay Now</Button>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>

                                <h2 className="flex  text-xl   p-2 font-bold">Total: ${totalAmount.toFixed(2)}</h2>

                            </div>
                        </div>


                    </>



                )

            }
            <Footer />
        </div >
    );
}

export default Cart

