import { useDishStore } from '@/store/dishStore';
import React, { useEffect, useState } from 'react'
import { MenuItemCard } from './MenuItemCard';
import { Dialog, DialogTrigger } from './ui/dialog';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendComboDishSchema, sendIndividualDishSchema } from '@/schemas/dishSchemas';
import { Button } from './ui/button';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ADD_DISH } from '@/utils/Api';
import { useLoginStore } from '@/store/loginStore';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/router';
import { OrderItem } from '@/utils/interfaces';
import { useOrderStore } from '@/store/orderStore';

import { SelectContent, SelectTrigger, SelectValue, Select, SelectItem } from './ui/select';

interface MenusProps {

}

export const Menus: React.FC<MenusProps> = ({ }) => {
    const menuStore = useDishStore();
    const handleAddMenuItem = () => {
        // Logic to add a new menu item
    };
    const orderStore = useOrderStore();
    const { toast } = useToast()
    const router = useRouter()
    const [isAddedToCartMap, setIsAddedToCartMap] = useState(new Map());
    // State to track dishes selected for a combo
    const [isCheckedMap, setIsCheckedMap] = useState(new Map());
    useEffect(() => {
        const newIsAddedToCartMap = new Map();
        menuStore.selectDishForOrder.forEach(dishInit => {
            newIsAddedToCartMap.set(dishInit.id, true);
        });
        setIsAddedToCartMap(newIsAddedToCartMap);

        const newIsCheckedMap = new Map();
        menuStore.selectDishesForCombo.forEach(dishInit => {
            newIsCheckedMap.set(dishInit.id, true);
        });
        setIsCheckedMap(newIsCheckedMap);
    }, [menuStore.selectDishForOrder, menuStore.selectDishesForCombo]);
    const handleCheckboxChange = (dishId: string, isChecked: boolean) => {
        console.log(`Dish ${dishId} checkbox is ${isChecked ? 'checked' : 'unchecked'}`);
        const dishToAdd = menuStore.dishes[menuStore.dishes.findIndex(dish => dish.id === dishId)];
        if (isChecked)
            menuStore.addSelectedDishToCombo(dishToAdd);
        else {
            menuStore.removeSelectedDishToCombo(dishToAdd);
        }
    };
    const handleAddToCart = (dishId: string, isAdded: boolean) => {
        const dishToAdd = menuStore.dishes[menuStore.dishes.findIndex(dish => dish.id === dishId)]
        let order: OrderItem = {
            dish: dishToAdd,
            quant: 1
        }

        if (!isAdded) {
            menuStore.addSelectedDishToOrder(dishToAdd);
            orderStore.addSelectedDishToOrder(order);
        } else {
            menuStore.removeSelectedDishToOrder(dishToAdd);
            orderStore.removeSelectedDishToOrder(order);
        }
    };


    const form = useForm<z.infer<typeof sendIndividualDishSchema>>({
        resolver: zodResolver(sendIndividualDishSchema),
        defaultValues: {
            name: "Mojito",
            description: "Refreshing cocktail made with mint, lime, and rum.",
            price: 7.50,
            isVegan: true,
            isGlutenFree: true,
            preparationTime: 5,
            calories: 150,
            dishType: "DRINK",
            cheesePreference: 0,
            extraMeat: null,
            toppings: ["mint leaves", "sugar"],
        }
    });
    const form2 = useForm<z.infer<typeof sendComboDishSchema>>({
        resolver: zodResolver(sendComboDishSchema),
        defaultValues: {
            name: "Mojito",
            description: "haha",
            price: 0,
            dishes: [],
            dishType: "COMBO"
        }
    });
    const loginStore = useLoginStore();
    const onSubmitIndividualDish = async (values: z.infer<typeof sendIndividualDishSchema>) => {
        // Handle dish submission
        console.log(values.cheesePreference);
        try {
            const postData = {
                "name": values.name,
                "description": values.description,
                "price": values.price,
                "isVegan": values.isVegan,
                "isGlutenFree": values.isGlutenFree,
                "preparationTime": values.preparationTime,
                "calories": values.calories,
                "dishType": values.dishType,
                "quantity": 1,
                "isCustomized": false,
                "cheesePreference": values.cheesePreference,
                "extraMeat": values.extraMeat,
                "toppings": values.toppings,
                "dishes": []
            } as any;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginStore.token}` // Authorization header
                }
            };

            const response = await axios.post(ADD_DISH, postData, config);
            if (response.status === 200 && response.data) {
                toast({
                    variant: "success",
                    title: "Individual Dish Added",
                    description: `Individual Dish ${values.name} added Successfully`,
                })
                setTimeout(() => {
                    router.reload()
                }, 500)
            }
        } catch (E) {
            toast({
                variant: "destructive",
                title: "Dish Error",
                description: `Dish was not added ${E}`,
            })
        }
    };
    const onSubmitComboDish = async (values: z.infer<typeof sendComboDishSchema>) => {
        // Handle dish submission
        form2.setValue("dishes", menuStore.selectDishesForCombo.map(dish => dish.id));
        try {
            const postData = {
                "name": form2.getValues().name,
                "dishType": "COMBO",
                "quantity": 1,
                "dishes": form2.getValues().dishes
            } as any;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginStore.token}` // Authorization header
                }
            };

            const response = await axios.post(ADD_DISH, postData, config);
            console.log(postData)
            if (response.status === 200 && response.data) {

                toast({
                    variant: "success",
                    title: "Combo Dish Added",
                    description: `Dish ${form2.getValues().name} added Successfully`,
                })
                menuStore.selectDishesForCombo = [];
                setTimeout(() => {
                    router.reload()
                }, 500)
            }
        } catch (E) {
            toast({
                variant: "destructive",
                title: "Combo Dish Error",
                description: `Dish was not added ${E}`,
            })
        }
    };
    const ExtraMeat = (
        <FormField
            control={form.control}
            name="extraMeat"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4 ">
                    <div className="flex flex-col">
                        <FormLabel className=" w-60 text-lg font-extrabold text-foreground">
                            Extra Meat
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={"No Meat"}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select extra meat" />
                            </SelectTrigger>
                            <SelectContent {...field}>
                                <SelectItem value="chicken" >Chicken</SelectItem>
                                <SelectItem value="beef" >Beef</SelectItem>
                                <SelectItem value="pork" >Pork</SelectItem>
                                <SelectItem value="lamb" >Lamb</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
    const DishName = (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Dish Name
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter dish name"
                            {...field}
                            type='string'
                            onChange={(e) => {
                                field.onChange(e.target.value);

                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const ComboDishName = (
        <FormField
            control={form2.control}
            name="name"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Dish Name
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter dish name"
                            {...field}
                            type='string'
                            onChange={(e) => {
                                field.onChange(e.target.value);

                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const DishDescription = (
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Description
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter dish description"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const IsVegan = (
        <FormField
            control={form.control}
            name="isVegan"
            render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className=" w-28 text-lg font-extrabold text-foreground">
                            Vegan
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            type="checkbox"
                            checked={value}
                            onChange={e => onChange(e.target.checked)}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const IsGlutenFree = (
        <FormField
            control={form.control}
            name="isGlutenFree"
            render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className=" w-28 text-lg font-extrabold text-foreground">
                            Gluten Free
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            type="checkbox"
                            checked={value}
                            onChange={e => onChange(e.target.checked)}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const DishType = (
        <FormField
            control={form.control}
            name="dishType"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Dish Type
                        </FormLabel>
                    </div>
                    <FormControl>
                        <select {...field} defaultValue="">
                            <option value="" disabled>Select dish type</option>
                            <option value="APPETIZER">Appetizer</option>
                            <option value="ENTREE">Entree</option>
                            <option value="DESSERT">Dessert</option>
                            <option value="DRINK">Drink</option>
                        </select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const Price = (
        <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className=" w-20 text-lg font-extrabold text-foreground">
                            Price
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter price"
                            {...field}
                            type="number"
                            onChange={(e) => {
                                if (e.target.value) {
                                    let numValue = parseInt(e.target.value.replace(/^0+/, ''))
                                    field.onChange(numValue);
                                } else {
                                    field.onChange(0);
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const CheesePreference = (
        <FormField
            control={form.control}
            name="cheesePreference"
            render={({ field: { value, onChange, ...field } }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className=" w-44 text-lg font-extrabold text-foreground">
                            Cheese Preference
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            type="checkbox"
                            checked={value === 1} // Ensure the checkbox is checked based on the value being 1
                            onChange={e => onChange(e.target.checked ? 1 : 0)}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const PreparationTime = (
        <FormField
            control={form.control}
            name="preparationTime"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className=" w-36 text-lg font-extrabold text-foreground">
                            Preparation Time
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter preparation time"
                            {...field}
                            type="number"
                            onChange={(e) => {
                                if (e.target.value) {
                                    let numValue = parseInt(e.target.value.replace(/^0+/, ''))
                                    field.onChange(numValue);
                                } else {
                                    field.onChange(0);
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const Calories = (
        <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-20 text-lg font-extrabold text-foreground">
                            Calories
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter calories"
                            {...field}
                            type="number"
                            onChange={(e) => {
                                if (e.target.value) {
                                    let numValue = parseInt(e.target.value.replace(/^0+/, ''))
                                    field.onChange(numValue);
                                } else {
                                    field.onChange(0);
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );


    return (
        <div className="flex flex-col p-6 container mx-auto">
            <div className="flex p-2">
                <h1 className="text-3xl font-bold mb-8">Our Menu</h1>
                {/* <Button className="mb-8 ml-auto" onClick={handleAddMenuItem}>Add Menu Item</Button> */}
                <div className="flex ml-auto space-x-6">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"coolBlue"} className="mb-8 ml-auto" onClick={handleAddMenuItem}>Add Menu Item</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='font-extrabold text-xl'>Add New Dish</DialogTitle>
                                <DialogDescription>
                                    Enter the details of the new dish.
                                </DialogDescription>
                            </DialogHeader>
                            <Form  {...form} >
                                <form onSubmit={form.handleSubmit(onSubmitIndividualDish)} className='flex flex-col space-y-4'>
                                    {DishName}
                                    {DishDescription}
                                    <div className="flex justify-between">
                                        {CheesePreference}
                                        {ExtraMeat}
                                    </div>

                                    <div className="flex justify-between">
                                        {IsGlutenFree}
                                        {IsVegan}
                                        {Price}
                                    </div>
                                    <div className="flex justify-between">
                                        {PreparationTime}
                                        {Calories}
                                    </div>

                                    {DishType}


                                    <Button type="submit">Add Dish</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"coolBlue"} className="mb-8 ml-auto" onClick={handleAddMenuItem}>Make Combo</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className='font-extrabold text-xl'>Make Combo</DialogTitle>
                                <DialogDescription>
                                    Enter the details of the new dish.
                                </DialogDescription>
                            </DialogHeader>
                            <Form  {...form2} >
                                <form onSubmit={form2.handleSubmit(onSubmitComboDish)} className='flex flex-col space-y-4'>
                                    {ComboDishName}
                                    <Button type="submit">Add Dish</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
            <div className="grid  grid-cols-3  gap-x-6 gap-y-10 ">
                {menuStore.dishes.map((dish) => (
                    <MenuItemCard
                        isAddedToCart={isAddedToCartMap.has(dish.id) ? true : false}
                        isChecked={isCheckedMap.has(dish.id) ? true : false}
                        onCheckboxChange={handleCheckboxChange}
                        onAddToCart={handleAddToCart}
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
                {
                    menuStore.dishes.length === 0 && (
                        <div className="flex p-4">
                            Please add a new Dish
                        </div>
                    )
                }
            </div>
        </div>
    );


}


