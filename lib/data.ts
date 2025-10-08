import type { User, MenuItem, Table, Order } from "./types"

// Mock users data
export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    role: "waiter",
    pin: "1234",
    email: "john@mariahavens.com",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Jane Smith",
    role: "waiter",
    pin: "5678",
    email: "jane@mariahavens.com",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    role: "waiter",
    pin: "9012",
    email: "mike@mariahavens.com",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Admin User",
    role: "admin",
    pin: "9999",
    email: "admin@mariahavens.com",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "7",
    name: "Emily Brown",
    role: "reception",
    pin: "4444",
    email: "emily@mariahavens.com",
    isActive: true,
    createdAt: new Date("2024-01-01"),
  },
]

// Mock menu items
export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Grilled Chicken",
    description: "Tender grilled chicken with herbs",
    price: 1599,
    category: "Main Course",
    available: true,
  },
  {
    id: "2",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with Caesar dressing",
    price: 899,
    category: "Appetizer",
    available: true,
  },
  {
    id: "3",
    name: "Beef Burger",
    description: "Juicy beef patty with cheese and vegetables",
    price: 1299,
    category: "Main Course",
    available: true,
  },
  {
    id: "4",
    name: "Pasta Carbonara",
    description: "Creamy pasta with bacon and parmesan",
    price: 1499,
    category: "Main Course",
    available: true,
  },
  {
    id: "5",
    name: "French Fries",
    description: "Crispy golden fries",
    price: 499,
    category: "Side",
    available: true,
  },
  {
    id: "6",
    name: "Coca Cola",
    description: "Chilled soft drink",
    price: 299,
    category: "Beverage",
    available: true,
  },
  {
    id: "7",
    name: "Orange Juice",
    description: "Fresh squeezed orange juice",
    price: 399,
    category: "Beverage",
    available: true,
  },
  {
    id: "8",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with frosting",
    price: 699,
    category: "Dessert",
    available: true,
  },
]

// Mock tables
export const tables: Table[] = [
  { id: "1", number: "1", status: "available", capacity: 2 },
  { id: "2", number: "2", status: "available", capacity: 4 },
  { id: "3", number: "3", status: "available", capacity: 4 },
  { id: "4", number: "4", status: "available", capacity: 6 },
  { id: "5", number: "5", status: "available", capacity: 2 },
  { id: "6", number: "6", status: "available", capacity: 8 },
]

export const orders: Order[] = [
  {
    id: "ORD-001",
    tableNumber: "1",
    items: [
      { menuItem: menuItems[0], quantity: 2 },
      { menuItem: menuItems[5], quantity: 2 },
    ],
    status: "completed",
    waiterName: "John Doe",
    waiterId: "1",
    total: 3796,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
  },
  {
    id: "ORD-002",
    tableNumber: "3",
    items: [
      { menuItem: menuItems[2], quantity: 1 },
      { menuItem: menuItems[4], quantity: 1 },
      { menuItem: menuItems[6], quantity: 1 },
    ],
    status: "completed",
    waiterName: "Jane Smith",
    waiterId: "2",
    total: 2197,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
  },
  {
    id: "ORD-003",
    tableNumber: "2",
    items: [
      { menuItem: menuItems[3], quantity: 2 },
      { menuItem: menuItems[1], quantity: 1 },
    ],
    status: "completed",
    waiterName: "John Doe",
    waiterId: "1",
    total: 3897,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
  },
  {
    id: "ORD-004",
    tableNumber: "4",
    items: [
      { menuItem: menuItems[0], quantity: 3 },
      { menuItem: menuItems[7], quantity: 2 },
    ],
    status: "completed",
    waiterName: "Mike Johnson",
    waiterId: "3",
    total: 6195,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
  },
  {
    id: "ORD-005",
    tableNumber: "5",
    items: [
      { menuItem: menuItems[2], quantity: 2 },
      { menuItem: menuItems[5], quantity: 3 },
    ],
    status: "completed",
    waiterName: "Jane Smith",
    waiterId: "2",
    total: 3495,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000),
  },
]

export function getWaiterPerformance(waiterId: string) {
  const waiterOrders = orders.filter((order) => order.waiterId === waiterId && order.status === "completed")
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = waiterOrders.filter((order) => order.createdAt >= today)

  const totalSales = waiterOrders.reduce((sum, order) => sum + order.total, 0)
  const salesToday = todayOrders.reduce((sum, order) => sum + order.total, 0)

  return {
    totalOrders: waiterOrders.length,
    totalSales,
    ordersToday: todayOrders.length,
    salesToday,
    averageOrderValue: waiterOrders.length > 0 ? totalSales / waiterOrders.length : 0,
    tablesServed: new Set(waiterOrders.map((o) => o.tableNumber)).size,
    recentOrders: waiterOrders.slice(-5).reverse(),
  }
}

export function getAllWaitersPerformance() {
  const waiters = users.filter((u) => u.role === "waiter")
  return waiters.map((waiter) => ({
    waiter,
    performance: getWaiterPerformance(waiter.id),
  }))
}
