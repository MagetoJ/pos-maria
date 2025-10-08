import { NextResponse } from "next/server";
import { tables } from "@/lib/data"; // Using mock data for now

/**
 * Handles GET requests to fetch all restaurant tables.
 * @returns {NextResponse} A JSON response containing the list of tables.
 */
export async function GET() {
  // Later, this will be a database call:
  // const allTables = await prisma.table.findMany();
  return NextResponse.json(tables);
}