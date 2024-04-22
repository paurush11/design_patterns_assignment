import { z } from 'zod';
const creditCardNumberRegex = /^(?:\d{4}\s?){4}$/;
const creditCardSchema = z.object({
    cardHolderName: z.string().min(1, "Cardholder name is required"),
    cardNumber: z.string()
        .min(19, "Card number must be 19 digits")
        .max(19, "Card number must be 19 digits")
        .regex(creditCardNumberRegex, {
            message: "Card number must be 16 digits long and optionally include spaces after every four digits.",
        })
        .transform(value => value.replace(/\s+/g, '')),
    expiryMonth: z.string()
        .length(2, "Expiry month must be two digits")
        .regex(/^(0[1-9]|1[0-2])$/, "Invalid expiry month"),
    expiryYear: z.string()
        .length(2, "Expiry year must be two digits"),
    cvv: z.string()
        .length(3, "CVV must be 3 digits")
        .regex(/^\d+$/, "CVV must be numeric"),
});

// TypeScript type inferred from the Zod schema
export type CreditCardInput = z.infer<typeof creditCardSchema>;

export {
    creditCardSchema
}