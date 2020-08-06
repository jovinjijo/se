import { OrderType } from "./src/Order/Order";
import { User } from "./src/User/User";
import { Market } from "./src/Market/Market";
import { Stock } from "./src/util/Datatypes";

const market = Market.getInstance();

const user1 = new User("John Doe", 10000, [{ stock: Stock.TSLA, quantity: 1000 }]);
console.log("User 1 : Create");
console.dir(user1);

const user2 = new User("Mary Jane", 10000);
console.log("User 2 : Create");
console.dir(user2);

market.addOrderStore(Stock.TSLA).orderStore;

user1.placeOrder(Stock.TSLA, OrderType.Sell, 10, 300);
console.log("User 1 : After Place Order");
console.dir(user1);

user2.placeOrder(Stock.TSLA, OrderType.Buy, 10, 300);
console.log("User 2 : After Place Order, order confirmed");
console.dir(user2);
console.log("User 1 : After Place Order, order confirmed");
console.dir(user1);
