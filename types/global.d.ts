export {}

declare global {
  interface User {
    id: string;
    clerkUserId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    carts: Cart[];
    wallet?: Wallet;
    orders: Order[];
    transactions: Transaction[];
  }

  interface Cart {
    id: string;
    userId: string;
    products: ProductInCart[];
    user: User;
  }

  interface Wallet {
    id: string;
    userId: string;
    balance: number;
    user: User;
    transactions: Transaction[];
  }

  interface Order {
    id: string;
    userId: string;
    products: ProductInOrder[];
    totalAmount: number;
    createdAt: Date;
    status: string; // e.g., "pending", "completed", "cancelled"
    user: User;
  }

  interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number; // Available stock quantity
    carts: ProductInCart[];
    orders: ProductInOrder[];
  }

  interface Transaction {
    id: string;
    walletId: string;
    amount: number;
    createdAt: Date;
    wallet: Wallet;
    user?: User;
    userId?: string;
    typeOfTransaction: string;
  }

  interface ProductInCart {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    cart: Cart;
    product: Product;
  }

  interface ProductInOrder {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    order: Order;
    product: Product;
  }
}
