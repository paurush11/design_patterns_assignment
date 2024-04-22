
import { z } from 'zod';
export const loginSchema = z.object({
    username: z.string().optional(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[\W]/),
    email: z.string().email().optional(),
    fingerPrint: z.string()
        .min(30, { message: "Fingerprint data must be at least 30 characters long" })
        .regex(/[0-9]/, { message: "Fingerprint data must include at least one digit" }),
    userInput: z.union([
        z.literal('biometric'),
        z.literal('username-password'),
        z.literal('email-password')
    ]),
});