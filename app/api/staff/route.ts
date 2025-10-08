import { NextResponse } from "next/server";
import { users } from "@/lib/data"; // Using mock data for now

/**
 * Handles GET requests to fetch all users.
 * In a real application, this would fetch from a database.
 * @returns {NextResponse} A JSON response containing the list of all users.
 */
export async function GET() {
  // Later, this will be replaced with a database call, like:
  // const allUsers = await prisma.user.findMany();
  return NextResponse.json(users);
}

/**
 * Handles POST requests to add a new staff member.
 * @param {Request} request - The incoming request object, containing the new staff data.
 * @returns {NextResponse} A JSON response with the newly created staff member.
 */
export async function POST(request: Request) {
  const data = await request.json();

  // In a real app, you would add validation (e.g., with Zod) here.

  // This is where you would add the new user to your database.
  // For now, we'll just log it to the console.
  console.log("New staff member data received:", data);

  // We return the received data as a confirmation.
  return NextResponse.json(data, { status: 201 });
}