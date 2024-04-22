import { z } from 'zod';

const sendIndividualDishSchema = z.object({
    name: z.string().min(1, "Cannot be empty name"),
    description: z.string().min(1, "Cannot be empty description"),
    price: z.number().min(0),
    isVegan: z.boolean(),
    isGlutenFree: z.boolean(),
    preparationTime: z.number().min(0),
    calories: z.number().min(0),
    dishType: z.enum(['APPETIZER', 'ENTREE', 'DESSERT', 'DRINK']),
    cheesePreference: z.number().min(0),
    extraMeat: z.string().nullable(),
    toppings: z.array(z.string())
});
const receiveDishSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    preparationTime: z.number(),
    calories: z.number(),
    dishType: z.enum(['APPETIZER', 'ENTREE', 'DESSERT', 'DRINK', 'COMBO']),
    vegan: z.boolean(),
    glutenFree: z.boolean(),
});

// Update the sendComboDishSchema to use receiveDishSchema for validating dishes array
const sendComboDishSchema = z.object({
    name: z.string().min(1, "Cannot be empty name"),
    description: z.string().min(1, "Cannot be empty description"),
    price: z.number().min(0),
    dishType: z.literal('COMBO'),
    dishes: z.array(z.string()),
});

export {
    sendIndividualDishSchema,
    sendComboDishSchema
}