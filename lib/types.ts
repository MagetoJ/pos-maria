export type UserRole = "admin" | "waiter" | "reception"

export interface User {
  id: string
  name: string
  role: UserRole
  pin: string
  email?: string
  isActive: boolean
  createdAt: Date
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  available: boolean
}

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  tableNumber: string
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "completed" | "cancelled"
  waiterName: string
  waiterId: string
  total: number
  createdAt: Date
  completedAt?: Date
}

export interface Table {
  id: string
  number: string
  status: "available" | "occupied" | "reserved" | "needs-cleaning"
  capacity: number
}

export interface Receipt {
  id: string
  orderId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  waiterName: string
  tableNumber: string
  paymentMethod: "cash" | "card" | "mobile"
  createdAt: Date
}

export interface PerformanceMetrics {
  totalOrders: number
  totalSales: number
  averageOrderValue: number
  ordersToday: number
  salesToday: number
  topItems: { item: string; count: number }[]
  recentOrders: Order[]
}

export interface WaiterPerformance extends PerformanceMetrics {
  tablesServed: number
  averageServiceTime: number
  customerRating: number
}

export interface ReceptionistPerformance {
  guestsCheckedIn: number
  roomsOccupied: number
  reservationsToday: number
  totalRevenue: number
  pendingCheckouts: number
}
