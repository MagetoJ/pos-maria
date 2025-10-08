import { NextResponse } from "next/server";
import { orders } from "@/lib/data"; // Using mock data for now

/**
 * Handles POST requests from the QR code ordering page.
 * @param {Request} request - The incoming request object containing the order details.
 * @returns {NextResponse} A JSON response with the newly created order.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // In a real app, you would validate the tableId and cart items here.

    const newOrder = {
      id: `QR-ORD-${Date.now()}`,
      tableNumber: data.tableId,
      items: data.cart,
      status: "pending" as const, // Orders from customers start as 'pending'
      waiterName: "Unassigned", // No waiter assigned yet
      waiterId: "unassigned",
      total: data.total,
      createdAt: new Date(),
    };

    // Add the new order to our in-memory orders array
    orders.push(newOrder);

    console.log("QR Order received:", newOrder);

    // Return the newly created order
    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    console.error("Failed to process QR order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}