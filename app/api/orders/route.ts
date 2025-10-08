import { NextResponse } from "next/server";
import { orders, users } from "@/lib/data"; // Using mock data for now

/**
 * Handles POST requests to create a new order.
 * This includes PIN verification for the selected waiter.
 * @param {Request} request - The incoming request object containing order details.
 * @returns {NextResponse} A JSON response with the new order or an error.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Find the selected waiter from our mock data
    const waiter = users.find((w) => w.id === data.selectedWaiter);

    // Verify waiter and PIN
    if (!waiter || waiter.pin !== data.waiterPin) {
      return NextResponse.json({ error: "Invalid Waiter PIN" }, { status: 401 });
    }

    // Create the new order object
    const newOrder = {
      id: `ORD-${Date.now()}`,
      tableNumber: data.selectedTable,
      items: data.cart,
      status: "completed" as const,
      waiterName: waiter.name,
      waiterId: waiter.id,
      total: data.total,
      createdAt: new Date(),
      completedAt: new Date(),
    };

    // Add the new order to our in-memory orders array
    orders.push(newOrder);

    console.log("Order placed successfully:", newOrder);

    // Return the newly created order
    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    console.error("Failed to process order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}