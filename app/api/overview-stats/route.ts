import { NextResponse } from "next/server";
import { orders, users, tables } from "@/lib/data";

/**
 * Handles GET requests to fetch aggregated statistics for the admin overview dashboard.
 * @returns {NextResponse} A JSON response with calculated dashboard stats.
 */
export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter((o) => o.createdAt >= today);
  const todaysCompletedOrders = todaysOrders.filter(o => o.status === 'completed');

  const totalSalesToday = todaysCompletedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersToday = todaysOrders.length;
  const activeStaff = users.filter((u) => u.isActive).length;
  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const totalTables = tables.length;
  const occupancyRate = totalTables > 0 ? (occupiedTables / totalTables) * 100 : 0;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeWaiters = users.filter((u) => u.role === "waiter" && u.isActive).length;

  const stats = {
    totalSalesToday,
    totalOrdersToday,
    activeStaff,
    occupiedTables,
    totalTables,
    occupancyRate,
    pendingOrders,
    activeWaiters
  };

  return NextResponse.json(stats);
}