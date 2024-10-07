/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Retrieve existing products to associate with orders
  const products = await prisma.product.findMany();

  if (products.length === 0) {
    throw new Error('No products found in the database. Please seed some products first.');
  }

  // Create 25 orders with various statuses
  const orderStatuses = ['out for delivery'];

  for (let i = 0; i < 10; i++) {
    // Randomly select a product for the order
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    // Generate a random quantity for the product in the order
    const randomQuantity = Math.floor(Math.random() * 5) + 1; // Random quantity between 1 and 5

    // Randomly select a status for the order
    const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];

    // Calculate the total amount for the order
    const totalAmount = randomProduct.price * randomQuantity;

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId: '66f581b0de1bf3c94e994143', // Given userId
        totalAmount,
        status: randomStatus,
        products: {
          create: {
            productId: randomProduct.id,
            quantity: randomQuantity,
          },
        },
      },
    });

    console.log(`Created order ${i + 1} with status: ${randomStatus}, total amount: ${totalAmount}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
