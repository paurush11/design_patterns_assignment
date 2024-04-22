export type TTable = {
    tableNumber: number,
    capacity: number,
    currentState: TcurrentState
    id: string,
}

export type TcurrentState = "Available" | "Occupied"

// Types for sending dishes to the server
export interface SendIndividualDish {
    name: string;
    description: string;
    price: number;
    isVegan: boolean;
    isGlutenFree: boolean;
    preparationTime: number;
    calories: number;
    dishType: 'APPETIZER' | 'ENTREE' | 'DESSERT' | 'DRINK';
    cheesePreference: number;
    extraMeat: string | null;
    toppings: string[];
}

export interface SendComboDish {
    name: string;
    description: string;
    price: number;
    dishType: 'COMBO';
    dishes: string[]; // Array of IDs referencing individual dishes
}

// Types for receiving data from the server
export interface ReceiveIndividualDish extends ReceiveDish {
    cheesePreference: number;
    extraMeat: string | null;
    toppings: string[] | null;
}

export interface ReceiveDish {
    id: string;
    name: string;
    description: string;
    price: number;
    preparationTime: number;
    calories: number;
    dishType: 'APPETIZER' | 'ENTREE' | 'DESSERT' | 'DRINK' | 'COMBO';
    vegan: boolean;
    glutenFree: boolean;
}

export interface ApiResponse {
    message: string | null;
    data: (ReceiveDish)[];
    responseStatus: 'SUCCESS' | 'FAILURE';
}

export type OrderItem = {
    dish: ReceiveDish
    quant: number
}
export type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED"
export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY';
export type Order = {
    id: string;
    dateTime: string;
    customerId: number;
    status: OrderStatus;
    totalPrice: number;
    paymentMethod: 'Credit Card';
    paymentStatus: PaymentStatus
    orderDishes: ReceiveDish[];
};

export type OrderResponse = {
    PENDING: Order[]
    PREPARING: Order[]
    READY: Order[]
}

export type Tstrategy = "peakhour" | "happyhour" | "regular"