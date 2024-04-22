import { z } from 'zod';

const tableSchema = z.object({
    tableNumber: z.number().min(1, "Table number must be at least 1"),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    currentState: z.enum(["Available", "Occupied"])
});

export {
    tableSchema
}