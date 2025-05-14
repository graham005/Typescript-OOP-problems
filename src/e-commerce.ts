type Role = 'Admin' | 'Seller' | 'Customer';

type ProductType = 'Electonics' | 'Clothing' | 'Furniture' ;

interface BaseProduct  {
    productId: number;
    productName: string;
    productPrice: number;
    productTax: number;
    productDiscount: number;
    productTotalPrice: number;
    productType: ProductType;
    sellerId: string;
}
interface ElectonicProduct extends BaseProduct {
    productType: 'Electonics';
    warrantyPeriod: number;
    brand: string;
}

interface ClothingProduct extends BaseProduct {
    productType: 'Clothing';
    size: string;
    color: string;
    material: string;
}

interface FurnitureProduct extends BaseProduct {
    productType: 'Furniture';
    dimensions: string;
    weight: number;
    material: string;
}
type Product = ElectonicProduct | ClothingProduct | FurnitureProduct;
interface Order {
    orderId: number;
    orderDate: Date;
    orderStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    products: Product[];
    customerId: string;
    shippingAddress: string;
    paymentMethod:string;
    trackingNumber?: string;
}
type UpdatedProduct = Omit<BaseProduct, 'productId' | 'productTotalPrice' | 'productType'>;
type UpdatedElectornicsProduct = Omit<ElectonicProduct, 'productId' | 'productTotalPrice' | 'productType'>;
type UpdatedClothingProduct = Omit<ClothingProduct, 'productId' | 'productTotalPrice' | 'productType'>;
type UpdatedFurnitureProduct = Omit<FurnitureProduct, 'productId' | 'productTotalPrice' | 'productType'>;
type UpdatedOrder = Omit<Order, 'orderId'| 'orderDate' | 'orderStatus'>;
type EditingProduct = Pick<BaseProduct, 'productName'>;

let nextProductId: number = 1;
let nextOrderId: number = 1;
let nextOrderDate: Date = new Date();

interface Discount {
    applyDiscount(price: number): number;
}

class NoDiscount implements Discount {
    applyDiscount(price: number): number {
        return price;
    }
}

class PercentageDiscount implements Discount {
    constructor(private percentage: number) {}

    applyDiscount(price: number): number {
        return price * (1 - this.percentage / 100);
    }
}

class FixedAmountDiscount implements Discount {
    constructor(private amount: number) {}

    applyDiscount(price: number): number {
        return price - this.amount;
    }
}

class Cart {
    private items: {
        product: Product;
        quantity: number;
    }[] = [];
    private discount: Discount = new NoDiscount();

    constructor(private customerId: string){}

    addItem(product: Product, quantity: number = 1): void {
        const existingItem = this.items.find(item => item.product.productId === product.productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }   else {
            this.items.push({ product, quantity });
        }
    }

    removeItem(productId: number, quantity: number = 1): void {
        const itemIndex = this.items.findIndex(item => item.product.productId === productId);
        if (itemIndex !== -1){
            if (this.items[itemIndex].quantity <= quantity){
                this.items.splice(itemIndex, 1);
            } else {
                this.items [itemIndex].quantity -= quantity;
            }
        }
    }

    setDiscount(strategy: Discount): void {
        this.discount = strategy;
    }

    public calculateSubtotal(): number {
        return this.items.reduce((total, item) => {
            const discountedPrice = this.discount.applyDiscount(item.product.productPrice);
            return total + (discountedPrice * item.quantity);
        }, 0)
    }

    public calculateTotal(): number {
        const subtotal = this.calculateSubtotal();
        const tax = this.items.reduce((total, item) => {
            return total + (item.product.productPrice * (item.product.productTax / 100) * item.quantity);
        }, 0);
        return subtotal + tax;
    }

    getItems(): Product[] {
        return this.items.map(item => item.product)
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    clear(): void {
        this.items = []
    }

    display(): void {
        console.log(`Cart for custormer ${this.customerId}:`);
        this.items.forEach(item => {
            console.log(`${item.quantity} x ${item.product.productName} - KES${item.product.productPrice.toFixed(2)}`);
        });
        console.log (` Subtotal: KES${this.calculateSubtotal().toFixed(2)}`);
        console.log (` Total: KES${this.calculateTotal().toFixed(2)}`);
    }
}
class User {
    public name: string;
    public email: string;
    protected password: string;
    public role: Role;
    public userId: string;
    constructor(_name: string, _email: string, _password: string, _role: Role) {
        this.name = _name;
        this.email = _email;
        this.password = _password;
        this.role = _role;
        this.userId = `user_${Math.random().toString(36).substring(2, 9)}`;
    }
}

class Admin extends User {
    constructor(_name: string, _email: string, _password: string){
        super(_name, _email, _password, 'Admin');
    }

    public addUser(user: User){
        console.log(`${user.role} ${user.name} added by Admin ${this.name}`);
    }

    manageSystem(): void {
        console.log(`${this.name} is managing the system.`)
    }
}

class Seller extends User {
    public products: Product[] = [];

    constructor(_name: string, _email: string, _password: string){
        super(_name, _email, _password, 'Seller');
    }
    
    addElectronicProduct(product: UpdatedElectornicsProduct): ElectonicProduct {
        const newProduct: ElectonicProduct = {
            productId: nextProductId++,
            productType: 'Electonics',
            productTotalPrice: this.calculateTotalPrice(product),
            ...product
        }
        this.products.push(newProduct);
        return newProduct;
    }

    addClothingProduct(product: UpdatedClothingProduct): ClothingProduct {
        const newProduct: ClothingProduct = {
            productId: nextProductId++,
            productType: 'Clothing',
            productTotalPrice: this.calculateTotalPrice(product),
            ...product
        }
        this.products.push(newProduct);
        return newProduct;
    }

    addFurnitureProduct(product: UpdatedFurnitureProduct): FurnitureProduct {
        const newProduct: FurnitureProduct = {
            productId: nextProductId++,
            productType: 'Furniture',
            productTotalPrice: this.calculateTotalPrice(product),
            ...product
        }
        this.products.push(newProduct);
        return newProduct;
    }

    private calculateTotalPrice(product: UpdatedProduct): number {
        return product.productPrice +
            (product.productPrice * product.productTax / 100) -
            (product.productPrice * product.productDiscount / 100)
    }

    removeProduct(product: EditingProduct): void{
        const removeProduct = this.products.find((p) => p.productName === product.productName)
        if (removeProduct){
            this.products = this.products.filter((p) => p.productName !== product.productName);
            // console.log(`Product ${product.productName} removed by Seller ${this.name}`);
        }
    }

    listProducts(): void {
        console.log(`Products from ${this.name}:`);
        this.products.forEach(product => {
            console.log(`[${product.productType}] ${product.productName} - KES${product.productPrice.toFixed(2)}`);

            if (product.productType === 'Electonics'){
                console.log(` Brand: ${product.brand}, Warranty: ${product.warrantyPeriod} months`)
            } else if (product.productType === 'Clothing'){
                console.log(` Size: ${product.size}, Color ${product.color}`);
            } else if (product.productType === 'Furniture'){
                console.log(`Dimensions: ${product.dimensions}, Weight: ${product.weight}kg`);
            }
        })
    }
}

class Customer extends User {
    public cart: Cart
    public orders: Order[] = [];
    constructor(_name: string, _email: string, _password: string, public shippingAddress: string){
        super(_name, _email, _password, 'Customer');
        this.cart = new Cart(this.userId);
    }
    public addToCart(product: Product, quantity: number = 1): void{
        this.cart.addItem(product, quantity);
        console.log(`Added ${quantity} ${product.productName} to cart`)
    }

    public removeFromCart(productId: number, quantity: number = 1): void{
        this.cart.removeItem(productId, quantity);
        console.log(`Removed ${quantity} of product ID ${productId} from cart`)
    }

    applyDiscount(discount: Discount): void {
        this.cart.setDiscount(discount);
        console.log(`Discount applied to the cart`)
    }

    viewCart(): void {
        this.cart.display();
    }

    public placeOrder(paymentMethod: string, trackingNumber?: string): Order | null{
        if (this.cart.isEmpty()){
            console.log(`Cannot place order: Cart is Empty`)
            return null;
        }
        const newOrder : Order = {
            orderId: nextOrderId++,
            orderDate: nextOrderDate,
            orderStatus: 'Pending',
            products: this.cart.getItems(),
            customerId: this.userId,
            shippingAddress: this.shippingAddress,
            paymentMethod,
            trackingNumber
       };

        this.orders.push(newOrder);
        this.cart.clear();
        console.log(`Order ${newOrder.orderId} has been placed successfully`);
        return newOrder
    

    }

    public makePayment(orderId: number){
        const selectedOrder = this.orders.find((o) => o.orderId === orderId);
        if (selectedOrder){
            selectedOrder.orderStatus = 'Shipped';
            console.log(`Payment has been made for Order ${orderId} by ${this.name}`);
        }
        else{
            console.log(`Order ${orderId} not found`);
        }
    }

    trackOrder(orderId: number): void {
        const order = this.orders.find(o => o.orderId === orderId);
        if(order) {
            console.log(`Order ${order.orderId}:`);
            console.log(` Status: ${order.orderStatus}`);
            console.log(` Date: ${order.orderDate.toLocaleDateString()}`);
            if (order.trackingNumber) {
                console.log(` Tracking: ${order.trackingNumber}`);
            }
        } else {
            console.log(`Order ${orderId} not found`);
        }
    }
}



// Create users
const admin = new Admin('System Admin', 'admin@example.com', 'secure123');
const seller1 = new Seller('Tech Store', 'tech@example.com', 'seller123');
const seller2 = new Seller('Fashion House', 'fashion@example.com', 'seller123');
const customer = new Customer('John Doe', 'john@example.com', 'customer123', '123 Main St, City');

// Add products
const laptop = seller1.addElectronicProduct({
    productName: 'Lenovo x13',
    productPrice: 45000.00,
    productTax: 10,
    productDiscount: 5,
    sellerId: seller1.userId,
    warrantyPeriod: 24,
    brand: 'TechMaster'
});

const smartphone = seller1.addElectronicProduct({
    productName: 'Iphone X',
    productPrice: 59900.00,
    productTax: 8,
    productDiscount: 0,
    sellerId: seller1.userId,
    warrantyPeriod: 12,
    brand: 'MobileTech'
});

const tshirt = seller2.addClothingProduct({
    productName: 'Cotton T-Shirt',
    productPrice: 2000.00,
    productTax: 5,
    productDiscount: 0,
    sellerId: seller2.userId,
    size: 'M',
    color: 'Blue',
    material: 'Cotton'
});

const chair = seller1.addFurnitureProduct({
    productName: 'Office Chair',
    productPrice: 19900.00,
    productTax: 7,
    productDiscount: 10,
    sellerId: seller1.userId,
    dimensions: '24x24x36',
    weight: 8,
    material: 'Leather'
});

// List products
seller1.listProducts();
seller2.listProducts();

// Customer actions
customer.addToCart(laptop);
customer.addToCart(smartphone, 2);
customer.addToCart(tshirt);
customer.viewCart();

// Apply discount
customer.applyDiscount(new PercentageDiscount(10));
customer.viewCart();

// Place order
const order = customer.placeOrder('Credit Card', 'TRACK123456');
if (order) {
    customer.trackOrder(order.orderId);
    customer.makePayment(order.orderId);
    customer.trackOrder(order.orderId);
}

customer.viewCart();


