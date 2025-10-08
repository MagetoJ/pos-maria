import { NextResponse } from "next/server";
import { menuItems } from "@/lib/data"; // Using mock data for now

/**
 * Handles GET requests to fetch all menu items.
 * @returns {NextResponse} A JSON response containing the list of menu items.
 */
export async function GET() {
  // Later, this will fetch from the database:
  // const allMenuItems = await prisma.menuItem.findMany();
  return NextResponse.json(menuItems);
}

/**
 * Handles POST requests to add a new menu item.
 * @param {Request} request - The incoming request object, containing the new menu item data.
 * @returns {NextResponse} A JSON response with the newly created menu item.
 */
export async function POST(request: Request) {
  const data = await request.json();

  // In a real app, add validation here.

  // This is where you would save the new item to your database.
  console.log("New menu item received:", data);

  // Return the new item to confirm it was received.
  return NextResponse.json(data, { status: 201 });
}