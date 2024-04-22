// schemas/accountSchema.ts
import { z } from 'zod';

export const accountSchema = z.object({
    username: z.string()
        .min(8, { message: "Username must be at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Username must include uppercase and lowercase letters" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must include an uppercase letter" })
        .regex(/[a-z]/, { message: "Password must include a lowercase letter" })
        .regex(/[0-9]/, { message: "Password must include a digit" })
        .regex(/[\W]/, { message: "Password must include a special character" }),
    email: z.string()
        .email({ message: "Invalid email address" })
        .min(5, { message: "Email must be at least 5 characters long" }),
    fingerPrint: z.string()
        .min(30, { message: "Fingerprint data must be at least 30 characters long" })
        .regex(/[0-9]/, { message: "Fingerprint data must include at least one digit" }),
    phone: z.string() // You can use a regex pattern to validate phone numbers based on the expected format
        .min(10, { message: "Phone number must be at least 10 digits long" }),
    role: z.literal('USER'),
});

const defaultUsername = "User1234"; // Includes both uppercase and lowercase, and is at least 8 characters long.
const defaultEmail = "example123@example.com"; // A valid email format.
const defaultPassword = "Password$123"; // Meets the requirements of uppercase, lowercase, digit, and special character.
const defaultFingerprint = "1234567890123456789012345678901"; // At least 30 characters long with a digit.

export {
    defaultEmail,
    defaultFingerprint, defaultPassword, defaultUsername
}