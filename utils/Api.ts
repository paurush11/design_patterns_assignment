const REGISTER = "http://localhost:8081/user/create" // +BODY
const LOGIN = "http://localhost:8081/user/authenticate" // +BODY
// TABLE
const CREATE_TABLE = "http://localhost:8081/table/create" // + BODY
const OCCUPY_TABLE = "http://localhost:8081/table/occupy" //?tableNumber=10
const FREE_TABLE = "http://localhost:8081/table/free" //?tableNumber=10
const VIEW_ALL_TABLES = "http://localhost:8081/table/getAll"
const GET_TABLE = "http://localhost:8081/table/get" // ?tableNumber=10
// ORDER
const CREATE_ORDER = "http://localhost:8081/order/newOrder"
const SHOW_ALL_ORDERS = "http://localhost:8081/order/allOrders"
const UPDATE_ORDER_STATUS = "http://localhost:8081/order/updateStatus/" // ID AND BODY
const UPDATE_PAYMENT_STATUS = "http://localhost:8081/order/updatePaymentStatus/" // ID AND BODY
// MENU
const GET_FULL_MENU = "http://localhost:8081/menu/fullMenu"
const UPDATE_PRICING_STRATEGY = "http://localhost:8081/menu/pricingStrategy" //BODY
const ADD_DISH = "http://localhost:8081/menu/addDish" //BODY
// KITCHEN
const SHOW_PENDING_ORDERS = "http://localhost:8081/kitchen/showPreparingOrders"
const UPDATE_ORDER_STATUS_FROM_KITCHEN_TO_READY = "http://localhost:8081/kitchen/updateStatus/" // + ID

export {
    LOGIN,
    REGISTER,
    CREATE_ORDER,
    CREATE_TABLE,
    OCCUPY_TABLE,
    FREE_TABLE, VIEW_ALL_TABLES,
    GET_FULL_MENU,
    GET_TABLE,
    SHOW_ALL_ORDERS,
    SHOW_PENDING_ORDERS,
    ADD_DISH,
    UPDATE_ORDER_STATUS,
    UPDATE_ORDER_STATUS_FROM_KITCHEN_TO_READY,
    UPDATE_PAYMENT_STATUS,
    UPDATE_PRICING_STRATEGY
}