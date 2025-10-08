import { NextResponse } from "next/server";
import { orders, users } from "@/lib/data";
import type { Order } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const waiterId = params.id;
  const waiter = users.find((u) => u.id === waiterId);

  if (!waiter) {
    return NextResponse.json({ error: "Waiter not found" }, { status: 404 });
  }

  const myOrders = orders.filter((order) => order.waiterId === waiterId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = myOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });

  const performance = {
    ordersToday: todayOrders.length,
    salesToday: todayOrders.reduce((sum, order) => sum + order.total, 0),
    averageOrderValue:
      todayOrders.length > 0
        ? todayOrders.reduce((sum, order) => sum + order.total, 0) /
          todayOrders.length
        : 0,
    tablesServed: new Set(todayOrders.map((order) => order.tableNumber)).size,
    averageServiceTime: 18, // minutes (mock data)
    customerRating: 4.8, // (mock data)
    totalOrders: myOrders.length,
    totalSales: myOrders.reduce((sum, order) => sum + order.total, 0),
  };

  const recentOrders = myOrders
    .slice(-10)
    .reverse()
    .map((order: Order) => ({
      id: order.id,
      table: order.tableNumber,
      items: order.items.length,
      total: order.total,
      status: order.status,
      time: new Date(order.createdAt).toLocaleTimeString(),
    }));

  const itemCounts: Record<string, number> = {};
  myOrders.forEach((order) => {
    order.items.forEach((item) => {
      const name = item.menuItem.name;
      itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
    });
  });

  const topItems = Object.entries(itemCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count]) => ({ name, count }));

  return NextResponse.json({
    performance,
    recentOrders,
    topItems,
    waiterName: waiter.name,
  });
}